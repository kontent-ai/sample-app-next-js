import { FC, ReactNode } from "react";
import { Footer } from "./footer";
import { Menu } from "./menu";
import { useSmartLink } from "../../../lib/useSmartLink";
import { createDefaultMenu } from "../../../lib/constants/menu";
import { ValidCollectionCodename } from "../../../lib/types/perCollection";

type Props = Readonly<{
  children: ReactNode;
  siteCodename: ValidCollectionCodename;
  itemId?: string;
}>;

export const AppPage: FC<Props> = props => {
  useSmartLink();
  return (
    <div className="min-h-full grow flex flex-col items-center overflow-hidden">
      <Menu links={createDefaultMenu(props.siteCodename)} />
      {/* https://tailwindcss.com/docs/typography-plugin */}
      <main
        className="prose py-5 container grow h-full"
        data-kontent-item-id={props.itemId}
      >
        {props.children}
      </main>
      <Footer />
    </div>
  );
};

AppPage.displayName = "Page";
