import { ComponentType, FC, ReactNode } from "react";
import { Block_Callout, Block_ContentChunk, contentTypes } from "../../../models";
import { CalloutComponent } from "./Callout";
import { IContentItem } from "@kontent-ai/delivery-sdk";

type AcceptedType = AcceptedTypesByCodename[keyof AcceptedTypesByCodename];

type Props = Readonly<{
  item: AcceptedType;
  renderRichText: (item: Block_ContentChunk) => ReactNode;
}>;

export const RichTextComponent: FC<Props> = props => {
  const TargetComponent = componentMap[props.item.system.type as keyof AcceptedTypesByCodename];
  if (!TargetComponent) {
    return null;
  }
  if (props.item.system.type === contentTypes.content_chunk.codename) {
    return <>{props.renderRichText(props.item)}</>;
  }

  return <TargetComponent item={props.item as any} />;
}

const componentMap: Readonly<{ [key in keyof AcceptedTypesByCodename]: ComponentType<Readonly<{ item: AcceptedTypesByCodename[key] }>> }> = {
  callout: CalloutComponent,
  content_chunk: () => null,
};

// Unfortunately, we need to define the relationship manually, because the generator doesn't define it itself. :/
type AcceptedTypesByCodename = {
  [contentTypes.callout.codename]: Block_Callout;
  [contentTypes.content_chunk.codename]: Block_ContentChunk;
};

export const isAcceptedComponentItem = (item: IContentItem): item is AcceptedType =>
  Object.keys(componentMap).includes(item.system.type);

