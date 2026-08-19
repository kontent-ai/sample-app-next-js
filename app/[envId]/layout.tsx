import { cookies, draftMode } from "next/headers";
import { SiteChrome } from "../../components/shared/ui/siteChrome.tsx";
import { previewApiKeyCookieName } from "../../lib/constants/cookies.ts";
import { getSiteMenu } from "../../lib/kontentClient.ts";
import { parseFlatted, stringifyAsType } from "../../lib/utils/circularityUtils.ts";
import { defaultEnvId } from "../../lib/utils/env.ts";

const PageLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ envId: string }>;
}) => {
  const draft = await draftMode();
  const previewApiKey = draft.isEnabled
    ? (await cookies()).get(previewApiKeyCookieName)?.value
    : undefined;
  const { envId } = await params;
  const siteMenuData = await getSiteMenu({ envId, previewApiKey }, draft.isEnabled);
  const siteMenu = siteMenuData ? parseFlatted(stringifyAsType(siteMenuData)) : null;

  return <SiteChrome item={siteMenu}>{children}</SiteChrome>;
};

export const generateStaticParams = () => [{ envId: defaultEnvId }];
export const revalidate = 60;

export default PageLayout;
