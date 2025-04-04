# Kontent.ai multi-web sample application template

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

The sample app displays data from the Sample Project that demonstrates Kontent.ai best practices for multi-brand companies.
The content of the Sample Project is based on a fictional health technology company called FictoHealthtech. The company consists of 3 brands, each with its own website.
- **Ficto Healthtech** is the base page with the fundamental information about the company. It also points to the remaining two sites.
- **Ficto Surgical** is the site with the catalog of the products the company offers. It also shows articles from the Ficto Healthtech world.
- **Ficto Imaging** is the last of the sites. It describes the company's research and unique solutions.

| Ficto Healthtech | Ficto Imaging | Ficto Surgical |
|------------------|--------------|---------------|
| [![Ficto Healthtech](https://therealsujitk-vercel-badge.vercel.app/?app=ficto-healthtech&style=for-the-badge&logo=false)](https://ficto-healthtech.vercel.app) | [![Ficto Imaging](https://therealsujitk-vercel-badge.vercel.app/?app=ficto-imaging&style=for-the-badge&logo=false)](https://ficto-imaging.vercel.app) | [![Ficto Surgical](https://therealsujitk-vercel-badge.vercel.app/?app=ficto-surgical&style=for-the-badge&logo=false)](https://ficto-surgical.vercel.app) |

## Table of Contents

- [Getting Started](#getting-started)
  - [Clone the Next.js project using command line](#clone-the-nextjs-project-using-command-line)
  - [Deploy the application](#deploy-the-application)
- [Showcased Features](#showcased-features)
  - [Kontent.ai integration with Next.js](#kontentai-integration-with-nextjs)
  - [Multisite Project](#multisite-project)
  - [Type-Safety with Model Generator](#type-safety-with-model-generator)
  - [Preview content using Draft mode](#preview-content-using-draft-mode)
  - [Smartlink with Live Reload](#smartlink-with-live-reload)
  - [API Routes to Keep API Keys Secure from the Client](#api-routes-to-keep-api-keys-secure-from-the-client)
- [Contributing](#contributing)
  - [How to Contribute](#how-to-contribute)
  - [Code of Conduct](#code-of-conduct)
  - [Getting started with development](#getting-started-with-development)
    - [Environment variables](#environment-variables)
    - [Running the app in web spotlight](#running-the-app-in-web-spotlight)
    - [Circular reference handling](#circular-reference-handling)
- [Use Codebase as a Starter](#use-codebase-as-a-starter)
- [License](#license)
- [Support](#support)
- [Additional Resources](#additional-resources)

## Getting Started
To run the and explore the application on your own, you will need a clone of the Kontent.ai Multi-site sample project. You can create it right from the [Kontent.ai UI as a multi-brand sample project](https://kontent.ai/learn/docs/projects#a-create-a-sample-project).
You can learn more about the sample project in [our documentation](https://kontent.ai/learn/develop/try-sample-apps/adjust-sample-project/javascript).

### Clone the Next.js project using command line
Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/kontent-ai/sample-app-next-js sample-app-next-js
# or
yarn create next-app --example https://github.com/kontent-ai/sample-app-next-js sample-app-next-js
```

### Deploy the application

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/kontent-ai/sample-app-next-js&project-name=kontent-sample-app&repository-name=kontent-sample-app-next-js&env=KONTENT_COLLECTION_CODENAME,NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID,KONTENT_PREVIEW_API_KEY,NEXT_PUBLIC_OTHER_COLLECTIONS_DOMAINS&envDescription=Required%20to%20connect%20the%20app%20with%20Kontent&envLink=[https://github.com/kontent-ai/sample-app-next-js#environment-variables](https://github.com/kontent-ai/sample-app-next-js#environment-variables))
[![Deploy on Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/kontent-ai/sample-app-next-js)

## Showcased features

### Kontent.ai integration with Next.js
This application demonstrates how to retrieve content from Kontent.ai using [Delivery SDK](https://github.com/kontent-ai/delivery-sdk-js) and seamlessly integrate it with Next.js. It follows the Next.js App Router approach, leveraging key features such as Server-Side Rendering (SSR), Incremental Static Regeneration (ISR), and Image Optimization.

### Multisite Project  
This application demonstrates how to use [Collections](https://kontent.ai/learn/docs/collections) and [Spaces](https://kontent.ai/learn/docs/spaces) to manage and display content for multiple sites from a single codebase.

### Type-Safety with Model Generator  
This application is built with TypeScript to improve type safety using the [Kontent.ai Model Generator](https://github.com/kontent-ai/model-generator-js). The generated models are located in the `./models` folder. To regenerate a model based on your project’s content model, run the following script:  

```bash
npm run generateModels
```

### Preview content using Draft mode
This application uses the [Next's Draft mode](https://nextjs.org/docs/app/building-your-application/configuring/draft-mode) to display [Kontent.ai preview data](https://kontent.ai/learn/create/content-creation-first-steps/preview-your-content) on the site.

All preview-related features, including [Preview URLs](https://kontent.ai/learn/docs/preview/preview-configuration/javascript#a-define-preview-urls-for-content-types), [Web Spotlight](https://kontent.ai/learn/docs/preview/preview-configuration/javascript#a-set-up-a-preview-for-web-spotlight), and [Multiple Previews](https://kontent.ai/learn/docs/preview/preview-configuration/javascript#a-set-up-multiple-previews-with-spaces), are automatically configured when the project is generated. Next.js Draft Mode is also toggled when accessing content via Web Spotlight or the Preview button.  

By default, when the app is opened outside of Kontent.ai, it displays the published content.
To enable preview mode manually, visit the `/api/preview` route with the following query parameters:  

- **`secret`** – Prevents unauthorized access to preview data. The default value is `mySuperSecret`.  
- **`slug`** – Defines where the app should redirect after enabling draft mode (e.g., `/`).  
- **`type`** – The codename of the content type that the `slug` represents. It can be either `page` or `web_spotlight_root`.  

An example might look something like this: `/api/preview?secret=mySuperSecret&slug=about-us&type=page`.
To exit the draft mode, visit the route `/api/exit-preview`. 
No query parameter is necessary, but you can provide `callback` with a path to redirect to once the preview mode is disabled.

> [!NOTE]
> The draft mode leverages cookies, so when you open the app in preview (e.g. from Kontent.ai) and then open it again (e.g. in a different tab),
> the second instance will remain in preview, as long as the cookies are present. You can clear cookies manually or visit `/api/exit-preview` which removes them as well.

### Smartlink with Live Reload
Update your content directly in Web Spotlight by linking it to your Kontent.ai entities using the [Kontent.ai Smart-Link SDK](https://github.com/kontent-ai/smart-link). To see your changes instantly, this app demonstrates how to utilize [Live Reload](https://github.com/kontent-ai/smart-link?tab=readme-ov-file#live-preview-in-your-application).

### API Routes to Keep API Keys Secure from the Client  
This application demonstrates how to call the Delivery Client from API routes, ensuring that your API key is securely stored in the backend and never exposed to the client.


## Contributing
We welcome contributions to the Kontent.ai Next.js sample applcation!

### How to Contribute
- **Report Issues**: Use the [GitHub Issues](https://github.com/kontent-ai/data-ops/issues) to report bugs or request features.
- **Fork the Repository**: Create a personal fork of the repository on GitHub.
- **Create a Feature Branch**: Use a descriptive name for your branch.
- **Submit a Pull Request**: Submit your changes for review.

Please read our [Contributing Guidelines](CONTRIBUTING.md) for more details.

### Code of Conduct

This project adheres to a [Code of Conduct](https://github.com/kontent-ai/.github/blob/main/CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

### Getting started with development

#### Environment variables
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

#### Running the app in web spotlight
If you want to use your app inside [web spotlight](https://kontent.ai/features/webspotlight/), you will need to run the app under the `https` scheme.

To run the app under the `https` scheme you can use one of the following methods:
* Run `npm run dev:https` to run the app in the development mode with https. 
* [Write your own server](https://github.com/vercel/next.js/tree/canary/examples/custom-server).
* Use [Ngrok](https://ngrok.com/) or a similar tool.

You can adjust the homepage by editing `pages/[envId]/index.tsx`. The page auto-updates as you edit the file.

#### Circular reference handling

Next.js data fetching functions convert objects to JSON format. Since JSON doesn't support circular data, this can potentially cause crashes in situations where objects reference each other, such as with linked items or rich text elements. To avoid this, the application uses the [`flatted`](https://www.npmjs.com/package/flatted) package to implement two helper functions: `stringifyAsType` and `parseFlatted`.

## Use codebase as a starter

> ⚠ This project is not intended as a starter project. It is a sample of a presentation channel showcasing Kontent.ai capabilities. The following hints help you use this code as a base for presentation channel for your project like a boilerplate. By doing it, you are accepting the fact you are changing the purpose of this code.

The app contains code to dynamically handle different Kontent.ai projects (e.g. the environment route prefix). To adjust the code to be used for a single project as a starter, you should remove the logic that is used solely for showcasing the sample project during evaluation.

Below are some of the parts responsible for handling different Kontent.ai projects that need adjustment in case of transforming the code into a single-project setup:

* `middleware.ts` - Gets the Kontent.ai environment ID and stores it in a cookie. For single-project setup, a single environment variable should be used to store the environment ID.
* `app/callback/page.tsx` & `app/getPreviewApiKey/page.ts` & `lib/constants/auth.ts` - Responsible for exchanging preview API keys for specified environment. For single-project setup, a single environment variable should be used to store the preview API key.
* `app/[envId]` - Folder representing the [dynamic segment](https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes), passing the environment ID for pages. For single-project setup, remove the folder and move its content one level up.

---

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details.

---

## Support

If you have any questions or need assistance, please reach out:

- **Kontent.ai Support**: [Contact Support](https://kontent.ai/contact/)

---

## Additional Resources

- **Kontent.ai Official Documentation**: [Learn more about Kontent.ai](https://kontent.ai/learn/)


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
