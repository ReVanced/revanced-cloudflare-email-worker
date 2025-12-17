import EmailParser from 'postal-mime';
import { createMimeMessage } from 'mimetext/browser'; // doesn't require node compatibility
import { EmailMessage } from 'cloudflare:email';
import { hasSecretString, matchAll } from './matchers';

export default {
	// https://developers.cloudflare.com/email-routing/email-workers/local-development/
	async email(message, env, ctx) {
		const parser = new EmailParser();
		const raw = new Response(message.raw);
		const email = await parser.parse(await raw.arrayBuffer());

		const forward = await matchAll([hasSecretString])(email, env, ctx);
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
