# Kontent.ai multi-web sample application template

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

## Demo

Ficto Healthtech

[![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=ficto-healthtech&style=for-the-badge&logo=false)](https://ficto-healthtech.vercel.app)

[![Netlify Status](https://api.netlify.com/api/v1/badges/aa724fef-9fda-4a85-8f6b-4a58f6f3763e/deploy-status)](https://app.netlify.com/sites/new-sample-app/deploys)

Ficto Healthtech Imaging

[![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=ficto-healthtech-imaging&style=for-the-badge&logo=false)](https://ficto-healthtech-imaging.vercel.app)

Ficto Surgical

[![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=ficto-healthtech-surgical&style=for-the-badge&logo=false)](https://ficto-healthtech-surgical.vercel.app)

## Getting Started

You can spin out your clone of this template.

### Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/kontent-ai-bot/kontent-ai-new-sample-app&project-name=kontent-sample-app&repository-name=kontent-sample-app-next-js&env=KONTENT_COLLECTION_CODENAME,NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID,KONTENT_PREVIEW_API_KEY,NEXT_PUBLIC_OTHER_COLLECTIONS_DOMAINS&envDescription=Required%20to%20connect%20the%20app%20with%20Kontent&envLink=[https://github.com/kontent-ai/boilerplate-next-js%23Environment-variables](https://github.com/kontent-ai-bot/kontent-ai-new-sample-app#environment-variables))

[![Deploy on Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/kontent-ai-bot/kontent-ai-new-sample-app)

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
> If you want to use your app inside [web spotlight](https://kontent.ai/features/webspotlight/), you will need to run the project under the `https` scheme.
> To do that you can use a proxy like [Ngrok](https://ngrok.com/) or [write you own server](https://github.com/vercel/next.js/tree/canary/examples/custom-server).

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

> By default, the content is loaded from a shared Kontent.ai project.
> If you want to use your own clone of the project so that you can customize it and experiment with Kontent, change the relevant settings in your `.env.local` file.

To generate new models from Kontent.ai data, just run `npm run generateModels`. Make sure you have environment variables filled in properly.

### Use codebase as a starter

> ⚠ This project is not intended as a starter project. It is as a sample of the presentation channel showcasing Kontent.ai capabilities. The following hints help you to use this code base as a base for presentation channel for your project as a boilerplate. By doing it, you are accepting the fact you are changing the purpose of this code.

The app contains code to dynamically handle different Kontent.ai projects (e.g. the environment route prefix). To adjust the code to be used to single project as a starter, you want to remove the logic that is used solely for showcasing the sample project during evaluation.

Some of the parts responsible for handle different Kontent.ai projects that needs adjustments in case of transforming it into single-project setup.

* `middleware.ts` - Getting the Kontent.ai environment ID and storing it in cookie. For single-project setup use only the environment variable with environment ID should be used.
* `pages/callback.ts` & `pages/getPreviewApiKey.ts` & `constants/auth.ts` - Responsible for exchanging preview API keys for specified environment. For single-project setup use only the environment variable with preview API key should be used.
* `pages/[envid]` - folder responsible for the [dynamic segment](https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes) passing the environment ID for pages. For single-project setup remove the folder and move its content one level up.

## Create your own data source project in Kontent.ai

TBD - raise the issue, if you want the project backup

### Commands

https://github.com/kontent-ai/sample-app-next-js/blob/001994b44d2ef5cb499bce23756f0dd9c3086c2b/package.json#L4-L13

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
