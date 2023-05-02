import { FC, ReactNode } from "react";
import { Footer } from "./footer";
import { Menu } from "./menu";
import { useSmartLink } from "../../../lib/useSmartLink";
import { defaultMenu } from "../../../lib/constants/menu";

type Props = Readonly<{
  children: ReactNode;
  itemId?: string;
}>;

export const AppPage: FC<Props> = props => {
  useSmartLink();
  return (
    <div className="grow flex flex-col items-center">
      <Menu links={defaultMenu} />
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
