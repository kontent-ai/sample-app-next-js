import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import { ParsedUrlQuery } from 'querystring';
import { FC } from "react";

import { AppPage } from "../../components/shared/ui/appPage";
import { getDefaultMetadata, getProductDetail, getProductItemsWithSlugs, getSiteMenu } from "../../lib/kontentClient";
import { ValidCollectionCodename } from "../../lib/types/perCollection";
import { siteCodename } from "../../lib/utils/env";
import { createElementSmartLink } from "../../lib/utils/smartLinkUtils";
import { contentTypes, Nav_NavigationItem, Product, SEOMetadata } from "../../models"


type Props = Readonly<{
  product: Product;
  siteCodename: ValidCollectionCodename;
  defaultMetadata: SEOMetadata;
  siteMenu: Nav_NavigationItem | null;
}>;

interface IParams extends ParsedUrlQuery {
  slug: string
}

export const getStaticPaths: GetStaticPaths = () => {
  return getProductItemsWithSlugs()
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
        {...createElementSmartLink(contentTypes.product.elements.product_base__name.codename)}
      >
        {product.elements.productBaseName.value}
      </h1>
      <div {...createElementSmartLink(contentTypes.product.elements.product_base__main_image.codename)}>
        {
          product.elements.productBaseMainImage.value[0] && (
            <Image
              src={product.elements.productBaseMainImage.value[0].url}
              alt={product.elements.productBaseMainImage.value[0].description || product.elements.productBaseMainImage.value[0].url.split('/').pop() || "Product image"}
              width={widthLimit}
              height={product.elements.productBaseMainImage.value[0].height || 200}
              className="object-cover"
              priority
            />
          )
        }
      </div>
      <div {...createElementSmartLink(contentTypes.product.elements.product_base__description.codename)}>
        {product.elements.productBaseDescription.value}
      </div>
    </div>
  </AppPage >
);

export default ProductDetail;
