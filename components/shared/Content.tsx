import { ComponentType, FC } from "react";

import { Block_ContentChunk, Block_VisualContainer } from "../../models";
import { ContentChunk as ContentChunk } from "./ContentChunk";
import { VisualContainer } from "./visualContainer/VisualContainer";
import { contentTypes } from "../../models/environment";

type AcceptedType = AcceptedTypesByCodename[keyof AcceptedTypesByCodename];

type Props = Readonly<{
  item: AcceptedType;
  index: number;
}>;

const isSupportedComponentType = (type: string): type is keyof AcceptedTypesByCodename => (
  Object.keys(componentMap).includes(type)
);

export const Content: FC<Props> = props => {
  const type = props.item.system.type;
  if (!isSupportedComponentType(type)) {
    return null;
  }
  const TargetComponent = componentMap[type];

  return (
    <TargetComponent
      index={props.index}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      item={props.item as any}
    />
);
} 

const componentMap: Readonly<{ [key in keyof AcceptedTypesByCodename]: ComponentType<Readonly<{ item: AcceptedTypesByCodename[key], index: number }>> }> = {
  content_chunk: ContentChunk,
  visual_container: VisualContainer,
};

// Unfortunately, we need to define the relationship manually, because the generator doesn't define it itself. :/
type AcceptedTypesByCodename = {
  [contentTypes.content_chunk.codename]: Block_ContentChunk;
  [contentTypes.visual_container.codename]: Block_VisualContainer;
};

