import { FC, ReactNode } from "react";
import { Footer } from "./footer";
import { Menu } from "./menu";

type MenuItem = Readonly<{
  title: string;
  url: string;
}>;

type Props = Readonly<{
  menuItems: ReadonlyArray<MenuItem>;
  children: ReactNode;
}>;

export const AppPage: FC<Props> = props => (
  <div className="h-full flex flex-col items-center">
    <Menu links={props.menuItems} />
    <main className="px-10 py-5 container grow">
      {props.children}
    </main>
    <Footer />
  </div>
);

AppPage.displayName = "Page";
