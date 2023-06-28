import { ComponentType, FC } from "react";

import { Block_CallToAction, Block_Carousel, Block_ContentChunk, Block_Grid, Block_HeroUnit, Block_Stack, Block_Testimonial, contentTypes } from "../../models";
import { CallToActionComponent } from "./CallToAction";
import { CarouselComponent } from "./Carousel";
import { GridComponent } from "./Grid";
import { HeroUnitComponent } from "./HeroUnit";
import { RichTextContentComponent } from "./RichTextContent";
import { StackComponent } from "./Stack";
import { TestimonialComponent } from "./Testimonial";

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
  carousel: CarouselComponent,
  call_to_action: CallToActionComponent,
  stack: StackComponent,
  grid: GridComponent
};

// Unfortunately, we need to define the relationship manually, because the generator doesn't define it itself. :/
type AcceptedTypesByCodename = {
  [contentTypes.hero_unit.codename]: Block_HeroUnit;
  [contentTypes.content_chunk.codename]: Block_ContentChunk;
  [contentTypes.testimonial.codename]: Block_Testimonial;
  [contentTypes.carousel.codename]: Block_Carousel;
  [contentTypes.call_to_action.codename]: Block_CallToAction;
  [contentTypes.stack.codename]: Block_Stack;
  [contentTypes.grid.codename]: Block_Grid;
};

