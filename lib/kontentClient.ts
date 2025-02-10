import { createDeliveryClient, DeliveryError, IContentItem } from '@kontent-ai/delivery-sdk';

import { Article, Product, Solution, WSL_Page, WSL_WebSpotlightRoot } from '../models/content-types';
import { ArticlePageSize, ProductsPageSize } from './constants/paging';
import { ArticleTypeWithAll } from './utils/articlesListing';
import { defaultEnvId, deliveryApiDomain, deliveryPreviewApiDomain, siteCodename } from './utils/env';
import { contentTypes, contentTypeSnippets } from '../models/environment';

const sourceTrackingHeaderName = 'X-KC-SOURCE';
const defaultDepth = 10;

const getDeliveryClient = ({ envId, previewApiKey }: ClientConfig) => createDeliveryClient({
  environmentId: envId,
  globalHeaders: () => [
    {
      header: sourceTrackingHeaderName,
      value: `${process.env.APP_NAME || "n/a"};${process.env.APP_VERSION || "n/a"}`,
    }
  ],
  proxy: {
    baseUrl: deliveryApiDomain,
    basePreviewUrl: deliveryPreviewApiDomain,
  },
  previewApiKey: defaultEnvId === envId ? process.env.KONTENT_PREVIEW_API_KEY : previewApiKey
});

type ClientConfig = {
  envId: string,
  previewApiKey?: string
}

export const getItemByCodename = <ItemType extends IContentItem>(config: ClientConfig, codename: string, usePreview: boolean): Promise<ItemType | null> => {
  return getDeliveryClient(config)
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

export const getHomepage = (config: ClientConfig, usePreview: boolean) =>
  getDeliveryClient(config)
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

export const getProductsForListing = async (config: ClientConfig, usePreview: boolean, page?: number, categories?: string[], pageSize: number = ProductsPageSize) => {
  const query = getDeliveryClient(config)
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

export const getProductItemsWithSlugs = (config: ClientConfig) =>
  getDeliveryClient(config)
    .items<Product>()
    .type(contentTypes.product.codename)
    .collections([siteCodename, "default"])
    .elementsParameter([contentTypes.product.elements.slug.codename])
    .toAllPromise()
    .then(res => res.data.items)

export const getProductDetail = (config: ClientConfig, slug: string, usePreview: boolean) =>
  getDeliveryClient(config)
    .items<Product>()
    .equalsFilter(`elements.${contentTypes.product.elements.slug.codename}`, slug)
    .queryConfig({
      usePreviewMode: usePreview,
      waitForLoadingNewContent: usePreview

    })
    .toAllPromise()
    .then(res => res.data.items[0]);

export const getSolutionsWithSlugs = (config: ClientConfig) =>
  getDeliveryClient(config)
    .items<Solution>()
    .type(contentTypes.solution.codename)
    .collections([siteCodename, "default"])
    .elementsParameter([contentTypes.solution.elements.slug.codename])
    .toAllPromise()
    .then(res => res.data.items)

export const getSolutionDetail = (config: ClientConfig, slug: string, usePreview: boolean) =>
  getDeliveryClient(config)
    .items<Solution>()
    .equalsFilter(`elements.${contentTypes.solution.elements.slug.codename}`, slug)
    .queryConfig({
      usePreviewMode: usePreview,
      waitForLoadingNewContent: usePreview
    })
    .toAllPromise()
    .then(res => res.data.items[0]);

export const getSiteMenu = async (config: ClientConfig, usePreview: boolean) => {
  return getDeliveryClient(config)
    .items<WSL_WebSpotlightRoot>()
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

export const getArticlesForListing = (config: ClientConfig, usePreview: boolean, page?: number, articleType?: string, pageSize: number = ArticlePageSize) => {
  const query = getDeliveryClient(config)
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

export const getAllArticles = (config: ClientConfig, usePreview: boolean) =>
  getDeliveryClient(config)
    .items<Article>()
    .type(contentTypes.article.codename)
    .collections([siteCodename, "default"])
    .queryConfig({
      usePreviewMode: usePreview
    })
    .toPromise()
    .then(res => res.data);

export const getArticleBySlug = (config: ClientConfig, slug: string, usePreview: boolean) =>
  getDeliveryClient(config)
    .items<Article>()
    .equalsFilter(`elements.${contentTypes.article.elements.slug.codename}`, slug)
    .depthParameter(defaultDepth)
    .queryConfig({
      usePreviewMode: usePreview,
      waitForLoadingNewContent: usePreview
    })
    .toAllPromise()
    .then(res => res.data.items[0]);

const getCurrentCollectionTotalCountQuery = (config: ClientConfig) => (
  getDeliveryClient(config)
    .items()
    .collection(siteCodename)
    .elementsParameter([])
    .limitParameter(1)
    .includeTotalCountParameter()
);

const getItemsCountByTypeQuery = (config: ClientConfig, usePreview: boolean, contentTypeCodename?: string) => {
  const query = getCurrentCollectionTotalCountQuery(config)
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


export const getItemsTotalCount = (config: ClientConfig, usePreview: boolean, contentTypeCodename?: string) => {
  const query = getItemsCountByTypeQuery(config, usePreview, contentTypeCodename);

  return query
    .toPromise()
    .then(res => res.data.pagination.totalCount)
}

export const getArticlesCountByCategory = (config: ClientConfig, usePreview: boolean, articleType: ArticleTypeWithAll) => {
  const query = getItemsCountByTypeQuery(config, usePreview, contentTypes.article.codename);

  if (articleType !== 'all') {
    query.containsFilter(`elements.${contentTypes.article.elements.type.codename}`, [articleType])
  }

  return query
    .toPromise()
    .then(res => res.data.pagination.totalCount || 0)
}

export const getProductTaxonomy = async (config: ClientConfig, usePreview: boolean) =>
  getDeliveryClient(config)
    .taxonomy("product_category")
    .queryConfig({
      usePreviewMode: usePreview,
      waitForLoadingNewContent: usePreview
    })
    .toPromise()
    .then(res => res.data.taxonomy.terms);

export const getDefaultMetadata = async (config: ClientConfig, usePreview: boolean) =>
  getDeliveryClient(config)
    .items<WSL_WebSpotlightRoot>()
    .type(homepageTypeCodename)
    .collection(siteCodename)
    .queryConfig({
      usePreviewMode: usePreview,
      waitForLoadingNewContent: usePreview
    })
    .elementsParameter(Object.values(contentTypeSnippets.metadata.elements).map(element => element.codename))
    .depthParameter(defaultDepth)
    .toPromise()
    .then(res => {
      const data = res.data.items[0];
      if (!data) {
        throw new Error('Default metadata not found.');
      }
      return data;
    })

export const getItemBySlug = async <T extends IContentItem>(config: ClientConfig, slug: string, type: string, usePreview: boolean = false): Promise<T | null> => {
  const items = await getDeliveryClient(config)
    .items<T>()
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

export const getPagesSlugs = (config: ClientConfig) =>
  getDeliveryClient(config)
    .items<WSL_Page>()
    .type(contentTypes.page.codename)
    .collections([siteCodename, "default"])
    .elementsParameter([contentTypes.page.elements.slug.codename])
    .toAllPromise()
    .then(res => res.data.items.map(item => item.elements.slug.value));

export const getItemsByCodenames = (config: ClientConfig, codenames: string[], usePreview: boolean) => 
  getDeliveryClient(config)
    .items()
    .inFilter("system.codename", codenames)
    .collections([siteCodename, "default"])
    .queryConfig({
      usePreviewMode: usePreview,
      waitForLoadingNewContent: usePreview
    })
    .depthParameter(defaultDepth)
    .toAllPromise();
