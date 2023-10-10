# Kontent.ai multi-web sample application template

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

## Demo

Ficto Healthtech

[![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=ficto-healthtech&style=for-the-badge&logo=false)](https://ficto-healthtech.vercel.app)

Ficto Imaging

[![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=ficto-imaging&style=for-the-badge&logo=false)](https://ficto-imaging.vercel.app)

Ficto Surgical

[![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=ficto-surgical&style=for-the-badge&logo=false)](https://ficto-surgical.vercel.app)

## Getting Started

To run the app yourself you will need a clone of the Kontent.ai project.
As it is currently in early access, please create an issue and mention your email connected to your Kontent.ai account and we will give you access.
Once we give you access, you will be able to create your copy of the source project right from the Kontent.ai UI (`app.kontent.ai/projects`).

### Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/kontent-ai/sample-app-next-js&project-name=kontent-sample-app&repository-name=kontent-sample-app-next-js&env=KONTENT_COLLECTION_CODENAME,NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID,KONTENT_PREVIEW_API_KEY,NEXT_PUBLIC_OTHER_COLLECTIONS_DOMAINS&envDescription=Required%20to%20connect%20the%20app%20with%20Kontent&envLink=[https://github.com/kontent-ai/sample-app-next-js#environment-variables](https://github.com/kontent-ai/sample-app-next-js#environment-variables))

[![Deploy on Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/kontent-ai/sample-app-next-js)

### Init project from command line

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/kontent-ai/sample-app-next-js sample-app-next-js
# or
yarn create next-app --example https://github.com/kontent-ai/sample-app-next-js sample-app-next-js
```

## Code development

### Environment variables

1. Set up environment variables
    * Copy the `.env.local.template` file in this directory to `.env.local` (which will be ignored by Git):

        ```sh
        cp .env.local.template .env.local
        ```
    * Fill in all the necessary variables in `.env.local` based on the comments.

1. Run the development server:

    ```bash
    npm run dev
    # or
    yarn dev
    ```

🎉 Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Running the app in web spotlight
If you want to use your app inside [web spotlight](https://kontent.ai/features/webspotlight/), you will need to run the app under the `https` scheme.

To run the app under the `https` scheme you can use one of the following methods:
* Run `npm run https:dev` to run the app in the development mode and a proxy server proxying `https://localhost:3001` to `http://localhost:3000`. 
  * The proxy will use a self-signed certificate which might not work in some browsers.
  * The proxy is run using the [`local-ssl-proxy`](https://www.npmjs.com/package/local-ssl-proxy) package.
  * The command requires the ports 3001 and 3000 to be free, otherwise it fails. If you want to use a different ports you will need to run the proxy (`npm run https:proxy`) and the app `npm run dev` yourself.
* Run `npm run https:proxy` to create a proxy as above without running the app (you are expected to run the app separately).
  * You can use this command with a custom trusted certificate like this `npm run https:proxy -- --key localhost-key.pem --cert localhost.pem`. See [the package documentation](https://github.com/cameronhunter/local-ssl-proxy#run-ssl-proxy-with-a-self-signed-trusted-certificate) for more details
  * You can also change the source and/or target port (e.g. `npm run https:proxy -- --source 3002 --target 4000`)
* [Write you own server](https://github.com/vercel/next.js/tree/canary/examples/custom-server).
* Use [Ngrok](https://ngrok.com/) or something similar.

You can start editing the page by modifying `pages/[envId]/index.tsx`. The page auto-updates as you edit the file.

To generate new models from Kontent.ai data, just run `npm run generateModels`. Make sure you have environment variables filled in properly.

### Use codebase as a starter

> ⚠ This project is not intended as a starter project. It is a sample of a presentation channel showcasing Kontent.ai capabilities. The following hints help you to use this code base as a base for presentation channel for your project as a boilerplate. By doing it, you are accepting the fact you are changing the purpose of this code.

The app contains code to dynamically handle different Kontent.ai projects (e.g. the environment route prefix). To adjust the code to be used to single project as a starter, you want to remove the logic that is used solely for showcasing the sample project during evaluation.

Some of the parts responsible for handle different Kontent.ai projects that needs adjustments in case of transforming it into single-project setup.

* `middleware.ts` - Getting the Kontent.ai environment ID and storing it in cookie. For single-project setup use only the environment variable with environment ID should be used.
* `pages/callback.tsx` & `pages/getPreviewApiKey.ts` & `lib/constants/auth.ts` - Responsible for exchanging preview API keys for specified environment. For single-project setup use only the environment variable with preview API key should be used.
* `pages/[envId]` - folder responsible for the [dynamic segment](https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes) passing the environment ID for pages. For single-project setup remove the folder and move its content one level up.

### Commands

https://github.com/kontent-ai/sample-app-next-js/blob/001994b44d2ef5cb499bce23756f0dd9c3086c2b/package.json#L4-L15

[contributors-shield]: https://img.shields.io/github/contributors/kontent-ai/sample-app-next-js.svg?style=for-the-badge
[contributors-url]: https://github.com/kontent-ai/sample-app-next-js/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/kontent-ai/sample-app-next-js.svg?style=for-the-badge
[forks-url]: https://github.com/kontent-ai/sample-app-next-js/network/members
[stars-shield]: https://img.shields.io/github/stars/kontent-ai/sample-app-next-js.svg?style=for-the-badge
[stars-url]: https://github.com/kontent-ai/sample-app-next-js/stargazers
[issues-shield]: https://img.shields.io/github/issues/kontent-ai/sample-app-next-js.svg?style=for-the-badge
[issues-url]:https://github.com/kontent-ai/sample-app-next-js/issues
[license-shield]: https://img.shields.io/github/license/kontent-ai/sample-app-next-js.svg?style=for-the-badge
[license-url]:https://github.com/kontent-ai/sample-app-next-js/blob/master/LICENSE.md
[discord-shield]: https://img.shields.io/discord/821885171984891914?color=%237289DA&label=Kontent.ai%20Discord&logo=discord&style=for-the-badge
[discord-url]: https://discord.com/invite/SKCxwPtevJ
