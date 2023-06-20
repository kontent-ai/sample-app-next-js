import { FC, ReactNode } from "react";
import { Footer } from "./footer";
import { Menu } from "./menu";
import { useSmartLink } from "../../../lib/useSmartLink";
import { ValidCollectionCodename } from "../../../lib/types/perCollection";
import { SiteCodenameProvider } from "../siteCodenameContext";
import { createItemSmartLink } from "../../../lib/utils/smartLinkUtils";
import { Block_Navigation } from "../../../models";
import Head from "next/head";
import { perCollectionSEOTitle } from "../../../lib/constants/labels";

type Props = Readonly<{
  children: ReactNode;
  siteCodename: ValidCollectionCodename;
  itemId?: string;
  siteMenu?: Block_Navigation;
}>;

export const AppPage: FC<Props> = props => {
  useSmartLink();
  return (
    <SiteCodenameProvider siteCodename={props.siteCodename}>
      <Head>
        <title>{perCollectionSEOTitle[props.siteCodename]}</title>
      </Head>
      <div className="min-h-full grow flex flex-col items-center overflow-hidden">
        {props.siteMenu ? <Menu item={props.siteMenu} /> : <span>Missing top navigation. Please provide a valid navigation item in the web spotlight root.</span>}
        {/* https://tailwindcss.com/docs/typography-plugin */}
        <main
          className="py-14 md:py-20 px-4 sm:px-8 max-w-screen-xl grow h-full"
          {...createItemSmartLink(props.itemId, true)}
        >
          <div className="prose w-full max-w-full">
            {props.children}
          </div>
        </main>
        <Footer />
      </div>
    </SiteCodenameProvider>
  );
};

AppPage.displayName = "Page";
