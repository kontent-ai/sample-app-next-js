
import { FC, ReactNode } from "react";
import { createItemSmartLink } from "../../../lib/utils/smartLinkUtils";
import { Article, Product, Solution, LP_Page, LP_WebsiteRoot } from "../../../models/content-types";

type AcceptedItem = LP_WebsiteRoot | Article | Product | LP_Page | Solution;

type Props = Readonly<{
  children: ReactNode;
  item: AcceptedItem;
}>;

export const AppPage: FC<Props> = props => {
  return (
    <div
      className="grow h-full w-screen scroll-smooth"
      {...createItemSmartLink(props.item.system.id, true)}
    >
      <div className="prose w-full max-w-screen-xl mx-auto">
        {props.children}
      </div>
    </div>
  );
};

AppPage.displayName = "Page";
