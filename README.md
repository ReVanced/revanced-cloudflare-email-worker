# Email Spam Filter

A Cloudflare Worker for handling email auto-replies and forwarding.

## Features

- Auto-replies to incoming emails
- Forwards emails with subjects to a specified address
- Customizable sender information and message content

## Setup

### Environment Variables

This project uses environment variables to configure sender information, email addresses, and message content. This allows you to customize the behavior for different environments without committing sensitive information to git.

#### Required Environment Variables

Copy `.env.example` to `.env.local` and fill in your actual values:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your values:

- `SENDER_NAME`: Name displayed as the sender of auto-reply emails
- `SENDER_EMAIL`: Email address used as the sender
- `REPLY_EMAIL`: Email address used for replies (usually same as SENDER_EMAIL)
- `FORWARD_EMAIL`: Email address where messages should be forwarded
- `ORGANIZATION_NAME`: Organization name used in email message content
- `WEBSITE_URL`: Website URL referenced in email messages

#### Setting Environment Variables in Cloudflare

For production deployment, set these environment variables in your Cloudflare Worker:

```bash
wrangler secret put SENDER_NAME
wrangler secret put SENDER_EMAIL
wrangler secret put REPLY_EMAIL
wrangler secret put FORWARD_EMAIL
wrangler secret put ORGANIZATION_NAME
wrangler secret put WEBSITE_URL
```

### Development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables (see above)

3. Run locally:

   ```bash
   wrangler dev
   ```

### Deployment

```bash
wrangler deploy
```
