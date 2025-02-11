'use client'
import { ITaxonomyTerms } from "@kontent-ai/delivery-sdk";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Product } from "../../models";
import { ProductsPageSize } from "../../lib/constants/paging";
import { ProductItem } from "../listingPage/ProductItem";
import { resolveUrlPath } from "../../lib/routing";
import { updateSearchParams } from "../../lib/utils/searchParamsUtils";

const ProductsListing: FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [totalCount, setTotalCount] = useState(0);
  const [products, setProducts] = useState<ReadonlyArray<Product> | undefined>([]);
  const [taxonomies, setTaxonomies] = useState<ITaxonomyTerms[]>([]);
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const category = searchParams.getAll("category");

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
    const response = await fetch(`/api/products${searchParams?.toString() && '?' + searchParams.toString()}`);
    const newData = await response.json();

    setProducts(newData.products);
    setTotalCount(newData.totalCount);
  }, [searchParams, setProducts, setTotalCount])

  const getProductCategories = useCallback(async () => {
    const response = await fetch(`/api/product-categories`);
    const productCategories = await response.json();

    setTaxonomies(productCategories);
  }, [setTaxonomies])
  
  useEffect(() => {
    getProducts();
  }, [getProducts])

  useEffect(() => {
    getProductCategories();
  }, [getProductCategories])

  const onPreviousClick = () => {
    if (pageNumber === 2) {
      const newParams = updateSearchParams(searchParams, {page: null});

      router.replace(`${pathname}?${newParams}`, {scroll: false});
    } else {
      const newParams = updateSearchParams(searchParams, {page: [(pageNumber - 1).toString()]});

      router.replace(`${pathname}?${newParams}`, {scroll: false});
    }
  }
  
    const onNextClick = () => {
      const newParams = updateSearchParams(searchParams, {page: [(pageNumber + 1).toString()]});
  
      router.replace(`${pathname}?${newParams}`, {scroll: false});
    }
  
    const renderFilterOption = (term: ITaxonomyTerms) => {
      const onCheckBoxClicked = (isChecked: boolean) => {
        const newCategories = isChecked
          ? [...categories, term.codename, ...term.terms.map((t) => t.codename)]
          : categories.filter((c) => c !== term.codename && !term.terms.map((t) => t.codename).includes(c));
  
        const newParams = updateSearchParams(searchParams, {category: newCategories});
  
        router.replace(`${pathname}?${newParams}`, {scroll: false});
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

  return(
    <>
      <h2 className="m-0 mt-16 ml-4 sm:ml-0">Surgical products</h2>

      <div className="flex flex-col md:flex-row mt-4 md:gap-2 text-white">
        <div className="flex flex-col bg-mainBackgroundColor p-4">
          <h4 className="m-0 py-2 text-white">Category</h4>
          <ul className="m-0 min-h-full gap-2 p-0 list-none">
            {Array.isArray(taxonomies) && taxonomies.map(renderFilterOption)}
          </ul>
        </div>
        <ProductItems products={products} />
      </div>

      <div className="mt-8 flex flex-row justify-center pb-6">
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
  </>
  )
}

type ProductListingProps = Readonly<{
  products: ReadonlyArray<Product> | undefined,
}>

const ProductItems: FC<ProductListingProps> = (props) => {
  if (!props.products || props.products.length === 0) {
    return (
      <div className="self-center text-center w-full h-10 pt-2">No products with specified criteria</div>
    )
  }

  return (
    <ul className="w-full not-prose min-h-full mt-4 m-0 md:mt-0 p-0 px-4 sm:px-0 grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 list-none items-center md:justify-start gap-2">
      {props.products.map(p => (
        <ProductItem
          key={p.system.id}
          imageUrl={p.elements.product_base__main_image.value[0]?.url || ""}
          title={p.elements.product_base__name.value}
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

export default ProductsListing;