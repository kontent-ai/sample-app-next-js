import type { Metadata } from "next";
import { cookies, draftMode } from "next/headers";
import { cache } from "react";
import GraniteHomepage from "../../components/graniteView/GraniteHomepage.tsx";
import PreviewGraniteHomepage from "../../components/graniteView/PreviewGraniteHomepage.tsx";
import { previewApiKeyCookieName } from "../../lib/constants/cookies.ts";
import { graniteMetadata } from "../../lib/constants/graniteView.ts";
import { getHomepageNotices } from "../../lib/kontentClient.ts";
import { parseFlatted, stringifyAsType } from "../../lib/utils/circularityUtils.ts";

const getNotices = cache(async (envId: string, previewApiKey?: string) =>
  getHomepageNotices({ envId, previewApiKey }, !!previewApiKey),
);

const Home = async ({ params }: { params: Promise<{ envId: string }> }) => {
  const envId = (await params).envId;
  const draft = await draftMode();
  const previewApiKey = draft.isEnabled
    ? (await cookies()).get(previewApiKeyCookieName)?.value
    : undefined;
  const noticeData = await getNotices(envId, previewApiKey);
  console.log(
    `Homepage notices envId=${envId} count=${noticeData.length} types=${noticeData
      .map((item) => item.system.type)
      .join(",")}`,
  );
  const notices = parseFlatted(stringifyAsType(noticeData));

  const HomepageComponent = draft.isEnabled ? PreviewGraniteHomepage : GraniteHomepage;

  return <HomepageComponent notices={notices} />;
};

export function generateMetadata(): Metadata {
  return {
    description: graniteMetadata.description,
    title: graniteMetadata.title,
  };
}

export default Home;
