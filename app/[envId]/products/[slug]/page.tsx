import Image from "next/image";

import { getDefaultMetadata, getProductDetail, getProductItemsWithSlugs } from "../../../../lib/kontentClient";
import { defaultEnvId } from "../../../../lib/utils/env";
import { createElementSmartLink } from "../../../../lib/utils/smartLinkUtils";
import { previewApiKeyCookieName } from "../../../../lib/constants/cookies";
import { cookies, draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { AppPage } from "../../../../components/shared/ui/appPage";
import { Metadata } from "next";
import { contentTypes } from "../../../../models/environment";

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
        <div className="max-w-7xl mt-20 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row">
          <figure className="lg:flex-1 rounded-lg flex items-center justify-center not-prose">
              {
                product.elements.product_base__main_image.value[0]
                  ? (
                    <Image
                      src={product.elements.product_base__main_image.value[0].url}
                      alt={product.elements.product_base__main_image.value[0].description || product.elements.product_base__main_image.value[0].url.split('/').pop() || "Product image"}
                      width={widthLimit}
                      height={product.elements.product_base__main_image.value[0].height || 200}
                      className="object-cover"
                      priority
                      {...createElementSmartLink(contentTypes.product.elements.product_base__main_image.codename)}
                    />
                  )
                  : <span>N/A</span>
              }
            </figure>
            <div className="lg:flex-2 px-4 flex flex-col gap-0">
              <h1
                className="leading-tight tracking-tight font-bold text-gray-800 text-2xl lg:text-3xl"
                {...createElementSmartLink(contentTypes.product.elements.product_base__name.codename)}
              >
                {product.elements.product_base__name.value}
              </h1>

              <div
                className="flex items-center space-x-4"
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
                {product.elements.product_base__description.value}

              </p>

                <button
                  type="button"
                  className="hover:bg-mainHoverColor bg-mainButtonColor text-white font-bold py-2 px-4 rounded"
                >
                  Add to Cart
                </button>
            </div>
          </div>
    </AppPage >
)};

export const generateStaticParams = () =>
  getProductItemsWithSlugs({ envId: defaultEnvId })
    .then(products => products
      .map(product => ({slug: product.elements.slug.value})
    ));

export const revalidate = 60;

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
    description: defaultMetadata.elements.metadata__description.value,
    keywords: defaultMetadata.elements.metadata__keywords.value,
    title: defaultMetadata.elements.metadata__keywords.value 
  }
}

export default ProductDetail;
