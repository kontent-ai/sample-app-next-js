import { ComponentType, FC } from "react";
import { CallToAction, CardStack, Carousel, HeroUnit, RichTextContent, Testimonial, contentTypes } from "../../models";
import { HeroUnitComponent } from "./HeroUnit";
import { RichTextContentComponent } from "./RichTextContent";
import { TestimonialComponent } from "./Testimonial";
import { CarouselComponent } from "./Carousel";
import { CallToActionComponent } from "./CallToAction";
import { CardStackComponent } from "./CardStack";

type AcceptedType = AcceptedTypesByCodename[keyof AcceptedTypesByCodename];

type Props = Readonly<{
  item: AcceptedType;
}>;

export const Content: FC<Props> = props => {
  const TargetComponent = componentMap[props.item.system.type as keyof AcceptedTypesByCodename];
  if (!TargetComponent) {
    // throw new Error(`Cannot render a content item with codename: ${props.item.system.codename}`);
    return null;
  }

  return <TargetComponent item={props.item as any} />;
}

const componentMap: Readonly<{ [key in keyof AcceptedTypesByCodename]: ComponentType<Readonly<{ item: AcceptedTypesByCodename[key] }>> }> = {
  component___hero_unit: HeroUnitComponent,
  component___rich_text_content: RichTextContentComponent,
  testimonial: TestimonialComponent,
  carousel: CarouselComponent,
  call_to_action: CallToActionComponent,
  card_stack: CardStackComponent,
};

// Unfortunately, we need to define the relationship manually, because the generator doesn't define it itself. :/
type AcceptedTypesByCodename = {
  [contentTypes.component___hero_unit.codename]: HeroUnit;
  [contentTypes.component___rich_text_content.codename]: RichTextContent;
  [contentTypes.testimonial.codename]: Testimonial;
  [contentTypes.carousel.codename]: Carousel;
  [contentTypes.call_to_action.codename]: CallToAction;
  [contentTypes.card_stack.codename]: CardStack;
};

