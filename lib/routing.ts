import { Article, contentTypes, Product, taxonomies, WSL_Page, WSL_WebSpotlightRoot } from "../models";
import { Reference } from '../models/content-type-snippets/reference';

const getExternalUrlsMapping = () => Object.fromEntries(
  process.env.NEXT_PUBLIC_OTHER_COLLECTIONS_DOMAINS?.split(",")
    .map(collectionPair => collectionPair.split(":"))
    .map(([collectionCodename, domain]) => [collectionCodename, "https://" + domain]) ?? []
);

type RecursiveTaxonomyCodenames<T extends { readonly terms: unknown }> = keyof T["terms"] extends infer TermCodenames
  ? TermCodenames extends keyof T["terms"]
  ? T["terms"][TermCodenames] extends infer ChildTerm extends { readonly terms: unknown }
  ? RecursiveTaxonomyCodenames<ChildTerm> | TermCodenames
  : never
  : never
  : never;

type ArticleListingPathOptions = {
  type: typeof contentTypes.article.codename;
  term: keyof typeof taxonomies.article_type.terms | "all",
  page?: number
}

type ProductListingPathOptions = {
  type: typeof contentTypes.product.codename;
  terms: ReadonlyArray<RecursiveTaxonomyCodenames<typeof taxonomies.product_category>>
  page?: number
}

type GenericContentTypeOptions = {
  type: typeof contentTypes.page.codename
  | typeof contentTypes.article.codename
  | typeof contentTypes.product.codename,
  slug: string
}

type WebSpotlightRootOptions = {
  type: typeof contentTypes.web_spotlight_root.codename
}

export type ResolutionContext = GenericContentTypeOptions
  | ArticleListingPathOptions
  | ProductListingPathOptions
  | GenericContentTypeOptions
  | WebSpotlightRootOptions;

export const reservedListingSlugs = {
  articles: "articles",
  products: "products"
};

export const resolveUrlPath = (context: ResolutionContext) => {

  switch (context.type) {
    case contentTypes.web_spotlight_root.codename: {
      return `/`;
    }
    case contentTypes.page.codename: {
      // Possible to extend Page content type by i.e taxonomy to define more complex routing.
      return `/${context.slug}`;
    }
    case contentTypes.article.codename: {
      if ("term" in context) {
        if (context.term === "all" && !context.page) {
          return `/${reservedListingSlugs.articles}`
        }

        return `/${reservedListingSlugs.articles}/category/${context.term}${context.page ? `/page/${context.page}` : ""}`
      }

      return `/${reservedListingSlugs.articles}/${context.slug}`;

    }
    case contentTypes.product.codename: {
      if ("terms" in context) {
        const categoriesQuery = context.terms.map(term => `category=${term}`).join("&");
        const pageQuery = context.page ? `&page=${context.page}` : "";
        return `/${reservedListingSlugs.products}?${categoriesQuery}${pageQuery}`
      }

      return `/${reservedListingSlugs.products}/${context.slug}`;
    }
    default:
      throw Error(`Not supported resolution for options ${JSON.stringify(context)}`);
  }
}

const isWSRoot = (item: WSL_Page | WSL_WebSpotlightRoot | Product | Article): item is WSL_WebSpotlightRoot =>
  item.system.type === contentTypes.web_spotlight_root.codename;

export const resolveReference = (reference: Reference) => {
  if (reference.elements.referenceExternalUri.value) {
    return reference.elements.referenceExternalUri.value;
  }

  const referencedItem = reference.elements.referenceContentItemLink.linkedItems[0];

  if (!referencedItem) {
    console.info(`Linked item not found when resolving item with codename ${reference.system.codename} of type  ${reference.system.type}`);
    return "#";
  }

  const collectionDomain = getExternalUrlsMapping()[referencedItem.system.collection] || "";

  const slug = isWSRoot(referencedItem)
    ? "/"
    : referencedItem.elements.slug.value; // expecting "slug" codename

  const urlPath = resolveUrlPath({
    type: referencedItem.system.type,
    slug
  } as GenericContentTypeOptions);

  return collectionDomain + urlPath;
}