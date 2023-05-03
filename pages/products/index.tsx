import { GetStaticProps } from "next/types";
import { FC } from "react";
import { ListItem } from "../../components/listingPage/ListItem";
import { AppPage } from "../../components/shared/ui/appPage";
import { ValidCollectionCodename } from "../../lib/types/perCollection";
import { siteCodename } from "../../lib/utils/env";
import { getItemByCodename, getProductsForListing } from "../../lib/kontentClient";
import { Page, Product } from "../../models";
import { pageCodenames } from "../../lib/routing";

type Props = Readonly<{
  page: Page;
  products: ReadonlyArray<Product> | undefined;
  siteCodename: ValidCollectionCodename;
}>;

export const Products: FC<Props> = props => (
  <AppPage siteCodename={props.siteCodename}>
    <h1 className="text-5xl font-bold flex justify-center">Our great products: </h1>
    <ul className="w-full flex flex-wrap list-none justify-between pt-4 ">
      {props.products && props.products.map(p => <ListItem key={p.elements.title.value} imageUrl={p.elements.productImage.value[0].url} title={p.elements.title.value} detailUrl={`products/${p.elements.slug.value}`} />)}
    </ul>
  </AppPage>
);

export const getStaticProps: GetStaticProps<Props> = async context => {
  const pageCodename = pageCodenames['products'];

  const page = await getItemByCodename<Page>(pageCodename , !!context.preview);
  const products = await getProductsForListing(!!context.preview);

  if (page === null) {
    return {
      notFound: true
    };
  };

  return {
    props: { page, siteCodename, products },
  };
}

export default Products;
