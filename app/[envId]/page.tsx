import type { Metadata } from "next";
import { cookies, draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { cache } from "react";
import Homepage from "../../components/landingPage/ui/homepage.tsx";
import PreviewHomepage from "../../components/landingPage/ui/previewHomepage.tsx";
import { AppPage } from "../../components/shared/ui/appPage.tsx";
import { previewApiKeyCookieName } from "../../lib/constants/cookies.ts";
import { getHomepage } from "../../lib/kontentClient.ts";
import { parseFlatted, stringifyAsType } from "../../lib/utils/circularityUtils.ts";

const getHomepageData = cache(async (envId: string, previewApiKey?: string) =>
  getHomepage({ envId, previewApiKey }, !!previewApiKey),
);

const Home = async ({ params }: { params: Promise<{ envId: string }> }) => {
  const envId = (await params).envId;
  const draft = await draftMode();
  const previewApiKey = draft.isEnabled
    ? (await cookies()).get(previewApiKeyCookieName)?.value
    : undefined;
  const homepageData = await getHomepageData(envId, previewApiKey);

  if (!homepageData) {
    return notFound();
  }

  const homepage = parseFlatted(stringifyAsType(homepageData));

  const HomepageComponent = draft.isEnabled ? PreviewHomepage : Homepage;

  return (
    <AppPage item={homepageData}>
      <HomepageComponent homepageData={homepage} />
    </AppPage>
  );
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ envId: string }>;
}): Promise<Metadata> {
  const envId = (await params).envId;

  const draft = await draftMode();
  const previewApiKey = draft.isEnabled
    ? (await cookies()).get(previewApiKeyCookieName)?.value
    : undefined;
  const homepageData = await getHomepageData(envId, previewApiKey);

  if (!homepageData) {
    console.log("generateMetadata: homepage: Could not obtain homepageData");
    return {};
  }

  return {
    description: homepageData.elements.metadata__description.value,
    keywords: homepageData.elements.metadata__keywords.value,
    title: homepageData.elements.metadata__title.value,
  };
}

export default Home;
