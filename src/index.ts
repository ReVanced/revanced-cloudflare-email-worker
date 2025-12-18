import EmailParser, { type Email } from 'postal-mime';
import { createMimeMessage } from 'mimetext/browser';
import { EmailMessage } from 'cloudflare:email';

export const hasSecretString = (email: Email, env: Env, ctx: ExecutionContext) => {
	const matchCase = env.MATCH_CASE === 'true';

	let subject = email.subject || '';
	subject = matchCase ? subject : subject.toLowerCase();

	let bodyHtml = email.html || '';
	bodyHtml = matchCase ? bodyHtml : bodyHtml.toLowerCase();

	let bodyText = email.text || '';
	bodyText = matchCase ? bodyText : bodyText.toLowerCase();

	let secretString = env.SECRET_STRING.trim();
	secretString = matchCase ? secretString : secretString.toLowerCase();

	return subject.includes(secretString) || bodyHtml.includes(secretString) || bodyText.includes(secretString);
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
