import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import { ParsedUrlQuery } from 'querystring';
import { FC } from "react";

import { AppPage } from "../../../components/shared/ui/appPage";
import { mainColorButtonClass, mainColorHoverClass, mainColorTextClass } from "../../../lib/constants/colors";
import { getDefaultMetadata, getProductDetail, getProductItemsWithSlugs, getSiteMenu } from "../../../lib/kontentClient";
import { defaultEnvId, siteCodename } from "../../../lib/utils/env";
import { getEnvIdFromRouteParams, getPreviewApiKeyFromPreviewData } from "../../../lib/utils/pageUtils";
import { createElementSmartLink } from "../../../lib/utils/smartLinkUtils";
import { contentTypes, Metadata, Nav_NavigationItem, Product } from "../../../models";



type Props = Readonly<{
  product: Product;
  defaultMetadata: Metadata;
  siteMenu: Nav_NavigationItem | null;
}>;

interface IParams extends ParsedUrlQuery {
  slug: string
  envId: string
}

export const getStaticPaths: GetStaticPaths = () =>
  getProductItemsWithSlugs({ envId: defaultEnvId })
    .then(products => ({
      paths: products.map(product => ({
        params: {
          slug: product.elements.slug.value,
          envId: defaultEnvId
        }
      })),
      fallback: 'blocking'
    }));

export const getStaticProps: GetStaticProps<Props, IParams> = async (context) => {
  const slug = context.params?.slug;

  if (!slug) {
    return { notFound: true };
  }

  const envId = getEnvIdFromRouteParams(context.params?.envId);

  const previewApiKey = getPreviewApiKeyFromPreviewData(context.previewData);

  const product = await getProductDetail({ envId, previewApiKey }, slug, !!context.preview);
  const siteMenu = await getSiteMenu({ envId, previewApiKey }, !!context.preview);
  const defaultMetadata = await getDefaultMetadata({ envId, previewApiKey }, !!context.preview);

  if (!product) {
    return { notFound: true };
  }

  return {
    props: {
      product,
      siteMenu,
      defaultMetadata
    }
  };
};

const widthLimit = 300;

const ProductDetail: FC<Props> = ({ product, siteMenu, defaultMetadata }) => (
  <AppPage
    item={product}
    siteMenu={siteMenu}
    defaultMetadata={defaultMetadata}
    pageType="Product"
  >
    <div className="bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row -mx-4">
          <div className="lg:flex-1 px-4 ">
            <div className="h-64 lg:h-80 rounded-lg bg-gray-100 mb-4">
              <div
                className="h-64 lg:h-80 rounded-lg bg-gray-100 mb-4 flex items-center justify-center"
              >
                {
                  product.elements.productBaseMainImage.value[0]
                    ? (
                      <Image
                        src={product.elements.productBaseMainImage.value[0].url}
                        alt={product.elements.productBaseMainImage.value[0].description || product.elements.productBaseMainImage.value[0].url.split('/').pop() || "Product image"}
                        width={widthLimit}
                        height={product.elements.productBaseMainImage.value[0].height || 200}
                        className="object-cover"
                        priority
                        {...createElementSmartLink(contentTypes.product.elements.product_base__main_image.codename)}
                      />
                    )
                    : <span>N/A</span>
                }
              </div>
            </div>
          </div>
          <div className="lg:flex-1 px-4">
            <h1
              className="mb-2 leading-tight tracking-tight font-bold text-gray-800 text-2xl lg:text-3xl"
              {...createElementSmartLink(contentTypes.product.elements.product_base__name.codename)}
            >
              {product.elements.productBaseName.value}
            </h1>

            <div
              className="flex items-center space-x-4 my-4"
              {...createElementSmartLink(contentTypes.product.elements.price.codename)}
            >
              <div>
                <div className={`rounded-lg bg-gray-100 flex ${mainColorTextClass[siteCodename]} py-2 px-3`}>
                  <span className=" mr-1 mt-1">EUR</span>
                  <span className="font-bold text-3xl">{product.elements.price.value}</span>
                </div>
              </div>
            </div>

            <p
              className="text-gray-500"
              {...createElementSmartLink(contentTypes.product.elements.product_base__description.codename)}
            >
              {product.elements.productBaseDescription.value}

            </p>

            <div className="flex py-4 space-x-4">
              <button
                type="button"
                className={`${mainColorHoverClass[siteCodename]} ${mainColorButtonClass[siteCodename]} bottom-0 left-0 text-white font-bold mt-10 py-2 px-4 rounded`}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div >
    </div >
  </AppPage >
);

export default ProductDetail;
