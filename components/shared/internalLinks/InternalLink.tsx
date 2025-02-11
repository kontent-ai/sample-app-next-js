import { ILink } from "@kontent-ai/delivery-sdk"
import { FC, ReactNode } from "react";

import { ProductLink } from "./ProductLink";
import { contentTypes } from "../../../models/environment";

type Props = Readonly<{
  link: ILink;
  children: ReactNode;
}>;

export const InternalLink: FC<Props> = props => {
  switch (props.link.type) {
    case contentTypes.product.codename:
      return (
        <ProductLink
          itemCodename={props.link.codename}
          urlSlug={props.link.urlSlug}
        >
          {props.children}
        </ProductLink>
      );
    default:
      throw new Error(`Cannot render an internal link of type ${props.link.type}. Please make sure all types you want to link are supported in the app.`);
  }
}
