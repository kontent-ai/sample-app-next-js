import { Footer } from "../../components/shared/ui/footer";
import { Menu } from "../../components/shared/ui/menu";
import { previewApiKeyCookieName } from "../../lib/constants/cookies";
import { getSiteMenu } from "../../lib/kontentClient";
import { cookies, draftMode } from 'next/headers';
import { stringifyAsType, parseFlatted } from '../../lib/utils/circularityUtils';
import { notFound } from "next/navigation";

const PageLayout = async ({children, params}: {children: React.ReactNode, params: Promise<{envId: string}>}) => {
  const draft = await draftMode();
  const previewApiKey = draft.isEnabled ? (await cookies()).get(previewApiKeyCookieName)?.value : undefined;
  const { envId } = await params;
  console.log(envId);
  const siteMenuData = await getSiteMenu({ envId, previewApiKey }, draft.isEnabled);

  if(!siteMenuData){
    return notFound();
  }

  const siteMenu = parseFlatted(stringifyAsType(siteMenuData));

  return (
    <div className="min-h-full grow flex flex-col items-center overflow-hidden">
      <Menu item={siteMenu} />
      {/* https://tailwindcss.com/docs/typography-plugin */}
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default PageLayout;