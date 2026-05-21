import type { FC, ReactNode } from "react";
import { createItemSmartLink } from "../../../lib/utils/smartLinkUtils.ts";
import type {
  Article,
  LP_Page,
  LP_WebsiteRoot,
  Product,
  Solution,
} from "../../../models/content-types/index.ts";

type AcceptedItem = LP_WebsiteRoot | Article | Product | LP_Page | Solution;

type Props = Readonly<{
  children: ReactNode;
  item: AcceptedItem;
}>;

export const AppPage: FC<Props> = (props) => {
  return (
    <div
      className="grow h-full w-screen scroll-smooth"
      {...createItemSmartLink(props.item.system.id, true)}
    >
      <div className="prose w-full max-w-screen-xl mx-auto">{props.children}</div>
    </div>
  );
};

AppPage.displayName = "Page";
