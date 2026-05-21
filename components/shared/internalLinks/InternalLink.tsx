import type { ILink } from "@kontent-ai/delivery-sdk";
import type { FC, ReactNode } from "react";
import { contentTypes } from "../../../models/environment/index.ts";
import { ProductLink } from "./ProductLink.tsx";

type Props = Readonly<{
  link: ILink;
  children: ReactNode;
}>;

export const InternalLink: FC<Props> = (props) => {
  switch (props.link.type) {
    case contentTypes.product.codename:
      return (
        <ProductLink itemCodename={props.link.codename} urlSlug={props.link.urlSlug}>
          {props.children}
        </ProductLink>
      );
    default:
      throw new Error(
        `Cannot render an internal link of type ${props.link.type}. Please make sure all types you want to link are supported in the app.`,
      );
  }
};
