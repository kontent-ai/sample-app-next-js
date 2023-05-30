import { ComponentType, FC } from "react";
import { UMLPComponent_CallToAction, UMLPComponent_CardStack, UMLPComponent_Carousel, UMLPComponent_HeroUnit, UMLPComponent_RichTextContent, Testimonial, UMLPComponent_Milestones, contentTypes } from "../../models";
import { HeroUnitComponent } from "./HeroUnit";
import { RichTextContentComponent } from "./RichTextContent";
import { TestimonialComponent } from "./Testimonial";
import { CarouselComponent } from "./Carousel";
import { CallToActionComponent } from "./CallToAction";
import { CardStackComponent } from "./CardStack";
import { MilestonesComponent } from "./Milestones";

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
  component___hero_unit: HeroUnitComponent,
  component___rich_text_content: RichTextContentComponent,
  testimonial: TestimonialComponent,
  carousel: CarouselComponent,
  call_to_action: CallToActionComponent,
  card_stack: CardStackComponent,
  umlp_component___milestones: MilestonesComponent
};

// Unfortunately, we need to define the relationship manually, because the generator doesn't define it itself. :/
type AcceptedTypesByCodename = {
  [contentTypes.component___hero_unit.codename]: UMLPComponent_HeroUnit;
  [contentTypes.component___rich_text_content.codename]: UMLPComponent_RichTextContent;
  [contentTypes.testimonial.codename]: Testimonial;
  [contentTypes.carousel.codename]: UMLPComponent_Carousel;
  [contentTypes.call_to_action.codename]: UMLPComponent_CallToAction;
  [contentTypes.card_stack.codename]: UMLPComponent_CardStack;
  [contentTypes.umlp_component___milestones.codename]: UMLPComponent_Milestones;
};

