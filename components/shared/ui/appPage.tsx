import { FC, ReactNode } from "react";
import { Footer } from "./footer";
import { Menu } from "./menu";
import { useSmartLink } from "../../../lib/useSmartLink";
import { createDefaultMenu } from "../../../lib/constants/menu";
import { ValidCollectionCodename } from "../../../lib/types/perCollection";
import { SiteCodenameProvider } from "../siteCodenameContext";
import { createItemSmartLink } from "../../../lib/utils/smartLinkUtils";

type Props = Readonly<{
  children: ReactNode;
  siteCodename: ValidCollectionCodename;
  itemId?: string;
}>;

export const AppPage: FC<Props> = props => {
  useSmartLink();
  return (
    <SiteCodenameProvider siteCodename={props.siteCodename}>
      <div className="min-h-full grow flex flex-col items-center overflow-hidden">
        <Menu links={createDefaultMenu(props.siteCodename)} />
        {/* https://tailwindcss.com/docs/typography-plugin */}
        <main
          className="py-5 container grow h-full"
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
