import { GetStaticPaths, GetStaticProps, Redirect } from "next";
import { Product, contentTypes } from "../../models"
import { FC } from "react";
import { getProductDetail, getProductSlugs, getSiteMenu } from "../../lib/kontentClient";
import { ParsedUrlQuery } from 'querystring';
import { siteCodename } from "../../lib/utils/env";
import { ValidCollectionCodename } from "../../lib/types/perCollection";
import { AppPage } from "../../components/shared/ui/appPage";
import Image from "next/image";
import { createElementSmartLink } from "../../lib/utils/smartLinkUtils";
import { Block_Navigation } from "../../models";

type Props = Readonly<{
  product: Product;
  siteCodename: ValidCollectionCodename;
  siteMenu?: Block_Navigation;
}>;

interface IParams extends ParsedUrlQuery {
  slug: string
}

export const getStaticPaths: GetStaticPaths = () => {
  // https://nextjs.org/docs/basic-features/data-fetching/get-static-paths#generating-paths-on-demand
  // if (process.env.SKIP_BUILD_STATIC_GENERATION) {
  //     return {
  //       paths: [],
  //       fallback: 'blocking',
  //     }
  //   }

  return getProductSlugs()
    .then(products => ({
      paths: products.map(product => `/products/${product.elements.slug.value}`),
      fallback: 'blocking'
    }));
}

const nonPermanentHomeRedirect: { redirect: Redirect } = {
  redirect: {
    permanent: false,
    destination: '/404'
  }
};

export const getStaticProps: GetStaticProps<Props, IParams> = async (context) => {
  const slug = context.params?.slug;

  if (!slug) {
    return nonPermanentHomeRedirect;
  };

  const product = await getProductDetail(slug, !!context.preview);
  const siteMenu = await getSiteMenu(!!context.preview);

  if (!product) {
    return nonPermanentHomeRedirect;
  }

  return {
    props: {
      product,
      siteCodename,
      siteMenu
    }
  };
};

const widthLimit = 300;

const ProductDetail: FC<Props> = ({ product, siteCodename, siteMenu }) => (
  <AppPage itemId={product.system.id} siteCodename={siteCodename} siteMenu={siteMenu}>
    <div>
      <h1
        {...createElementSmartLink(contentTypes.product.elements.title.codename)}
      >
        {product.elements.title.value}
      </h1>
      <div {...createElementSmartLink(contentTypes.product.elements.product_image.codename)}>
        <Image
          src={`${product.elements.productImage.value[0].url}?w=${widthLimit}`}
          alt={product.elements.productImage.value[0].description || product.elements.productImage.value[0].url.split('/').pop() || "Product image"}
          width={widthLimit}
          height={product.elements.productImage.value[0].height || 200}
          className="object-cover"
          priority
        />
      </div>
      <div {...createElementSmartLink(contentTypes.product.elements.description.codename)}>
        {product.elements.description.value}
      </div>
    </div>
  </AppPage >
);

export default ProductDetail;
