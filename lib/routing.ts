import { Article, contentTypes, Product, WSL_Page, WSL_WebSpotlightRoot } from "../models";
import { Reference } from '../models/content-type-snippets/reference';
import { PerCollection } from "./types/perCollection";

export type PerCollectionCodenames = PerCollection<string | null>;

export const pageCodenames = {
  "about-us": {
    ficto_healthtech: "about_us_f9c172b",
    ficto_healthtech_surgical: "about_us_f9c172b",
    ficto_healthtech_imaging: "about_us_f9c172b",
  },
  products: {
    ficto_healthtech: null,
    ficto_healthtech_imaging: null,
    ficto_healthtech_surgical: "products_surgical"
  },
  articles: {
    ficto_healthtech: "articles",
    ficto_healthtech_imaging: null,
    ficto_healthtech_surgical: "articles_surgical"
  },
} as const satisfies Record<string, PerCollectionCodenames>;

export const resolveUrlPath = (urlSlug: string, type: string) => {

  // Possible to extend load more context to use i.e. taxonomy to define more complex routing.
  // const item = await getItemBySlug(urlSlug, type);

  switch (type) {
    case contentTypes.web_spotlight_root.codename: {
      return `/`;
    }
    case contentTypes.page.codename: {
      // Possible to extend Page content type by i.e taxonomy to define more complex routing.
      return `/${urlSlug}`;
    }
    case contentTypes.article.codename: {
      return `/articles/${urlSlug}`;

    }
    case contentTypes.product.codename: {
      return `/products/${urlSlug}`;
    }
    default:
      throw Error(`Not supported resolution for items of type ${type}`);
  }
}

const isWSRoot = (item: WSL_Page | WSL_WebSpotlightRoot | Product | Article): item is WSL_WebSpotlightRoot =>
  item.system.type === contentTypes.web_spotlight_root.codename;

export const resolveReference = (reference: Reference) => {
  if (reference.elements.referenceExternalUrl.value) {
    return reference.elements.referenceExternalUrl.value;
  }

  const referencedItem = reference.elements.referenceInternalLink.linkedItems[0];

  if (!referencedItem) {
    console.error(`Linked item not found when resolving item with codename ${reference.system.codename}`);
    return "#";
  }

  if (isWSRoot(referencedItem)) {
    return resolveUrlPath("/", referencedItem.system.type)
  }

  return resolveUrlPath(referencedItem.elements.slug.value, referencedItem.system.type);
}