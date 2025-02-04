import { Content } from "../../../components/shared/Content";
import { getDefaultMetadata, getItemBySlug, getPagesSlugs } from "../../../lib/kontentClient";
import { reservedListingSlugs } from "../../../lib/routing";
import { parseFlatted, stringifyAsType } from "../../../lib/utils/circularityUtils";
import { defaultEnvId } from "../../../lib/utils/env";
import { createElementSmartLink, createFixedAddSmartLink } from "../../../lib/utils/smartLinkUtils";
import { contentTypes, WSL_Page } from "../../../models";
import { cookies, draftMode } from "next/headers";
import { previewApiKeyCookieName } from "../../../lib/constants/cookies";
import { AppPage } from "../../../components/shared/ui/newAppPage";
import { Metadata } from "next";
import { notFound } from "next/navigation";

const TopLevelPage = async ({params}: { params: Promise<{envId: string, slug: string}> }) => {
  const envId = (await params).envId;
  const slug = (await params).slug;

  const draft = await draftMode();
  const previewApiKey = draft.isEnabled ? (await cookies()).get(previewApiKeyCookieName)?.value : undefined;

  const pageData = await getItemBySlug<WSL_Page>({ envId, previewApiKey }, slug, contentTypes.page.codename, draft.isEnabled);

  if (pageData === null) {
    notFound();
  }

  const page = parseFlatted(stringifyAsType(pageData));
  
  return (
    <AppPage
      item={page}
    >
      <div
        {...createElementSmartLink(contentTypes.page.elements.content.codename)}
        {...createFixedAddSmartLink("end")}
      >
        {page.elements.content.linkedItems.map((piece, index) => (
          <Content
            key={piece.system.id}
            item={piece}
            index={index}
          />
        ))}
      </div>
    </AppPage>
  );
};

export const generateStaticParams = async () => {
  const slugsData = await getPagesSlugs({ envId: defaultEnvId });

  const slugs = slugsData
    .filter(item => item != reservedListingSlugs.articles)
    .filter(item => item != reservedListingSlugs.products);
  
  return slugs.map(slug => ({slug}))
}

export const revalidate = 60;

export const generateMetadata = async ({ params }: { params: Promise<{ envId: string }> }): Promise<Metadata> => {
  const envId = (await params).envId;

  const draft = await draftMode();
  const previewApiKey = draft.isEnabled ? (await cookies()).get(previewApiKeyCookieName)?.value : undefined;

  const defaultMetadata = await getDefaultMetadata({ envId, previewApiKey }, draft.isEnabled);

  if (!defaultMetadata) {
    console.log("generateMetadata: [envId]/[slug]: Could not obtain defaultMetadata");
    return {};
  }

  return {
    description: defaultMetadata.elements.metadata__description.value,
    keywords: defaultMetadata.elements.metadata__keywords.value,
    title: defaultMetadata.elements.metadata__title.value 
  }
}

export default TopLevelPage;
