import { GetStaticProps } from "next/types";
import { FC } from "react";
import { ListItem } from "../../components/listingPage/ListItem";
import { Content } from "../../components/shared/Content";
import { AppPage } from "../../components/shared/ui/appPage";
import { getItemByCodename, getProductsForListing, getSiteMenu } from "../../lib/kontentClient";
import { PerCollectionCodenames } from "../../lib/routing";
import { ValidCollectionCodename } from "../../lib/types/perCollection";
import { siteCodename } from "../../lib/utils/env";
import { Navigation, WSL_Page, Product } from "../../models";
import { getMenuCodename } from "../../lib/constants/menu";

type Props = Readonly<{
  page: WSL_Page;
  products: ReadonlyArray<Product> | undefined;
  siteCodename: ValidCollectionCodename;
  siteMenu: Navigation;
}>;

export const Products: FC<Props> = props => (
  <AppPage siteCodename={props.siteCodename} siteMenu={props.siteMenu}>
    {props.page.elements.content.linkedItems.map(piece => (
      <Content key={piece.system.id} item={piece as any} />
    ))}
    <ul className="w-ull flex flex-wrap list-none justify-start gap-5 pt-4">
      {props.products?.map(p => (
        <ListItem
          key={p.system.id}
          imageUrl={p.elements.productImage.value[0].url}
          title={p.elements.title.value}
          detailUrl={`products/${p.elements.slug.value}`}
          itemId={p.system.id}
        />
      ))}
    </ul>
  </AppPage>
);

export const getStaticProps: GetStaticProps<Props> = async context => {
  const pageCodename: PerCollectionCodenames = {
    healthtech: null,
    healthtech_imaging: null,
    healthtech_surgical: "products"
  };

  const menuCodename = getMenuCodename(siteCodename);
  const page = await getItemByCodename<WSL_Page>(pageCodename, !!context.preview);
  const products = await getProductsForListing(!!context.preview);
  const siteMenu = await getSiteMenu(menuCodename, !!context.preview);

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
