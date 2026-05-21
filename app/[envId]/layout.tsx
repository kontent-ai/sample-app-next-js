import { cookies, draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Footer } from "../../components/shared/ui/footer.tsx";
import { Menu } from "../../components/shared/ui/menu.tsx";
import { previewApiKeyCookieName } from "../../lib/constants/cookies.ts";
import { getSiteMenu } from "../../lib/kontentClient.ts";
import { parseFlatted, stringifyAsType } from "../../lib/utils/circularityUtils.ts";
import { defaultEnvId, siteCodename } from "../../lib/utils/env.ts";

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

  if (!siteMenuData) {
    return notFound();
  }

  const siteMenu = parseFlatted(stringifyAsType(siteMenuData));

  return (
    <div
      className="min-h-full flex flex-col items-center overflow-hidden"
      data-theme={siteCodename}
    >
      <Menu item={siteMenu} />
      {/* https://tailwindcss.com/docs/typography-plugin */}
      <main className="grow">{children}</main>
      <Footer />
    </div>
  );
};

export const generateStaticParams = () => [{ envId: defaultEnvId }];
export const revalidate = 60;

export default PageLayout;
