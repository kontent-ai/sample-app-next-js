import { ComponentType, FC } from "react";
import { Block_CallToAction, Block_Stack, Block_Carousel, Block_HeroUnit, Block_ContentChunk, Block_Testimonial, contentTypes, Block_Grid } from "../../models";
import { HeroUnitComponent } from "./HeroUnit";
import { RichTextContentComponent } from "./RichTextContent";
import { TestimonialComponent } from "./Testimonial";
import { CarouselComponent } from "./Carousel";
import { CallToActionComponent } from "./CallToAction";
import { StackComponent } from "./Stack";
import { GridComponent } from "./Grid";

type AcceptedType = AcceptedTypesByCodename[keyof AcceptedTypesByCodename];

type Props = Readonly<{
  item: AcceptedType;
}>;

export const Content: FC<Props> = props => {
  const TargetComponent = componentMap[props.item.system.type as keyof AcceptedTypesByCodename];
  if (!TargetComponent) {
    return null;
  }

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

