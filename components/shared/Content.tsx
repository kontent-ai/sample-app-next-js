import { ComponentType, FC } from "react";

import { Block_ContentChunk, Block_HeroUnit, Block_VisualContainer, contentTypes,Testimonial } from "../../models";
import { HeroUnitComponent } from "./HeroUnit";
import { RichTextContentComponent } from "./RichTextContent";
import { TestimonialComponent } from "./Testimonial";
import { VisualContainer } from "./visualContainer/VisualContainer";

type AcceptedType = AcceptedTypesByCodename[keyof AcceptedTypesByCodename];

type Props = Readonly<{
  item: AcceptedType;
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

  return <TargetComponent item={props.item as any} />;
}

const componentMap: Readonly<{ [key in keyof AcceptedTypesByCodename]: ComponentType<Readonly<{ item: AcceptedTypesByCodename[key] }>> }> = {
  hero_unit: HeroUnitComponent,
  content_chunk: RichTextContentComponent,
  testimonial: TestimonialComponent,
  _visual_container: VisualContainer,
};

// Unfortunately, we need to define the relationship manually, because the generator doesn't define it itself. :/
type AcceptedTypesByCodename = {
  [contentTypes.hero_unit.codename]: Block_HeroUnit;
  [contentTypes.content_chunk.codename]: Block_ContentChunk;
  [contentTypes.testimonial.codename]: Testimonial;
  [contentTypes._visual_container.codename]: Block_VisualContainer;
};

