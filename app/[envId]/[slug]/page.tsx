import type { Metadata } from "next";
import { cookies, draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Content } from "../../../components/shared/Content.tsx";
import { AppPage } from "../../../components/shared/ui/appPage.tsx";
import { previewApiKeyCookieName } from "../../../lib/constants/cookies.ts";
import { getDefaultMetadata, getItemBySlug, getPagesSlugs } from "../../../lib/kontentClient.ts";
import { reservedListingSlugs } from "../../../lib/routing.ts";
import { parseFlatted, stringifyAsType } from "../../../lib/utils/circularityUtils.ts";
import { defaultEnvId } from "../../../lib/utils/env.ts";
import {
  createElementSmartLink,
  createFixedAddSmartLink,
} from "../../../lib/utils/smartLinkUtils.ts";
import type { LP_Page } from "../../../models/content-types/index.ts";
import { contentTypes } from "../../../models/environment/index.ts";

const TopLevelPage = async ({ params }: { params: Promise<{ envId: string; slug: string }> }) => {
  const envId = (await params).envId;
  const slug = (await params).slug;

  const draft = await draftMode();
  const previewApiKey = draft.isEnabled
    ? (await cookies()).get(previewApiKeyCookieName)?.value
    : undefined;

  const pageData = await getItemBySlug<LP_Page>(
    { envId, previewApiKey },
    slug,
    contentTypes.page.codename,
    draft.isEnabled,
  );

  if (pageData === null) {
    notFound();
  }

  const page = parseFlatted(stringifyAsType(pageData));

  return (
    <AppPage item={page}>
      <div
        {...createElementSmartLink(contentTypes.page.elements.content.codename)}
        {...createFixedAddSmartLink("end")}
      >
        {page.elements.content.linkedItems.map((piece, index) => (
          <Content key={piece.system.id} item={piece} index={index} />
        ))}
      </div>
    </AppPage>
  );
};

export const generateStaticParams = async () => {
  const slugsData = await getPagesSlugs({ envId: defaultEnvId });

  const slugs = slugsData
    .filter((item) => item !== reservedListingSlugs.articles)
    .filter((item) => item !== reservedListingSlugs.products);

  return slugs.map((slug) => ({ slug }));
};

export const revalidate = 60;

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ envId: string }>;
}): Promise<Metadata> => {
  const envId = (await params).envId;

  const draft = await draftMode();
  const previewApiKey = draft.isEnabled
    ? (await cookies()).get(previewApiKeyCookieName)?.value
    : undefined;

  const defaultMetadata = await getDefaultMetadata({ envId, previewApiKey }, draft.isEnabled);

  if (!defaultMetadata) {
    console.log("generateMetadata: [envId]/[slug]: Could not obtain defaultMetadata");
    return {};
  }

  return {
    description: defaultMetadata.elements.metadata__description.value,
    keywords: defaultMetadata.elements.metadata__keywords.value,
    title: defaultMetadata.elements.metadata__title.value,
  };
};

export default TopLevelPage;
