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
	async email(message, env, ctx) {
		const parser = new EmailParser();
		const raw = new Response(message.raw);
		const email = await parser.parse(await raw.arrayBuffer());

		const shouldForward = hasSecretString(email, env);
		if (shouldForward) {
			const relay = createMimeMessage();

			relay.setSender({ name: `Relay: ${email.from?.name || message.from}`, addr: env.SENDER_EMAIL });
			relay.setRecipient({ addr: env.FORWARD_EMAIL });

			relay.setSubject(`[Relay] ${email.subject || '(No subject)'}`);
			relay.setHeader('Reply-To', new Mailbox(message.from));

			const content = `
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
	</head>
	<body>
		<div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 20px; background: #f9f9f9;">
    		<b>Original From:</b> ${email.from?.address || message.from}<br>
    		<b>Original To:</b> ${message.to}<br>
		</div>
		${email.html || email.text || '(No content)'}
	</body>
</html>
`;
			relay.addMessage({ contentType: 'text/html', data: content.trim() });

			const relayMessage = new EmailMessage(env.SENDER_EMAIL, env.FORWARD_EMAIL, relay.asRaw());
			return await env.RESENDER.send(relayMessage);
		}

		const reply = createMimeMessage();

		reply.setSender({ name: env.SENDER_NAME, addr: env.SENDER_EMAIL });
		reply.setRecipient({ addr: message.from });

		reply.setHeader('In-Reply-To', message.headers.get('Message-ID') ?? '');
		reply.setHeader('Reply-To', new Mailbox(env.REPLY_TO_EMAIL));

		reply.setSubject(env.BOUNCE_MAIL_SUBJECT);
		reply.addMessage({ contentType: 'text/html', data: env.BOUNCE_MAIL_BODY });

		const replyMessage = new EmailMessage(env.SENDER_EMAIL, message.from, reply.asRaw());
		await message.reply(replyMessage);
	},
} satisfies ExportedHandler<Env>;
