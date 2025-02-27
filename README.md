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

To run the app yourself you will need a clone of the Kontent.ai project. You can create it right from the [Kontent.ai UI as a multi-brand sample project](https://kontent.ai/learn/docs/projects#a-create-a-sample-project).
You can learn more about the sample project in [our documentation](https://kontent.ai/learn/develop/try-sample-apps/adjust-sample-project/typescript).

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

### Draft mode

The app uses the [Next's draft mode](https://nextjs.org/docs/app/building-your-application/configuring/draft-mode) to display [Kontent.ai preview data](https://kontent.ai/learn/create/content-creation-first-steps/preview-your-content) on the site.

All the features, including [preview urls](https://kontent.ai/learn/docs/preview/preview-configuration/javascript#a-define-preview-urls-for-content-types), [Web Spotlight](https://kontent.ai/learn/docs/preview/preview-configuration/javascript#a-set-up-a-preview-for-web-spotlight) and [multiple previews](https://kontent.ai/learn/docs/preview/preview-configuration/javascript#a-set-up-multiple-previews-with-spaces) are configured automatically when the project is generated. Next.js draft mode is also toggled whenever you view content via Web Spotlight or Preview button.

If you open the app outside of Kontent.ai, it will by default show the published content.
To enable the preview mode, visit the `/api/preview` route and provide the following query parameters:
* `secret` - This prevents unauthorised access to the preview data. Default value is `mySuperSecret`.
* `slug` - This defines where should the app redirect you once the draft mode is enabled (e.g. `/`).
* `type` - This must be the codename of the content type that the item represented by `slug` is based on. It can be either `page` or `web_spotlight_root`.

An example might look something like this: `/api/preview?secret=mySuperSecret&slug=about-us&type=page`.
To exit the draft mode, visit the route `/api/exit-preview`. 
No query parameter is necessary, but you can provide `callback` with a path to redirect to once the preview mode is disabled.

> The draft mode leverages cookies, so when you open the app in preview (e.g. from Kontent.ai) and then open it again (e.g. in a different tab),
> the second instance will remain in preview, as long as the cookies are present. You can clear cookies manually or visit `/api/exit-preview` which removes them as well.


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
* Run `npm run dev:https` to run the app in the development mode with https. 
* [Write your own server](https://github.com/vercel/next.js/tree/canary/examples/custom-server).
* Use [Ngrok](https://ngrok.com/) or a similar tool.

You can adjust the homepage by editing `pages/[envId]/index.tsx`. The page auto-updates as you edit the file.

To generate new models from Kontent.ai data, just run `npm run generateModels`. Make sure you have environment variables filled in properly.

### Circular reference handling

Next.js data fetching functions convert objects to JSON format. Since JSON doesn't support circular data, this can potentially cause crashes in situations where objects reference each other, such as with linked items or rich text elements. To avoid this, the application uses the [`flatted`](https://www.npmjs.com/package/flatted) package to implement two helper functions: `stringifyAsType` and `parseFlatted`.

### Use codebase as a starter

> ⚠ This project is not intended as a starter project. It is a sample of a presentation channel showcasing Kontent.ai capabilities. The following hints help you use this code as a base for presentation channel for your project like a boilerplate. By doing it, you are accepting the fact you are changing the purpose of this code.

The app contains code to dynamically handle different Kontent.ai projects (e.g. the environment route prefix). To adjust the code to be used for a single project as a starter, you should remove the logic that is used solely for showcasing the sample project during evaluation.

Below are some of the parts responsible for handling different Kontent.ai projects that need adjustment in case of transforming the code into a single-project setup:

* `middleware.ts` - Gets the Kontent.ai environment ID and stores it in a cookie. For single-project setup, a single environment variable should be used to store the environment ID.
* `app/callback/page.tsx` & `app/getPreviewApiKey/page.ts` & `lib/constants/auth.ts` - Responsible for exchanging preview API keys for specified environment. For single-project setup, a single environment variable should be used to store the preview API key.
* `app/[envId]` - Folder representing the [dynamic segment](https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes), passing the environment ID for pages. For single-project setup, remove the folder and move its content one level up.

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
