import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import { ParsedUrlQuery } from 'querystring';
import { FC } from "react";

import { AppPage } from "../../components/shared/ui/appPage";
import { getDefaultMetadata, getProductDetail, getProductSlugs, getSiteMenu } from "../../lib/kontentClient";
import { ValidCollectionCodename } from "../../lib/types/perCollection";
import { siteCodename } from "../../lib/utils/env";
import { createElementSmartLink } from "../../lib/utils/smartLinkUtils";
import { Block_Navigation, contentTypes, Product, SEOMetadata } from "../../models"


type Props = Readonly<{
  product: Product;
  siteCodename: ValidCollectionCodename;
  defaultMetadata: SEOMetadata;
  siteMenu: Block_Navigation | null;
}>;

interface IParams extends ParsedUrlQuery {
  slug: string
}

export const getStaticPaths: GetStaticPaths = () => {
  return getProductSlugs()
    .then(products => ({
      paths: products.map(product => `/products/${product.elements.slug.value}`),
      fallback: 'blocking'
    }));
}

export const getStaticProps: GetStaticProps<Props, IParams> = async (context) => {
  const slug = context.params?.slug;

  if (!slug) {
    return { notFound: true };
  }

  const product = await getProductDetail(slug, !!context.preview);
  const siteMenu = await getSiteMenu(!!context.preview);
  const defaultMetadata = await getDefaultMetadata(!!context.preview);

  if (!product) {
    return { notFound: true };
  }

  return {
    props: {
      product,
      siteCodename,
      siteMenu,
      defaultMetadata
    }
  };
};

const widthLimit = 300;

const ProductDetail: FC<Props> = ({ product, siteCodename, siteMenu, defaultMetadata }) => (
  <AppPage
    item={product}
    siteCodename={siteCodename}
    siteMenu={siteMenu}
    defaultMetadata={defaultMetadata}
    pageType="Product"
  >
    <div>
      <h1
        {...createElementSmartLink(contentTypes.product.elements.title.codename)}
      >
        {product.elements.title.value}
      </h1>
      <div {...createElementSmartLink(contentTypes.product.elements.product_image.codename)}>
        {
          product.elements.productImage.value[0] && (
            <Image
              src={`${product.elements.productImage.value[0].url}?w=${widthLimit}`}
              alt={product.elements.productImage.value[0].description || product.elements.productImage.value[0].url.split('/').pop() || "Product image"}
              width={widthLimit}
              height={product.elements.productImage.value[0].height || 200}
              className="object-cover"
              priority
            />
          )
        }
      </div>
      <div {...createElementSmartLink(contentTypes.product.elements.description.codename)}>
        {product.elements.description.value}
      </div>
    </div>
  </AppPage >
);

export default ProductDetail;
