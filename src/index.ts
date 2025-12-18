import EmailParser, { type Email } from 'postal-mime';
import { createMimeMessage } from 'mimetext/browser';
import { EmailMessage } from 'cloudflare:email';

const hasSecretString = (email: Email, env: Env, ctx: ExecutionContext) => {
	const subject = (email.subject || '').toLowerCase();
	const bodyHtml = (email.html || '').toLowerCase();
	const bodyText = (email.text || '').toLowerCase();
	const secret = env.SECRET.trim().toLowerCase();

	return subject.includes(secret) || bodyHtml.includes(secret) || bodyText.includes(secret);
};

export default {
	async email(message, env, ctx) {
		const parser = new EmailParser();
		const raw = new Response(message.raw);
		const email = await parser.parse(await raw.arrayBuffer());

		const forward = hasSecretString(email, env, ctx);
		if (forward) return await message.forward(env.FORWARD_EMAIL);

		const msg = createMimeMessage();

		msg.setSender({ name: env.SENDER_NAME, addr: env.SENDER_EMAIL });
		msg.setRecipient(message.from);

		msg.setHeader('In-Reply-To', message.headers.get('Message-ID') ?? '');

		msg.setSubject(env.BOUNCE_MAIL_SUBJECT);
		msg.addMessage({ contentType: 'text/html', data: env.BOUNCE_MAIL_BODY });

		const replyMessage = new EmailMessage(env.SENDER_EMAIL, message.from, msg.asRaw());
		await message.reply(replyMessage);
	},
} satisfies ExportedHandler<Env>;
