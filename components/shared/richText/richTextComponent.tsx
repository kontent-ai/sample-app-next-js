import { ComponentType, FC, ReactNode } from "react";
import { Callout, RichTextContent, contentTypes } from "../../../models";
import { CalloutComponent } from "./Callout";
import { IContentItem } from "@kontent-ai/delivery-sdk";

type AcceptedType = AcceptedTypesByCodename[keyof AcceptedTypesByCodename];

type Props = Readonly<{
  item: AcceptedType;
  renderRichText: (item: RichTextContent) => ReactNode;
}>;

export const RichTextComponent: FC<Props> = props => {
  const TargetComponent = componentMap[props.item.system.type as keyof AcceptedTypesByCodename];
  if (!TargetComponent) {
    return null;
  }
  if (props.item.system.type === contentTypes.component___rich_text_content.codename) {
    return <>{props.renderRichText(props.item)}</>;
  }

  return <TargetComponent item={props.item as any} />;
}

const componentMap: Readonly<{ [key in keyof AcceptedTypesByCodename]: ComponentType<Readonly<{ item: AcceptedTypesByCodename[key] }>> }> = {
  callout: CalloutComponent,
  component___rich_text_content: () => null,
};

// Unfortunately, we need to define the relationship manually, because the generator doesn't define it itself. :/
type AcceptedTypesByCodename = {
  [contentTypes.callout.codename]: Callout;
  [contentTypes.component___rich_text_content.codename]: RichTextContent;
};

export const isAcceptedComponentItem = (item: IContentItem): item is AcceptedType =>
  Object.keys(componentMap).includes(item.system.type);

