import { ITaxonomyTerms } from "@kontent-ai/delivery-sdk";
import { useRouter } from "next/router";
import { GetStaticProps } from "next/types";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

import { ProductItem } from "../../components/listingPage/ProductItem";
import { Content } from "../../components/shared/Content";
import { AppPage } from "../../components/shared/ui/appPage";
import { mainColorBgClass } from "../../lib/constants/colors";
import { ProductsPageSize } from "../../lib/constants/paging";
import { getDefaultMetadata, getItemByCodename, getProductsForListing, getSiteMenu } from "../../lib/kontentClient";
import { pageCodenames } from "../../lib/routing";
import { ValidCollectionCodename } from "../../lib/types/perCollection";
import { changeUrlQueryString } from "../../lib/utils/changeUrlQueryString";
import { siteCodename } from "../../lib/utils/env";
import { Nav_NavigationItem, Product, SEOMetadata, WSL_Page } from "../../models";

type Props = Readonly<{
  page: WSL_Page;
  products: ReadonlyArray<Product> | undefined;
  siteCodename: ValidCollectionCodename;
  totalCount: number;
  siteMenu: Nav_NavigationItem | null;
  isPreview: boolean;
  defaultMetadata: SEOMetadata;
}>;

type ProductListingProps = Readonly<{
  products: ReadonlyArray<Product> | undefined,
}>

const createQueryStringUrl = (params: Record<string, string | string[] | undefined>) => {
  const queryString = Object.entries(params).map(
    ([paramKey, paramValue]) => {
      if (!paramValue) {
        return undefined;
      }

      return typeof paramValue === 'string'
        ? `${paramKey}=${paramValue}`
        : paramValue.map(v => `${paramKey}=${v}`).join('&');
    },
  ).filter(p => p !== undefined).join('&');

  return Object.keys(params).length > 0 ? `?${queryString}` : '';
}

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
          imageUrl={p.elements.productImage.value[0]?.url || ""}
          title={p.elements.title.value}
          detailUrl={`products/${p.elements.slug.value}`}
          price={p.elements.price.value}
          category={p.elements.productCategory.value[0]?.name || ""}
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
  const { page, category } = router.query

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
    const { page, category } = router.query;
    const queryStringUrl = createQueryStringUrl({ preview: props.isPreview.toString(), page, category })

    const response = await fetch(`/api/products${queryStringUrl}`);
    const newData = await response.json();

    setProducts(newData.products);
    setTotalCount(newData.totalCount);
  }, [router.query, props.isPreview])

  const getProductCategories = useCallback(async () => {
    const response = await fetch(`/api/product-categories?preview=${props.isPreview}`);
    const productCategories = await response.json();

    setTaxonomies(productCategories);
  }, [props.isPreview])

  useEffect(() => {
    getProducts();
  }, [page, category, getProducts])

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

      changeUrlQueryString({ category: newCategories }, router);
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
            {term.terms.map((t) => renderFilterOption(t))}
          </ul>
        )}
      </li>

    );
  };

  return (
    <AppPage
      siteCodename={props.siteCodename}
      siteMenu={props.siteMenu}
      defaultMetadata={props.defaultMetadata}
      item={props.page}
      pageType="WebPage"
    >
      {props.page.elements.content.linkedItems.map(piece => (
        <Content
          key={piece.system.id}
          item={piece as any}
        />
      ))}

      <h2 className="m-0 mt-16 ml-4 sm:ml-0">Surgical products</h2>

      <div className="flex flex-col md:flex-row mt-4 md:gap-2">
        <div className={`flex flex-col ${mainColorBgClass[props.siteCodename]} p-4`}>
          <h4 className="m-0 py-2">Category</h4>
          <ul className="m-0 min-h-full gap-2 p-0 list-none">
            {taxonomies.map(term =>
              renderFilterOption(term))}
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

export const getStaticProps: GetStaticProps<Props> = async context => {
  const pageCodename = pageCodenames.products

  const page = await getItemByCodename<WSL_Page>(pageCodename, !!context.preview);
  const products = await getProductsForListing(!!context.preview);
  const siteMenu = await getSiteMenu(!!context.preview);
  const defaultMetadata = await getDefaultMetadata(!!context.preview);

  if (page === null) {
    return {
      notFound: true
    };
  }

  return {
    props: { page, siteCodename, defaultMetadata, products: products.items, totalCount: products.pagination.totalCount ?? 0, siteMenu, isPreview: !!context.preview },
  };
}

export default Products;
