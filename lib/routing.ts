
import { Reference } from "../models/content-type-snippets";
import { isWSL_WebSpotlightRoot } from "../models/content-types/WSL_webSpotlightRoot";
import { contentTypes, taxonomies } from "../models/environment";
import { CoreContentType } from "../models/system";


const getExternalUrlsMapping = () => Object.fromEntries(
  process.env.NEXT_PUBLIC_OTHER_COLLECTIONS_DOMAINS?.split(",")
    .map(collectionPair => collectionPair.split(":"))
    .map(([collectionCodename, domain]) => [collectionCodename, "https://" + domain]) ?? []
);

// union type of all nested terms codenames
type RecursiveTaxonomyCodenames<T extends { readonly terms: unknown }> = keyof T["terms"] extends infer TermCodenames
  ? TermCodenames extends keyof T["terms"]
  ? T["terms"][TermCodenames] extends infer ChildTerm extends { readonly terms: unknown }
  ? RecursiveTaxonomyCodenames<ChildTerm> | TermCodenames
  : never
  : never
  : never;

type ArticleListingPathOptions = Readonly<{
  type: typeof contentTypes.article.codename;
  term: keyof typeof taxonomies.article_type.terms | "all",
  page?: number
}>;

type ProductListingPathOptions = Readonly<{
  type: typeof contentTypes.product.codename;
  terms: ReadonlyArray<RecursiveTaxonomyCodenames<typeof taxonomies.product_category>>
  page?: number
}>;

type GenericContentTypeOptions = Readonly<{
  type: typeof contentTypes.page.codename
  | typeof contentTypes.article.codename
  | typeof contentTypes.product.codename
  | typeof contentTypes.solution.codename,
  slug: string
}>;
type WebSpotlightRootOptions = Readonly<{
  type: typeof contentTypes.web_spotlight_root.codename
}>;

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
        const query = createQueryString({
          category: context.terms as string[],
          page: context.page?.toString() || undefined
        });
        return `/${reservedListingSlugs.products}${query && '?' + query}`
      }

      return `/${reservedListingSlugs.products}/${context.slug}`;
    }
    case contentTypes.solution.codename: {
      return `/solutions/${context.slug}`
    }
    default:
      throw Error(`Not supported resolution for options ${JSON.stringify(context)}`);
  }
}

export const resolveReference = (reference: CoreContentType<Reference>) => {
  if (reference.elements.reference__external_uri.value) {
    return reference.elements.reference__external_uri.value;
  }

  const referencedItem = reference.elements.reference__content__item_link.linkedItems[0];

  if (!referencedItem) {
    console.info(`Linked item not found when resolving item with codename ${reference.system.codename} of type ${reference.system.type}`);
    return "#";
  }

  const collectionDomain = getExternalUrlsMapping()[referencedItem.system.collection] || "";

  const slug = isWSL_WebSpotlightRoot(referencedItem)
    ? "/"
    : referencedItem.elements.slug.value; // expecting "slug" codename

  const urlPath = resolveUrlPath({
    type: referencedItem.system.type,
    slug
  } as GenericContentTypeOptions);

  return collectionDomain + urlPath;
}

export const createQueryString = (params: Record<string, string | string[] | undefined>) => {

  const queryString = Object.entries(params).map(
    ([paramKey, paramValue]) => {
      if (!paramValue) {
        return undefined;
      }

      return typeof paramValue === 'string'
        ? `${paramKey}=${paramValue}`
        : paramValue.map(v => `${paramKey}=${v}`).join('&');
    },)
    .filter(p => p !== undefined)
    .join('&');

  return queryString;
}