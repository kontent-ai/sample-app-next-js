import { GetStaticProps } from "next/types";
import { FC } from "react";
import { ListItem } from "../components/listingPage/ListItem";
import { AppPage } from "../components/shared/ui/appPage";

type Product = Readonly<{
  imageUrl: string;
  name: string;
}>;

type Props = Readonly<{
  products: ReadonlyArray<Product>;
}>;

export const Products: FC<Props> = props => (
  <AppPage menuItems={[]}>
    <h1 className="text-5xl font-bold flex justify-center">Our great products: </h1>
    <ul className="w-full flex flex-wrap list-none gap-32 pt-36">
      {props.products.map(p => <ListItem key={p.name} imageUrl={p.imageUrl} title={p.name} detailUrl="test" />)}
    </ul>
  </AppPage>
);

export const getStaticProps: GetStaticProps<Props> = async context => {
  return {
    props: { products: sampleProducts },
  };
}

const sampleProducts: ReadonlyArray<Product> = [
  {
    imageUrl: "https://m.media-amazon.com/images/I/61YymKyHMCL.jpg",
    name: "Microscope 2000x",
  },
  {
    imageUrl: "https://ychef.files.bbci.co.uk/976x549/p027b1pn.jpg",
    name: "Become Cyborg 300",
  },
  {
    imageUrl: "https://cdn11.bigcommerce.com/s-65c7m3a4v0/images/stencil/640w/products/981/73/A3000-LED__61344.1618606600.jpg",
    name: "Microscope 3000-led",
  },
  {
    imageUrl: "https://coimages.sciencemuseumgroup.org.uk/images/16/992/medium_A62993__0001_.jpg",
    name: "Microscope BeOldSchool",
  },
  {
    imageUrl: "https://www.nhmshop.co.uk/media/catalog/product/cache/76cb435c7ac87e45f882b91c2955391d/a/1/a13173-microscope-outdoor-adventure-2.jpg",
    name: "Super-portable microscope",
  },
];

export default Products;
