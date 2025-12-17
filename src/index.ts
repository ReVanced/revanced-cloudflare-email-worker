import EmailParser, { type Email } from 'postal-mime';
import { createMimeMessage } from 'mimetext/browser'; // doesn't require node compatibility
import { EmailMessage } from 'cloudflare:email';

const hasSecretString = async (email: Email, secretString: string, matchCase: boolean = false) => {
	let subject = email.subject || '';
	subject = matchCase ? subject : subject.toLowerCase();

	let body = email.html || '';
	body = matchCase ? body : body.toLowerCase();

	secretString = secretString.trim();
	secretString = matchCase ? secretString : secretString.toLowerCase();

	return subject.includes(secretString) || body.includes(secretString);
};

export default {
	// https://developers.cloudflare.com/email-routing/email-workers/local-development/
	async email(message, env, ctx) {
		const parser = new EmailParser();
		const raw = new Response(message.raw);
		const email = await parser.parse(await raw.arrayBuffer());

		const forward = await hasSecretString(email, env.SECRET_STRING, env.MATCH_CASE === 'true');
		if (forward) return await message.forward(env.FORWARD_EMAIL);

		const msg = createMimeMessage();

		msg.setSender({ name: env.SENDER_NAME, addr: env.SENDER_EMAIL });
		msg.setRecipient(message.from);

		const messageId = message.headers.get('Message-ID');
		if (messageId) msg.setHeader('In-Reply-To', messageId);

		msg.setSubject(env.BOUNCE_MAIL_SUBJECT);
		msg.addMessage({ contentType: 'text/plain', data: env.BOUNCE_MAIL_BODY });

		const replyMessage = new EmailMessage(env.SENDER_EMAIL, message.from, msg.asRaw());
		await message.reply(replyMessage);
	},
} satisfies ExportedHandler<Env>;
