import { GetStaticProps } from "next/types";
import { FC, Suspense, useCallback, useEffect, useState } from "react";
import { ListItem } from "../../components/listingPage/ListItem";
import { Content } from "../../components/shared/Content";
import { AppPage } from "../../components/shared/ui/appPage";
import { getItemByCodename, getProductsForListing, getSiteMenu } from "../../lib/kontentClient";
import { PerCollectionCodenames } from "../../lib/routing";
import { ValidCollectionCodename } from "../../lib/types/perCollection";
import { siteCodename } from "../../lib/utils/env";
import { Block_Navigation, WSL_Page, Product } from "../../models";
import { useRouter } from "next/router";


type Props = Readonly<{
  page: WSL_Page;
  products: ReadonlyArray<Product> | undefined;
  siteCodename: ValidCollectionCodename;
  siteMenu?: Block_Navigation;
}>;

type ItemProps = Readonly<{
  products?: ReadonlyArray<Product> | undefined,
}>

const Items: FC<ItemProps> = (props) => {
  const router = useRouter();
  const { page, category } = router.query
  const [products, setProducts] = useState(props.products);

  const getProducts = useCallback(async () => {
    const response = await fetch(`/api${router.asPath}`);
    const data = await response.json();

    setProducts(data.products);
  }, [router.asPath, page, category])

  useEffect(() => {
    if (page || category) {
      getProducts();
      return;
    }
    setProducts(props.products);
  }, [getProducts, page, props.products, category])

  return (
    <ul className="w-ull flex flex-wrap list-none justify-start gap-5 pt-4">
      {products?.map(p => (
        <ListItem
          key={p.system.id}
          imageUrl={p.elements.productImage.value[0].url}
          title={p.elements.title.value}
          detailUrl={`products/${p.elements.slug.value}`}
          itemId={p.system.id}
        />
      ))}
    </ul>
  )
}

const FilterOptions: Record<string, string> = {
  "precision_instruments": "Precision instruments",
  "sanitary_clothing": "Sanitary Clothing",
  "machinery": 'Machinery',
  'other': 'Other'

}

export const Products: FC<Props> = props => {
  const router = useRouter();
  const [paging, setPaging] = useState(1);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const params: Record<string, string | string[]> = {};
    if (paging > 1) {
      params.page = paging.toString();
    }
    if (categories.length > 0) {
      params.category = categories;
    }
    router.replace({ query: params ? params : null });
  }, [paging, categories])

  const renderFilterOption = (optionCodename: string, labelText: string, onClick: (checked: boolean) => void) => {
    return (
      <div className="flex items-center mb-4">
        <input id={optionCodename} type="checkbox" onChange={(event) => onClick(event.target.checked)} value="" className="w-4 h-4 bg-gray-100 border-gray-300 rounded" />
        <label htmlFor={optionCodename} className="ml-2 text-sm font-medium text-gray-600">{labelText}</label>
      </div>
    );
  };


  return (
    <AppPage siteCodename={props.siteCodename} siteMenu={props.siteMenu}>
      {props.page.elements.content.linkedItems.map(piece => (
        <Content key={piece.system.id} item={piece as any} />
      ))}

      <ul>
        {Object.entries(FilterOptions).map(([codename, name]) =>
          renderFilterOption(codename, name, (checked) => setCategories(prev => checked ? prev.concat([codename]) : prev.filter(a => a !== codename))))}
      </ul>
     
      <Suspense fallback={<p>fsdaf</p>}>
        <Items products={props.products} />
      </Suspense>

      <button
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700"
        onClick={() => setPaging(prev => prev > 1 ? prev - 1 : 1)}
      >Previous</button>
      <button
        className="inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700"
        onClick={() => setPaging(prev => prev + 1)}
      >Next</button>

    </AppPage>
  )
};

export const getStaticProps: GetStaticProps<Props> = async context => {
  const pageCodename: PerCollectionCodenames = {
    ficto_healthtech: null,
    ficto_healthtech_imaging: null,
    ficto_healthtech_surgical: "products"
  };

  const page = await getItemByCodename<WSL_Page>(pageCodename, !!context.preview);
  const products = await getProductsForListing(!!context.preview);
  const siteMenu = await getSiteMenu(!!context.preview);

  if (page === null) {
    return {
      notFound: true
    };
  };

  return {
    props: { page, siteCodename, products, siteMenu },
  };
}

export default Products;
