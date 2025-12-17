import type { Email } from 'postal-mime';

export type Matcher = (email: Email, env: Env, ctx: ExecutionContext) => boolean | Promise<boolean>;

export const matchAll = (matchers: Matcher[]): Matcher => {
	return async (email: Email, env: Env, ctx: ExecutionContext) => {
		for (const matcher of matchers) {
			const result = await matcher(email, env, ctx);
			if (!result) return false;
		}
		return true;
	};
};

export const matchAny = (matchers: Matcher[]): Matcher => {
	return async (email: Email, env: Env, ctx: ExecutionContext) => {
		for (const matcher of matchers) {
			const result = await matcher(email, env, ctx);
			if (result) return true;
		}
		return false;
	};
};

export const hasSecretString: Matcher = (email, env, ctx) => {
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
