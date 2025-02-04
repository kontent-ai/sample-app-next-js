import { Content } from "../../../components/shared/Content";
import { getDefaultMetadata, getItemBySlug } from "../../../lib/kontentClient";
import { reservedListingSlugs } from "../../../lib/routing";
import { parseFlatted, stringifyAsType } from "../../../lib/utils/circularityUtils";
import { contentTypes, WSL_Page } from "../../../models";
import { notFound } from "next/navigation";
import { AppPage } from "../../../components/shared/ui/newAppPage";
import { cookies, draftMode } from "next/headers";
import { previewApiKeyCookieName } from "../../../lib/constants/cookies";
import ProductsListing from "../../../components/products/ProductsListing";
import { Metadata } from "next";
import { Suspense } from "react";

const ProductsPage = async ({params}: {params: Promise<{envId: string}>}) => {
  const envId = (await params).envId;

  const draft = await draftMode();
  const previewApiKey = draft.isEnabled ? (await cookies()).get(previewApiKeyCookieName)?.value : undefined;

  // We might want to bound listing pages to something else than URL slug
  const pageData = await getItemBySlug<WSL_Page>({ envId: envId, previewApiKey: previewApiKey }, reservedListingSlugs.products, contentTypes.page.codename, draft.isEnabled);

  if (pageData === null) {
    return notFound();
  }

  const productsPage = parseFlatted(stringifyAsType(pageData));
  
  return (
    <AppPage
      item={productsPage}
    >
      {productsPage.elements.content.linkedItems.map((piece, index) => (
        <Content
          key={piece.system.id}
          item={piece}
          index={index}
        />
      ))}

      {/* Suspense needed for useSearchParams  https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout*/}
      <Suspense>
        <ProductsListing />
      </Suspense>
    </AppPage>
  )
};

export const generateMetadata = async ({ params }: { params: Promise<{ envId: string }> }): Promise<Metadata> => {
  const envId = (await params).envId;

  const draft = await draftMode();
  const previewApiKey = draft.isEnabled ? (await cookies()).get(previewApiKeyCookieName)?.value : undefined;

  const defaultMetadata = await getDefaultMetadata({ envId, previewApiKey }, draft.isEnabled);

  if (!defaultMetadata) {
    console.log("generateMetadata: [envId]/products: Could not obtain defaultMetadata");
    return {};
  }

  return {
    description: defaultMetadata.elements.metadata__description.value,
    keywords: defaultMetadata.elements.metadata__keywords.value,
    title: defaultMetadata.elements.metadata__title.value 
  }
}

export default ProductsPage;
