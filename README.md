# Kontent.ai multi-web sample application template

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

## Demo

Ficto Healthtech

[![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=health-tech&style=for-the-badge&logo=false)](https://ficto-healthtech.vercel.app)

[![Netlify Status](https://api.netlify.com/api/v1/badges/aa724fef-9fda-4a85-8f6b-4a58f6f3763e/deploy-status)](https://app.netlify.com/sites/new-sample-app/deploys)

Ficto Healthtech Imaging

[![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=health-tech-imaging&style=for-the-badge&logo=false)](https://ficto-healthtech-imaging.vercel.app)

Ficto Healthtech Surgical

[![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=health-tech-surgical&style=for-the-badge&logo=false)](https://ficto-healthtech-surgical.vercel.app)

## Getting Started

You can spin out your clone of this template.

### Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/kontent-ai/boilerplate-next-js&project-name=kontent-boilerplate-next-js&repository-name=kontent-boilerplate-next-js&env=KONTENT_PROJECT_ID&envDescription=Required%20to%20connect%20the%20app%20with%20Kontent&envLink=https://github.com/kontent-ai/boilerplate-next-js%23Environment-variables)

[![Deploy on Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/kontent-ai/boilerplate-next-js)

### Init project by command line

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/kontent-ai-bot/kontent-ai-new-sample-app kontent-ai-new-sample-app
# or
yarn create next-app --example https://github.com/kontent-ai-bot/kontent-ai-new-sample-app kontent-ai-new-sample-app
```

## Code development

### Environment variables

1. Set up environment variables
    * Copy the `.env.local.template` file in this directory to `.env.local` (which will be ignored by Git):

        ```sh
        cp .env.local.template .env.local
        ```

1. Run the development server:

    ```bash
    npm run dev
    # or
    yarn dev
    ```

🎉 Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

> By default, the content is loaded from a shared Kontent.ai project. If you want to use your own clone of the project so that you can customize it and experiment with Kontent, continue to the next section.

To generate new models from Kontent.ai data, just run `npm run generateModels`. Make sure you have environment variables filled in properly.

## Create your own data source project in Kontent.ai

TBD - raise the issue, if you want the project backup

### Commands

https://github.com/kontent-ai-bot/kontent-ai-new-sample-app/blob/52b3e36114ca719b7ef977ae2d68902777ab5e8f/package.json#L4-L11

[contributors-shield]: https://img.shields.io/github/contributors/kontent-ai-bot/kontent-ai-new-sample-app.svg?style=for-the-badge
[contributors-url]: https://github.com/kontent-ai-bot/kontent-ai-new-sample-app/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/kontent-ai-bot/kontent-ai-new-sample-app.svg?style=for-the-badge
[forks-url]: https://github.com/kontent-ai-bot/kontent-ai-new-sample-app/network/members
[stars-shield]: https://img.shields.io/github/stars/kontent-ai-bot/kontent-ai-new-sample-app.svg?style=for-the-badge
[stars-url]: https://github.com/kontent-ai-bot/kontent-ai-new-sample-app/stargazers
[issues-shield]: https://img.shields.io/github/issues/kontent-ai-bot/kontent-ai-new-sample-app.svg?style=for-the-badge
[issues-url]:https://github.com/kontent-ai-bot/kontent-ai-new-sample-app/issues
[license-shield]: https://img.shields.io/github/license/kontent-ai-bot/kontent-ai-new-sample-app.svg?style=for-the-badge
[license-url]:https://github.com/kontent-ai-bot/kontent-ai-new-sample-app/blob/master/LICENSE.md
[discord-shield]: https://img.shields.io/discord/821885171984891914?color=%237289DA&label=Kontent.ai%20Discord&logo=discord&style=for-the-badge
[discord-url]: https://discord.com/invite/SKCxwPtevJ
