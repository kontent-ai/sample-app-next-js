import { FC } from "react";

import { Block_HeroUnit, Block_VisualContainer, contentTypes, Fact } from "../../../models"
import { BuildError } from "../ui/BuildError";
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
        <>
          {!props.item.elements.items.linkedItems.every(isFact) && <BuildError>Grid representation can only have Fact items. Some items are of a wrong type.</BuildError>}
          <GridComponent
            items={props.item.elements.items.linkedItems.filter(isFact)}
          />
        </>
      );
    case visualRepresentation.stack:
      return (
        <>
          {!props.item.elements.items.linkedItems.every(isFact) && <BuildError>Stack representation can only have Fact items. Some items are of a wrong type.</BuildError>}
          <StackComponent
            items={props.item.elements.items.linkedItems.filter(isFact)}
            subtitle={props.item.elements.subtitle.value}
            title={props.item.elements.title.value}
            itemId={props.item.system.id}
          />
        </>
      );
    case visualRepresentation.carousel:
      return (
        <>
          {!props.item.elements.items.linkedItems.every(isHeroUnit) && <BuildError>Carousel representation can only have Hero Unit items. Some items are of a wrong type.</BuildError>}
          <CarouselComponent
            items={props.item.elements.items.linkedItems.filter(isHeroUnit)}
          />
        </>
      )
    default:
      return (
        <BuildError>Visual representation &quot;{props.item.elements.visualRepresentation.value[0]?.name ?? "Missing representation"}&quot; is not supported.</BuildError>
      );
  }
};

const visualRepresentation = {
  grid: "grid",
  carousel: "carousel",
  stack: "stack",
} as const;

type VisualContainerItem = Fact | Block_HeroUnit;

const isFact = (item: VisualContainerItem): item is Fact =>
  item.system.type === contentTypes.fact.codename;

const isHeroUnit = (item: VisualContainerItem): item is Block_HeroUnit =>
  item.system.type === contentTypes.hero_unit.codename;
