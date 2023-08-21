import { camelCasePropertyNameResolver, createDeliveryClient, DeliveryError, IContentItem } from '@kontent-ai/delivery-sdk';

import { Article, contentTypes, Product, SEOMetadata, WSL_Page, WSL_WebSpotlightRoot } from '../models';
import { ArticlePageSize, ProductsPageSize } from './constants/paging';
import { ArticleTypeWithAll } from './utils/articlesListing';
import { siteCodename } from './utils/env';

const sourceTrackingHeaderName = 'X-KC-SOURCE';
const defaultDepth = 10;

const envId = process.env.NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID;
if (!envId) {
  throw new Error("Missing 'NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID' environment variable.");
}

const deliveryClient = createDeliveryClient({
  environmentId: envId,
  globalHeaders: () => [
    {
      header: sourceTrackingHeaderName,
      value: `${process.env.APP_NAME || "n/a"};${process.env.APP_VERSION || "n/a"}`,
    }
  ],
  propertyNameResolver: camelCasePropertyNameResolver,
  proxy: {
    baseUrl: "https://deliver.devkontentmasters.com",
    basePreviewUrl: "https://preview-deliver.devkontentmasters.com",
  },
  previewApiKey: process.env.KONTENT_PREVIEW_API_KEY
});

export const getItemByCodename = <ItemType extends IContentItem>(codename: string, usePreview: boolean): Promise<ItemType | null> => {
  return deliveryClient
    .item<ItemType>(codename)
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .depthParameter(defaultDepth)
    .toPromise()
    .then(res => {
      if (res.response.status === 404) {
        return null;
      }
      return res.data.item
    })
    .catch((error) => {
      if (error instanceof DeliveryError) {
        // delivery specific error (e.g. item with codename not found...)
        console.error(error.message, error.errorCode);
        return null;
      } else {
        // some other error
        console.error("HTTP request error", error);
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
    .depthParameter(defaultDepth)
    .toPromise()
    .then(res => res.data.items[0] as WSL_WebSpotlightRoot | undefined)

export const getProductsForListing = async (usePreview: boolean, page?: number, categories?: string[], pageSize: number = ProductsPageSize) => {
  const query = deliveryClient
    .items<Product>()
    .type(contentTypes.product.codename)
    .collections([siteCodename, "default"])
    .elementsParameter([
      contentTypes.product.elements.product_base__name.codename,
      contentTypes.product.elements.product_base__main_image.codename,
      contentTypes.product.elements.category.codename,
      contentTypes.product.elements.slug.codename,
      contentTypes.product.elements.price.codename,
    ])
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .includeTotalCountParameter()
    .limitParameter(pageSize)

  if (page) {
    query.skipParameter((page - 1) * pageSize)
  }

  if (categories) {
    query.anyFilter(`elements.${contentTypes.product.elements.category.codename}`, categories);
  }

  return query
    .toPromise()
    .then(res => res.data);
}

export const getProductItemsWithSlugs = () =>
  deliveryClient
    .items<Product>()
    .type(contentTypes.product.codename)
    .collections([siteCodename, "default"])
    .elementsParameter([contentTypes.product.elements.slug.codename])
    .toAllPromise()
    .then(res => res.data.items)

export const getProductDetail = (slug: string, usePreview: boolean) =>
  deliveryClient
    .items<Product>()
    .equalsFilter(`elements.${contentTypes.product.elements.slug.codename}`, slug)
    .queryConfig({
      usePreviewMode: usePreview,
      waitForLoadingNewContent: usePreview

    })
    .toAllPromise()
    .then(res => res.data.items[0]);

export const getSiteMenu = async (usePreview: boolean) => {
  return deliveryClient.items<WSL_WebSpotlightRoot>()
    .type(contentTypes.web_spotlight_root.codename)
    .collection(siteCodename)
    .queryConfig({
      usePreviewMode: usePreview,
      waitForLoadingNewContent: usePreview
    })
    .depthParameter(defaultDepth)
    .toAllPromise()
    .then(res => res.data.items[0] || null)
    .then(item => item?.elements.navigation.linkedItems[0] || null)
}

export const getArticlesForListing = (usePreview: boolean, page?: number, articleType?: string, pageSize: number = ArticlePageSize) => {
  const query = deliveryClient
    .items<Article>()
    .type(contentTypes.article.codename)
    .collections([siteCodename, "default"])
    .orderByDescending(`elements.${contentTypes.article.elements.publishing_date.codename}`)
    .queryConfig({
      usePreviewMode: usePreview,
      waitForLoadingNewContent: usePreview
    })
    .limitParameter(pageSize)

  if (page) {
    query.skipParameter((page - 1) * pageSize)
  }

  if (articleType && articleType !== 'all') {
    query.containsFilter(`elements.${contentTypes.article.elements.type.codename}`, [articleType])
  }

  query.includeTotalCountParameter();
  return query
    .toPromise()
    .then(res => res.data);
}

export const getAllArticles = (usePreview: boolean) =>
  deliveryClient
    .items<Article>()
    .type(contentTypes.article.codename)
    .collections([siteCodename, "default"])
    .queryConfig({
      usePreviewMode: usePreview
    })
    .toPromise()
    .then(res => res.data);

export const getArticleBySlug = (slug: string, usePreview: boolean) =>
  deliveryClient
    .items<Article>()
    .equalsFilter(`elements.${contentTypes.article.elements.slug.codename}`, slug)
    .depthParameter(defaultDepth)
    .queryConfig({
      usePreviewMode: usePreview,
      waitForLoadingNewContent: usePreview
    })
    .toAllPromise()
    .then(res => res.data.items[0]);

const getCurrentCollectionTotalCountQuery = () => (
  deliveryClient
    .items()
    .collection(siteCodename)
    .elementsParameter([])
    .limitParameter(1)
    .includeTotalCountParameter()
);

const getItemsCountByTypeQuery = (usePreview: boolean, contentTypeCodename?: string) => {
  const query = getCurrentCollectionTotalCountQuery()
    .collection(siteCodename)
    .queryConfig({
      usePreviewMode: usePreview,
      waitForLoadingNewContent: usePreview
    })

  if (contentTypeCodename) {
    query.type(contentTypeCodename);
  }
  return query;
}


export const getItemsTotalCount = (usePreview: boolean, contentTypeCodename?: string) => {
  const query = getItemsCountByTypeQuery(usePreview, contentTypeCodename);

  return query
    .toPromise()
    .then(res => res.data.pagination.totalCount)
}

export const getArticlesCountByCategory = (usePreview: boolean, articleType: ArticleTypeWithAll) => {
  const query = getItemsCountByTypeQuery(usePreview, contentTypes.article.codename);

  if (articleType !== 'all') {
    query.containsFilter(`elements.${contentTypes.article.elements.type.codename}`, [articleType])
  }

  return query
    .toPromise()
    .then(res => res.data.pagination.totalCount || 0)
}

export const getProductTaxonomy = async (usePreview: boolean) =>
  deliveryClient
    .taxonomy("product_category")
    .queryConfig({
      usePreviewMode: usePreview,
      waitForLoadingNewContent: usePreview
    })
    .toPromise()
    .then(res => res.data.taxonomy.terms);

export const getDefaultMetadata = async (usePreview: boolean) =>
  deliveryClient
    .items()
    .type(homepageTypeCodename)
    .collection(siteCodename)
    .queryConfig({
      usePreviewMode: usePreview,
      waitForLoadingNewContent: usePreview
    })
    .elementsParameter(["seo_metadata__title", "seo_metadata__description", "seo_metadata__keywords"])
    .depthParameter(defaultDepth)
    .toPromise()
    .then(res => res.data.items[0] as SEOMetadata)

export const getItemBySlug = async <T extends IContentItem>(slug: string, type: string, usePreview: boolean = false): Promise<T | null> => {
  const items = await deliveryClient.items<T>()
    .equalsFilter("elements.slug", slug)
    .type(type)
    .collections([siteCodename, "default"])
    .queryConfig({
      usePreviewMode: usePreview,
      waitForLoadingNewContent: usePreview
    })
    .depthParameter(defaultDepth)
    .toAllPromise()
    .then(response => response.data.items);

  if (items.length === 0) {
    console.warn(`Could not find item with URL slug "${slug}" of type "${type}"`);
    return null;
  }

  if (items.length > 1) {
    console.warn(`Found more then one items with URL slug "${slug}" of type "${type} - found ${items.length} items. Using the first one.`)
  }

  const item = items[0];
  if (!item) {
    throw Error(`Item by URL slug "${slug}" of type "${type} nof found`);
  }
  return item;
}

export const getPagesSlugs = () =>
  deliveryClient
    .items<WSL_Page>()
    .type(contentTypes.page.codename)
    .collections([siteCodename, "default"])
    .elementsParameter([contentTypes.page.elements.slug.codename])
    .toAllPromise()
    .then(res => res.data.items.map(item => item.elements.slug.value));