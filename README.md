# ReVanced Cloudflare Email Worker

A Cloudflare Worker for handling email auto-replies and forwarding.

## Features

- Auto-replies to incoming emails
- Forwards emails with subjects to a specified address
- Customizable sender information and message content

## Setup

### Environment Variables

This project uses environment variables to configure sender information, email addresses, and message content. This allows you to customize the behavior for different environments without committing sensitive information to git.

#### Required Environment Variables

Copy `.env.example` to `.env` and fill in your actual values:

```bash
cp .env.example .env
```

#### Setting Environment Variables in Cloudflare

For production deployment, set these environment variables using Wrangler secrets and/or the Cloudflare dashboard:

```bash
wrangler secret put SENDER_NAME
wrangler secret put SENDER_EMAIL
wrangler secret put FORWARD_EMAIL
wrangler secret put SECRET
wrangler secret put BOUNCE_MAIL_SUBJECT
wrangler secret put BOUNCE_MAIL_BODY
```

Alternatively, configure variables in `wrangler.toml` (note: use secrets for sensitive values like the SECRET string).

### Development

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables ([see above](#required-environment-variables))

3. Run locally:

```bash
npm run types
npm run dev
```

### Deployment

```bash
npm run deploy
```
