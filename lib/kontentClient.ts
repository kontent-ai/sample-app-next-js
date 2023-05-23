import { camelCasePropertyNameResolver, createDeliveryClient, DeliveryError, IContentItem } from '@kontent-ai/delivery-sdk';
import { PerCollectionCodenames } from './routing';
import { siteCodename } from './utils/env';
import { Article, contentTypes, Product, WebSpotlightRoot } from '../models'; 

const sourceTrackingHeaderName = 'X-KC-SOURCE';

const envId = process.env.NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID;
if (!envId) {
  throw new Error("Missing 'NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID' environment variable.");
}

const deliveryClient = createDeliveryClient({
  environmentId: envId,
  globalHeaders: (_queryConfig) => [
    {
      header: sourceTrackingHeaderName,
      value: `${process.env.APP_NAME || "n/a"};${process.env.APP_VERSION || "n/a"}`,
    }
  ],
  propertyNameResolver: camelCasePropertyNameResolver,
  proxy: {
    baseUrl: "http://deliver.devkontentmasters.com",
    basePreviewUrl: "http://preview-deliver.devkontentmasters.com",
  },
  previewApiKey: process.env.KONTENT_PREVIEW_API_KEY
});

export const getItemByCodename = <ItemType extends IContentItem>(codename: PerCollectionCodenames, usePreview: boolean): Promise<ItemType | null> => {
  const itemCodename = codename[siteCodename];

  if (itemCodename === null) {
    return Promise.resolve(null);
  }

  return deliveryClient
    .item(itemCodename)
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .depthParameter(10)
    .toPromise()
    .then(res => {
      if (res.response.status === 404) {
        return null;
      }
      return res.data.item as ItemType
    })
    .catch((error) => {
      debugger;
      if (error instanceof DeliveryError) {
        // delivery specific error (e.g. item with codename not found...)
        console.error(error.message, error.errorCode);
        return null;
      } else {
        // some other error
        console.error("HTTP request error", error);
        // throw error;
        return null;
      }
    });

}

const homepageTypeCodename = "web_spotlight_root" as const;

export const getHomepage = (usePreview: boolean) =>
  deliveryClient
    .items()
    .type(homepageTypeCodename)
    .collection(siteCodename)
    .queryConfig({
      usePreviewMode: usePreview,
      waitForLoadingNewContent: usePreview
    })
    .depthParameter(10)
    .toPromise()
    .then(res => res.data.items[0] as WebSpotlightRoot | undefined)

export const getProductsForListing = (usePreview: boolean) =>
  deliveryClient
    .items<Product>()
    .type(contentTypes.product.codename)
    .collection(siteCodename)
    .elementsParameter([
      contentTypes.product.elements.title.codename,
      contentTypes.product.elements.product_image.codename,
      contentTypes.product.elements.slug.codename,
    ])
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .toAllPromise()
    .then(res => res.data.items)


export const getProductSlugs = () =>
  deliveryClient
    .items<Product>()
    .type(contentTypes.product.codename)
    .collection(siteCodename)
    .elementsParameter([contentTypes.product.elements.slug.codename])
    .toAllPromise()
    .then(res => res.data.items);


export const getProductDetail = (slug: string, usePreview: boolean) =>
  deliveryClient
    .items<Product>()
    .equalsFilter(`elements.${contentTypes.product.elements.slug.codename}`, slug)
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .toAllPromise()
    .then(res => res.data.items[0]);

export const getArticlesForListing = (usePreview: boolean) =>
  deliveryClient
    .items<Article>()
    .type(contentTypes.article.codename)
    .collection(siteCodename)
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .toAllPromise()
    .then(res => res.data.items);

export const getArticleBySlug = (slug: string, usePreview: boolean) =>
  deliveryClient
    .items<Article>()
    .equalsFilter(`elements.${contentTypes.article.elements.slug.codename}`, slug)
    .depthParameter(10)
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .toAllPromise()
    .then(res => res.data.items[0]);
