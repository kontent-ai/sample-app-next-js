import type { ComponentType, FC } from "react";
import { contentTypes } from "../../models/environment/index.ts";
import type { Block_ContentChunk, Block_VisualContainer } from "../../models/index.ts";
import { ContentChunk } from "./ContentChunk.tsx";
import { VisualContainer } from "./visualContainer/VisualContainer.tsx";

type AcceptedType = AcceptedTypesByCodename[keyof AcceptedTypesByCodename];

type Props = Readonly<{
  item: AcceptedType;
  index: number;
}>;

const isSupportedComponentType = (type: string): type is keyof AcceptedTypesByCodename =>
  Object.keys(componentMap).includes(type);

export const Content: FC<Props> = (props) => {
  const type = props.item.system.type;
  if (!isSupportedComponentType(type)) {
    return null;
  }
  const TargetComponent = componentMap[type];

  return <TargetComponent index={props.index} item={props.item as never} />;
};

const componentMap: Readonly<{
  [key in keyof AcceptedTypesByCodename]: ComponentType<
    Readonly<{ item: AcceptedTypesByCodename[key]; index: number }>
  >;
}> = {
  content_chunk: ContentChunk,
  visual_container: VisualContainer,
};

// Unfortunately, we need to define the relationship manually, because the generator doesn't define it itself. :/
type AcceptedTypesByCodename = {
  [contentTypes.content_chunk.codename]: Block_ContentChunk;
  [contentTypes.visual_container.codename]: Block_VisualContainer;
};
