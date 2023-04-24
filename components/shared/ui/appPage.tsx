import { FC, ReactNode } from "react";
import { Footer } from "./footer";
import { Menu } from "./menu";
import { useSmartLink } from "../../../lib/useSmartLink";

type MenuItem = Readonly<{
  title: string;
  url: string;
}>;

type Props = Readonly<{
  menuItems: ReadonlyArray<MenuItem>;
  children: ReactNode;
  itemId?: string;
}>;

export const AppPage: FC<Props> = props => {
  useSmartLink({
    defaultDataAttributes: {
      projectId: "5e23f9dd-ef3a-00fb-1a3e-631a7be899bc",
      languageCodename: "en-US",
    }
  });
  return (
    <div className="h-full flex flex-col items-center">
      <Menu links={props.menuItems} />
      <main 
        className="px-10 py-5 container grow"
        data-kontent-item-id={props.itemId}
      >
        {props.children}
      </main>
      <Footer />
    </div>
  );
};

AppPage.displayName = "Page";
