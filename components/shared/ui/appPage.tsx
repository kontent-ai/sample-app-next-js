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
  useSmartLink();
  return (
    <div className="grow flex flex-col items-center">
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
