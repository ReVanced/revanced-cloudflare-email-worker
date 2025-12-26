<p align="center">
  <picture>
    <source
      width="256px"
      media="(prefers-color-scheme: dark)"
      srcset="assets/revanced-headline/revanced-headline-vertical-dark.svg"
    >
    <img 
      width="256px"
      src="assets/revanced-headline/revanced-headline-vertical-light.svg"
    >
  </picture>
  <br>
  <a href="https://revanced.app/"><picture><source height="24px" media="(prefers-color-scheme: dark)" srcset="assets/revanced-logo/revanced-logo.svg" /><img height="24px" src="assets/revanced-logo/revanced-logo.svg" /></picture></a>&nbsp;&nbsp;&nbsp;
	<a href="https://github.com/ReVanced"><picture><source height="24px" media="(prefers-color-scheme: dark)" srcset="https://i.ibb.co/dMMmCrW/Git-Hub-Mark.png" /><img height="24px" src="https://i.ibb.co/9wV3HGF/Git-Hub-Mark-Light.png" /></picture></a>&nbsp;&nbsp;&nbsp;
  <a href="http://revanced.app/discord"><picture><source height="24px" media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/13122796/178032563-d4e084b7-244e-4358-af50-26bde6dd4996.png" /><img height="24px" src="https://user-images.githubusercontent.com/13122796/178032563-d4e084b7-244e-4358-af50-26bde6dd4996.png" /></picture></a>&nbsp;&nbsp;&nbsp;
  <a href="https://reddit.com/r/revancedapp"><picture><source height="24px" media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/13122796/178032351-9d9d5619-8ef7-470a-9eec-2744ece54553.png" /><img height="24px" src="https://user-images.githubusercontent.com/13122796/178032351-9d9d5619-8ef7-470a-9eec-2744ece54553.png" /></picture></a>&nbsp;&nbsp;&nbsp;
  <a href="https://t.me/app_revanced"><picture><source height="24px" media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/13122796/178032213-faf25ab8-0bc3-4a94-a730-b524c96df124.png" /><img height="24px" src="https://user-images.githubusercontent.com/13122796/178032213-faf25ab8-0bc3-4a94-a730-b524c96df124.png" /></picture></a>&nbsp;&nbsp;&nbsp;
  <a href="https://x.com/revancedapp"><picture><source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/93124920/270180600-7c1b38bf-889b-4d68-bd5e-b9d86f91421a.png"><img height="24px" src="https://user-images.githubusercontent.com/93124920/270108715-d80743fa-b330-4809-b1e6-79fbdc60d09c.png" /></picture></a>&nbsp;&nbsp;&nbsp;
  <a href="https://www.youtube.com/@ReVanced"><picture><source height="24px" media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/13122796/178032714-c51c7492-0666-44ac-99c2-f003a695ab50.png" /><img height="24px" src="https://user-images.githubusercontent.com/13122796/178032714-c51c7492-0666-44ac-99c2-f003a695ab50.png" /></picture>
  </a>
  <br>
  <br>
  Continuing the legacy of Vanced
</p>

# ✉️ ReVanced Cloudflare Email Worker

![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/ReVanced/revanced-cloudflare-email-worker/deploy.yml)
![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)

A Cloudflare Email Worker to reply to or filter mails

❓ About

With ReVanced Cloudflare Email Worker, spam can be mitigated by enforcing a policy for incoming emails.
Senders are asked to include a secret in the email, which can be found in the policy.

💪 Features

- 📧 **Auto-replies**: Automatically reply to incoming emails
- ➡️ **Email forwarding**: Forward emails to a specified address
- ⚙️ **Customizable**: Customize sender information and message content for replies

## 🚀 How to get started

To get started with ReVanced Cloudflare Email Worker, pnpm is recommended, but npm can also be used.
Follow the steps below to get started with ReVanced Cloudflare Email Worker:

1. Run `git clone git@github.com:ReVanced/revanced-cloudflare-email-worker.git && cd revanced-cloudflare-email-worker` to clone the repository
2. Run `pnpm install` to install dependencies
3. Set the environment variables and secrets from [.env.example](.env.example) via the Cloudflare Workers dashboard according to [this](https://developers.cloudflare.com/workers/configuration/environment-variables/)
4. Run `pnpm deploy` to deploy the project

## 📚 Everything else

### 📙 Contributing

Thank you for considering contributing to ReVanced Cloudflare Email Worker. You can find the contribution
guidelines [here](CONTRIBUTING.md).

### 🛠️ Building

To build ReVanced Cloudflare Email Worker, pnpm is recommended, but npm can also be used.
Follow the steps below to build ReVanced Cloudflare Email Worker:

1. Run `git clone git@github.com:ReVanced/revanced-cloudflare-email-worker.git && cd revanced-cloudflare-email-worker` to clone the repository
2. Run `pnpm install` to install dependencies
3. Copy [.env.example](.env.example) to `.env` and fill in the required values
4. Run `pnpm types` to generate types
5. Run
   - `pnpm build` to build the project
   - `pnpm dev` to start the worker

## 📜 License

ReVanced Cloudflare Email Worker is licensed under the AGPLv3 licence. Please see the [license file](LICENSE) for more information.
[tl;dr](https://www.tldrlegal.com/license/gnu-affero-general-public-license-v3-agpl-3-0) you may copy, distribute and
modify ReVanced Cloudflare Email Worker as long as you track changes/dates in source files.
Any modifications to ReVanced Cloudflare Email Worker must also be made available under the GPL along with build & install instructions.
