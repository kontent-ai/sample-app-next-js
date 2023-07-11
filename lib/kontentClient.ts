import { camelCasePropertyNameResolver, createDeliveryClient, DeliveryError, IContentItem } from '@kontent-ai/delivery-sdk';

import { Article, contentTypes, Product, SEOMetadata, WSL_WebSpotlightRoot } from '../models';
import { perCollectionRootItems } from './constants/menu';
import { ArticlePageSize, ProductsPageSize } from './constants/paging';
import { PerCollectionCodenames } from './routing';
import { ArticleTypeWithAll } from './utils/articlesListing';
import { siteCodename } from './utils/env';

const sourceTrackingHeaderName = 'X-KC-SOURCE';

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
    .depthParameter(10)
    .toPromise()
    .then(res => res.data.items[0] as WSL_WebSpotlightRoot | undefined)

export const getProductsForListing = (usePreview: boolean, page?: number, categories?: string[], pageSize: number = ProductsPageSize) => {
  const query = deliveryClient
    .items<Product>()
    .type(contentTypes.product.codename)
    .collection(siteCodename)
    .elementsParameter([
      contentTypes.product.elements.title.codename,
      contentTypes.product.elements.product_image.codename,
      contentTypes.product.elements.slug.codename,
      contentTypes.product.elements.category.codename,
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

export const getSiteMenu = async (usePreview: boolean) => {
  const res = await getItemByCodename<WSL_WebSpotlightRoot>(perCollectionRootItems, usePreview);

  return res?.elements.navigation.linkedItems[0];
}

export const getArticlesForListing = (usePreview: boolean, page?: number, articleType?: string, pageSize: number = ArticlePageSize) => {
  const query = deliveryClient
    .items<Article>()
    .type(contentTypes.article.codename)
    .collection(siteCodename)
    .orderByDescending(`elements.${contentTypes.article.elements.publishing_date.codename}`)
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .limitParameter(pageSize)

  if (page) {
    query.skipParameter((page - 1) * pageSize)
  }

  if (articleType && articleType !== 'all') {
    query.containsFilter(`elements.${contentTypes.article.elements.article_type.codename}`, [articleType])
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
    .collection(siteCodename)
    .queryConfig({
      usePreviewMode: usePreview
    })
    .toPromise()
    .then(res => res.data);

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
    query.containsFilter(`elements.${contentTypes.article.elements.article_type.codename}`, [articleType])
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
    .depthParameter(10)
    .toPromise()
    .then(res => res.data.items[0] as SEOMetadata)