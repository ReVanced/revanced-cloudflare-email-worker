import EmailParser, { type Email } from 'postal-mime';
import { createMimeMessage, Mailbox } from 'mimetext/browser';
import { EmailMessage } from 'cloudflare:email';

const hasSecretString = (email: Email, env: Env) => {
	const subject = (email.subject || '').toLowerCase();
	const bodyHtml = (email.html || '').toLowerCase();
	const bodyText = (email.text || '').toLowerCase();
	const secret = env.SECRET.trim().toLowerCase();

	return subject.includes(secret) || bodyHtml.includes(secret) || bodyText.includes(secret);
};

export default {
	async email(message, env, _) {
		const parser = new EmailParser();
		const raw = new Response(message.raw);
		const email = await parser.parse(await raw.arrayBuffer());

		const shouldForward = hasSecretString(email, env);
		if (shouldForward) return await message.forward(env.FORWARD_EMAIL);

		const msg = createMimeMessage();

		msg.setSender({ name: env.SENDER_NAME, addr: env.SENDER_EMAIL });
		msg.setRecipient({ addr: message.from });

		msg.setHeader('In-Reply-To', message.headers.get('Message-ID') ?? '');
		msg.setHeader('Reply-To', new Mailbox(env.REPLY_TO_EMAIL));

		msg.setSubject(env.BOUNCE_MAIL_SUBJECT);
		msg.addMessage({ contentType: 'text/html', data: env.BOUNCE_MAIL_BODY });

		const replyMessage = new EmailMessage(env.SENDER_EMAIL, message.from, msg.asRaw());
		await message.reply(replyMessage);
	},
} satisfies ExportedHandler<Env>;
