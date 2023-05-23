import { ComponentType, FC } from "react";
import { Callout, contentTypes } from "../../../models";
import { CalloutComponent } from "./Callout";
import { IContentItem } from "@kontent-ai/delivery-sdk";

type AcceptedType = AcceptedTypesByCodename[keyof AcceptedTypesByCodename];

type Props = Readonly<{
  item: AcceptedType;
}>;

export const RichTextComponent: FC<Props> = props => {
  const TargetComponent = componentMap[props.item.system.type as keyof AcceptedTypesByCodename];
  if (!TargetComponent) {
    // throw new Error(`Cannot render a content item with codename: ${props.item.system.codename}`);
    return null;
  }

  return <TargetComponent item={props.item as any} />;
}

const componentMap: Readonly<{ [key in keyof AcceptedTypesByCodename]: ComponentType<Readonly<{ item: AcceptedTypesByCodename[key] }>> }> = {
  callout: CalloutComponent,
};

// Unfortunately, we need to define the relationship manually, because the generator doesn't define it itself. :/
type AcceptedTypesByCodename = {
  [contentTypes.callout.codename]: Callout;
};

export const isAcceptedComponentItem = (item: IContentItem): item is AcceptedType =>
  Object.keys(componentMap).includes(item.system.type);

