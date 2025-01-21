import { ITaxonomyTerms } from "@kontent-ai/delivery-sdk";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps } from "next/types";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

import { ProductItem } from "../../../components/listingPage/ProductItem";
import { Content } from "../../../components/shared/Content";
import { AppPage } from "../../../components/shared/ui/appPage";
import { ProductsPageSize } from "../../../lib/constants/paging";
import { getDefaultMetadata, getItemBySlug, getProductsForListing, getSiteMenu } from "../../../lib/kontentClient";
import { createQueryString, reservedListingSlugs, resolveUrlPath } from "../../../lib/routing";
import { changeUrlQueryString } from "../../../lib/utils/changeUrlQueryString";
import { parseFlatted, Stringified, stringifyAsType } from "../../../lib/utils/circularityUtils";
import { defaultEnvId } from "../../../lib/utils/env";
import { getEnvIdFromRouteParams, getPreviewApiKeyFromPreviewData } from "../../../lib/utils/pageUtils";
import { contentTypes, Metadata, Nav_NavigationItem, Product, WSL_Page } from "../../../models";

type Props = Readonly<{
  page: Stringified<WSL_Page>;
  products: ReadonlyArray<Product> | undefined;
  totalCount: number;
  siteMenu: Stringified<Nav_NavigationItem>;
  isPreview: boolean;
  defaultMetadata: Metadata;
}>;

type ProductListingProps = Readonly<{
  products: ReadonlyArray<Product> | undefined,
}>

const ProductListing: FC<ProductListingProps> = (props) => {
  if (!props.products || props.products.length === 0) {
    return (
      <div className="self-center text-center w-full h-10 pt-2">No products with specified criteria</div>
    )
  }

  return (
    <ul className="w-full min-h-full mt-4 m-0 md:mt-0 p-0 px-4 sm:px-0 grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 list-none items-center md:justify-start gap-2">
      {props.products.map(p => (
        <ProductItem
          key={p.system.id}
          imageUrl={p.elements.productBaseMainImage.value[0]?.url || ""}
          title={p.elements.productBaseName.value}
          detailUrl={resolveUrlPath({
            type: "product",
            slug: p.elements.slug.value
          })}
          price={p.elements.price.value}
          category={p.elements.category.value[0]?.name || ""}
          itemId={p.system.id}
        />
      ))}
    </ul>
  )
}

export const Products: FC<Props> = props => {
  const router = useRouter();
  const [totalCount, setTotalCount] = useState(props.totalCount);
  const [products, setProducts] = useState<ReadonlyArray<Product> | undefined>(props.products);
  const [taxonomies, setTaxonomies] = useState<ITaxonomyTerms[]>([]);
  const { page, category } = router.query;
  const productsPage = parseFlatted(props.page);

  const pageNumber = useMemo(() => !page || isNaN(+page) ? 1 : +page, [page])

  const isLastPage = pageNumber * ProductsPageSize >= totalCount;

  const categories = useMemo(() => {
    if (!category) {
      return [];
    }
    if (typeof category === 'string') {
      return [category];
    }

    return category;
  }, [category])


  const getProducts = useCallback(async () => {
    const queryString = createQueryString({ preview: props.isPreview.toString(), page, category })

    const response = await fetch(`/api/products${queryString && '?' + queryString}`);
    const newData = await response.json();

    setProducts(newData.products);
    setTotalCount(newData.totalCount);
  }, [props.isPreview, page, category])

  const getProductCategories = useCallback(async () => {
    const response = await fetch(`/api/product-categories?preview=${props.isPreview}`);
    const productCategories = await response.json();

    setTaxonomies(productCategories);
  }, [props.isPreview])

  useEffect(() => {
    getProducts();
  }, [getProducts])

  useEffect(() => {
    getProductCategories();
  }, [getProductCategories])

  const onPreviousClick = () => {
    if (pageNumber === 2) {
      changeUrlQueryString(Object.fromEntries(Object.entries(router.query).filter(([name]) => name !== "page")), router);
    } else {
      changeUrlQueryString({ ...router.query, page: pageNumber - 1 }, router);
    }
  }

  const onNextClick = () => {
    changeUrlQueryString({ ...router.query, page: pageNumber + 1 }, router);
  }

  const renderFilterOption = (term: ITaxonomyTerms) => {
    const onCheckBoxClicked = (isChecked: boolean) => {
      const newCategories = isChecked
        ? [...categories, term.codename, ...term.terms.map((t) => t.codename)]
        : categories.filter((c) => c !== term.codename && !term.terms.map((t) => t.codename).includes(c));

      changeUrlQueryString({ ...router.query, category: newCategories }, router);
    };

    return (
      <li
        key={term.codename}
        className="m-0 p-0"
      >
        <div className="flex flex-row items-center min-w-fit">
          <input
            id={term.codename}
            type="checkbox"
            checked={categories.includes(term.codename)}
            onChange={(event) => onCheckBoxClicked(event.target.checked)}
            className="min-w-4 min-h-4 bg-gray-100 border-gray-300 rounded"
          />
          <label
            htmlFor={term.codename}
            className="ml-2 text-sm font-semibold whitespace-nowrap"
          >
            {term.name}
          </label>
        </div>
        {term.terms.length > 0 && (
          <ul className="list-none">
            {term.terms.map(renderFilterOption)}
          </ul>
        )}
      </li>

    );
  };

  return (
    <AppPage
      siteMenu={props.siteMenu}
      defaultMetadata={props.defaultMetadata}
      item={productsPage}
      pageType="WebPage"
    >
      {productsPage.elements.content.linkedItems.map((piece, index) => (
        <Content
          key={piece.system.id}
          item={piece as any}
          index={index}
        />
      ))}

      <h2 className="m-0 mt-16 ml-4 sm:ml-0">Surgical products</h2>

      <div className="flex flex-col md:flex-row mt-4 md:gap-2 text-white">
        <div className="flex flex-col bg-mainBackgroundColor p-4">
          <h4 className="m-0 py-2 text-white">Category</h4>
          <ul className="m-0 min-h-full gap-2 p-0 list-none">
            {Array.isArray(taxonomies) && taxonomies.map(renderFilterOption)}
          </ul>
        </div>
        <ProductListing products={products} />
      </div>

      <div className="mt-8 flex flex-row justify-center">
        <button
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg enabled:hover:bg-gray-100 disabled:bg-gray-200 enabled:hover:text-gray-700"
          onClick={onPreviousClick}
          disabled={pageNumber <= 1}
        >Previous
        </button>
        <button
          className="inline-flex items-center ml-2 px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg enabled:hover:bg-gray-100 disabled:bg-gray-200 enabled:hover:text-gray-700"
          onClick={onNextClick}
          disabled={isLastPage}
        >Next
        </button>
      </div>
    </AppPage>
  )
};

export const getStaticProps: GetStaticProps<Props, { envId: string }> = async context => {
  const envId = getEnvIdFromRouteParams(context);

  const previewApiKey = getPreviewApiKeyFromPreviewData(context.previewData);

  // We might want to bound listing pages to something else than URL slug
  const pageData = await getItemBySlug<WSL_Page>({ envId: envId, previewApiKey: previewApiKey }, reservedListingSlugs.products, contentTypes.page.codename, !!context.preview);


  if (pageData === null) {
    return {
      notFound: true
    };
  }

  const products = await getProductsForListing({ envId, previewApiKey }, !!context.preview);
  const siteMenuData = await getSiteMenu({ envId, previewApiKey }, !!context.preview);
  const defaultMetadata = await getDefaultMetadata({ envId, previewApiKey }, !!context.preview);

  if (!siteMenuData) {
    throw new Error("Can't find the main menu item.")
  }

  const siteMenu = stringifyAsType(siteMenuData);
  const page = stringifyAsType(pageData);

  return {
    props: { page, defaultMetadata, products: products.items, totalCount: products.pagination.totalCount ?? 0, siteMenu, isPreview: !!context.preview },
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{
      params: { envId: defaultEnvId }
    }],
    fallback: 'blocking',
  }
}


export default Products;
