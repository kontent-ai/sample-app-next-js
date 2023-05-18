import { camelCasePropertyNameResolver, createDeliveryClient } from "@kontent-ai/delivery-sdk";

const sourceTrackingHeaderName = 'X-KC-SOURCE'

export type ClientConfig = {
    environmentId: string,
    previewApiKey: string | undefined,
    appName: string | undefined,
    appVersion: string | undefined
  }

export const createClient = (config: ClientConfig) => createDeliveryClient({
    environmentId: config.environmentId,
    globalHeaders: (_queryConfig) => [
      {
        header: sourceTrackingHeaderName,
        value: `${config.appName || "n/a"};${config.appVersion || "n/a"}`,
      },
    ],
    propertyNameResolver: camelCasePropertyNameResolver,
    proxy: {
      baseUrl: "https://deliver.devkontentmasters.com",
      basePreviewUrl: "https://preview-deliver.devkontentmasters.com",
    },
    previewApiKey: config.previewApiKey
  });