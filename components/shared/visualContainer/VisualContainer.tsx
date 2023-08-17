import { FC } from "react";

import { Block_VisualContainer, contentTypes } from "../../../models";
import { BuildError } from "../ui/BuildError";
import { CarouselComponent } from "./Carousel";
import { GridComponent } from "./Grid";
import { HeroUnitComponent } from "./HeroUnit";
import { StackComponent } from "./Stack";

type Props = Readonly<{
  item: Block_VisualContainer;
}>;

export const VisualContainer: FC<Props> = props => {
  debugger;
  switch (props.item.elements.visualRepresentation.value[0]?.codename) {
    case visualRepresentation.grid:
      return (
        <GridComponent
          items={props.item.elements.items.linkedItems}
        />
      );
    case visualRepresentation.stack:
      return (
        <StackComponent
          items={props.item.elements.items.linkedItems}
          subtitle={props.item.elements.subtitle.value}
          title={props.item.elements.title.value}
          itemId={props.item.system.id}
        />
      );
    case visualRepresentation.hero_unit:
      debugger;
      if (props.item.elements.items.linkedItems.length === 1) {
        const fact = props.item.elements.items.linkedItems[0];
        return (

          !fact
            ? <BuildError>Visual container {props.item.system.codename} does not contain any Fact.</BuildError>
            : (
              <HeroUnitComponent
                item={fact}
              />
            )

        )
      }

      return (
        <CarouselComponent
          items={props.item.elements.items.linkedItems}
        />

      )
    default:
      return (
        <BuildError>Visual representation &quot;{props.item.elements.visualRepresentation.value[0]?.name ?? "Missing representation"}&quot; is not supported.</BuildError>
      );
  }
};

// https://kontent-ai.atlassian.net/browse/DEVREL-955
const visualRepresentation = {
  grid: "grid",
  stack: "stack",
  hero_unit: "hero_unit",
} as const;
