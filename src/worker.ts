import { ExecutionContext, ForwardableEmailMessage } from '@cloudflare/workers-types';
import { CATCH_ALL, EmailKit, EmailRouter, EnhancedMessage, REJECT_ALL, SizeGuard, createMimeMessage, respond } from 'cloudflare-email';

export interface Env {
	SENDER_NAME: string;
	SENDER_EMAIL: string;
	REPLY_EMAIL: string;
	FORWARD_EMAIL: string;
	ORGANIZATION_NAME: string;
	WEBSITE_URL: string;
}

export default {
	async email(message: ForwardableEmailMessage, env: Env, ctx: ExecutionContext): Promise<void> {
		const router = new EmailRouter()
			.match(
				(m) =>{
                    m.
                    return true;
                },
				new EmailRouter()
					.match(/^admin@/, async (message) => {
						const msg = respond(message);
						msg.addMessage({
							contentType: 'text/plain',
							data: "Hello, I'm the admin!",
						});
						await message.reply(msg);
					})
					.match(
						// function matchers are also supported, even async ones which query databases
						(m) => m.from.length % 2 === 0,
						async (message) => {
							const msg = respond(message);
							msg.addMessage({
								contentType: 'text/plain',
								data: `The length of your email address is even!`,
							});
							await message.reply(msg);
						}
					)
					.match(CATCH_ALL, async (message) => {
						const msg = respond(message);
						msg.addMessage({
							contentType: 'text/plain',
							data: 'The length of your email address is odd!',
						});
						await message.reply(msg);
					})
			)
			.match(...REJECT_ALL('Your email is rejected! :P'));

		const kit = new EmailKit()
			.use(new SizeGuard(10 * 1024 * 1024))
			.use(router);

		await kit.process(message);
	},
};

const s = {
	async email(message, env, ctx) {
		// Get environment variables with fallbacks
		const envSenderName = env.SENDER_NAME || 'ReVanced';
		const senderEmail = env.SENDER_EMAIL || 'contact@revanced.app';
		const replyEmail = env.REPLY_EMAIL || 'contact@revanced.app';
		const forwardEmail = env.FORWARD_EMAIL || 'revanced@osumatrix.me';
		const organizationName = env.ORGANIZATION_NAME || 'ReVanced';
		const websiteUrl = env.WEBSITE_URL || 'https://revanced.app';

		const msg = createMimeMessage();
		msg.setHeader('In-Reply-To', message.headers.get('Message-ID'));
		msg.setSender({ name: envSenderName, addr: senderEmail });
		msg.setRecipient(message.from);
		msg.setSubject(`${organizationName} received your email`);

		const subject = message.headers.get('subject');
		const fromHeader = message.from;
		let senderName = '';
		if (typeof fromHeader === 'string') {
			const match = fromHeader.match(/^(.*?)(?:\s*<.*?>)?$/);
			senderName = match && match[1] ? match[1].trim() : fromHeader;
		} else if (fromHeader && fromHeader.name) {
			senderName = fromHeader.name;
		}
		if (!senderName) senderName = 'there';

		const hasSubject = subject && subject.trim().length > 0;
		if (hasSubject) {
			msg.addMessage({
				contentType: 'text/plain',
				data:
					`Hello ${senderName},\n\n` +
					`Thank you for contacting ${organizationName} regarding: "` +
					subject +
					`".\nWe have received your email and will review it soon. Please note that support or help is not provided via this email, and as such will not be replied to. For support or help, visit our social media links present on ${websiteUrl}.\n\n` +
					`Sincerely,\n${organizationName}`,
			});
		} else {
			msg.addMessage({
				contentType: 'text/plain',
				data:
					`Hello ${senderName},\n\n` +
					`Your email does not contain a subject. Please note that support or help is not provided via this email, and as such will not be replied to. For support or help, visit our social media links present on ${websiteUrl}.\n\n` +
					`Sincerely,\n${organizationName}`,
			});
		}

		const replyMessage = new EmailMessage(replyEmail, message.from, msg.asRaw());
		await message.reply(replyMessage);

		if (hasSubject) await message.forward(forwardEmail);
	},
};
