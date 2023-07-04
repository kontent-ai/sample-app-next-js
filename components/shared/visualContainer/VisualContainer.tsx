import { FC } from "react";

import { Block_HeroUnit, Block_VisualContainer, contentTypes,Fact, Milestone } from "../../../models"
import { CarouselComponent } from "./Carousel";
import { GridComponent } from "./Grid";
import { StackComponent } from "./Stack";

type Props = Readonly<{
  item: Block_VisualContainer;
}>;

export const VisualContainer: FC<Props> = props => {
  switch (props.item.elements.visualRepresentation.value[0]?.codename) {
    case visualRepresentation.grid:
      return (
        <GridComponent
          items={props.item.elements.items.linkedItems.filter(isMilestone)}
        />
      );
    case visualRepresentation.stack:
      return (
        <StackComponent
          items={props.item.elements.items.linkedItems.filter(isFact)}
          subtitle={props.item.elements.subtitle.value}
          title={props.item.elements.title.value}
          itemId={props.item.system.id}
        />
      );
    case visualRepresentation.carousel:
      return (
        <CarouselComponent
          items={props.item.elements.items.linkedItems.filter(isHeroUnit)}
        />
      )
    default:
      throw new Error(`Unsupported visual container item type ${props.item.elements.visualRepresentation.value[0]?.codename}`)
  }
};

const visualRepresentation = {
  grid: "grid",
  carousel: "carousel",
  stack: "stack",
} as const;

type VisualContainerItem = Fact | Milestone | Block_HeroUnit;

const isMilestone = (item: VisualContainerItem): item is Milestone =>
  item.system.type === contentTypes.milestone.codename;

const isFact = (item: VisualContainerItem): item is Fact =>
  item.system.type === contentTypes.fact.codename;

const isHeroUnit = (item: VisualContainerItem): item is Block_HeroUnit =>
  item.system.type === contentTypes.hero_unit.codename;
