import { GetStaticPaths, GetStaticProps, GetStaticPropsResult, Redirect } from "next";
import { Product, contentTypes } from "../../models"
import { FC } from "react";
import { getProductDetail, getProductSlugs } from "../../lib/kontentClient";
import { ParsedUrlQuery } from 'querystring';
import { siteCodename } from "../../lib/utils/env";
import { ValidCollectionCodename } from "../../lib/types/perCollection";
import { AppPage } from "../../components/shared/ui/appPage";
import Image from "next/image";
import { RichTextContentComponent } from "../../components/shared/RichTextContent";
import { PortableText } from "@portabletext/react";

type Props = Readonly<{
  product: Product;
  siteCodename: ValidCollectionCodename;
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
    .then(product => ({
      paths: product.map(product => product.elements.slug.value),
      fallback: 'blocking'
    }));
}

const nonPermanentRedirect: { redirect: Redirect } = {
  redirect: {
    permanent: false,
    destination: '/404'
  }
};

export const getStaticProps: GetStaticProps<Props, IParams> = async (context) => {
  const slug = context.params?.slug;

  if (!slug) {
    return nonPermanentRedirect;
  };

  const product = await getProductDetail(slug, !!context.preview);

  if (!product) {
    return nonPermanentRedirect;
  }

  return {
    props: {
      product,
      siteCodename
    }
  };
};

const widthLimit = 300;

const ProductDetail: FC<Props> = ({ product, siteCodename }) => (
  <AppPage itemId={product.system.id} siteCodename={siteCodename}>
    <div className="prose container">
      <h1
        data-kontent-element-codename={contentTypes.product.elements.title.codename}>
        {product.elements.title.value}
      </h1>
      <Image
        src={`${product.elements.productImage.value[0].url}?w=${widthLimit}`}
        alt={product.elements.productImage.value[0].description || product.elements.productImage.value[0].url.split('/').pop() || "Product image"}
        width={widthLimit}
        height={product.elements.productImage.value[0].height || 200}
        className="object-cover"
        priority
      />
      <div>
        {product.elements.description.value}
      </div>
    </div>
  </AppPage >
);

export default ProductDetail;
