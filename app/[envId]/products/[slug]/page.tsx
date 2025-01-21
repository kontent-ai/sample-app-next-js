import Image from "next/image";

import { getDefaultMetadata, getProductDetail, getProductItemsWithSlugs } from "../../../../lib/kontentClient";
import { defaultEnvId } from "../../../../lib/utils/env";
import { createElementSmartLink } from "../../../../lib/utils/smartLinkUtils";
import { contentTypes } from "../../../../models";
import { previewApiKeyCookieName } from "../../../../lib/constants/cookies";
import { cookies, draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { AppPage } from "../../../../components/shared/ui/newAppPage";
import { Metadata } from "next";

const widthLimit = 300;

const ProductDetail = async ({params}: {params: Promise<{envId: string, slug: string}>}) => {
  const slug = (await params).slug;
  const envId = (await params).envId;

  const draft = await draftMode();
  const previewApiKey = draft.isEnabled ? (await cookies()).get(previewApiKeyCookieName)?.value : undefined;

  const product = await getProductDetail({ envId, previewApiKey }, slug, draft.isEnabled);

  if (!product) {
    return notFound();
  }

  return ( 
    <AppPage item={product} >
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
                  <div className="rounded-lg bg-gray-100 flex text-mainTextColor py-2 px-3">
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
                  className="hover:bg-mainHoverColor bg-mainButtonColor bottom-0 left-0 text-white font-bold mt-10 py-2 px-4 rounded"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div >
      </div >
    </AppPage >
)};

export const dynamicParams = true;

export const generateStaticParams = () =>
  getProductItemsWithSlugs({ envId: defaultEnvId })
    .then(products => products
      .map(product => (
        {
          slug: product.elements.slug.value,
          envId: defaultEnvId
        })
      ));

export const generateMetadata = async ({ params }: { params: Promise<{ envId: string }> }): Promise<Metadata> => {
  const envId = (await params).envId;

  const draft = await draftMode();
  const previewApiKey = draft.isEnabled ? (await cookies()).get(previewApiKeyCookieName)?.value : undefined;

  const defaultMetadata = await getDefaultMetadata({ envId, previewApiKey }, draft.isEnabled);

  if (!defaultMetadata) {
    console.log("generateMetadata: [envId]/products/[slug]: Could not obtain defaultMetadata");
    return {};
  }

  return {
    description: defaultMetadata.elements.metadataDescription.value,
    keywords: defaultMetadata.elements.metadataKeywords.value,
    title: defaultMetadata.elements.metadataTitle.value 
  }
}

export default ProductDetail;
