import { IContentItem } from "@kontent-ai/delivery-sdk";
import { ComponentType, FC, ReactNode } from "react";

import { Block_ContentChunk, Component_Callout, contentTypes } from "../../../models";
import { CalloutComponent } from "./Callout";

type AcceptedType = AcceptedTypesByCodename[keyof AcceptedTypesByCodename];

type Props = Readonly<{
  item: AcceptedType;
  renderRichText: (item: Block_ContentChunk) => ReactNode;
}>;


const isSupportedComponentType = (type: string): type is keyof AcceptedTypesByCodename => (
  Object.keys(componentMap).includes(type)
);

export const RichTextComponent: FC<Props> = props => {
  const type = props.item.system.type;
  if (!isSupportedComponentType(type)) {
    return null;
  }
  const TargetComponent = componentMap[type as keyof AcceptedTypesByCodename];
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
  [contentTypes.callout.codename]: Component_Callout;
  [contentTypes.content_chunk.codename]: Block_ContentChunk;
};

export const isAcceptedComponentItem = (item: IContentItem): item is AcceptedType =>
  Object.keys(componentMap).includes(item.system.type);

