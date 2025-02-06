import { FC } from "react";

import { sanitizeAnchor } from "../../../lib/anchors";
import { BuildError } from "../ui/BuildError";
import { CarouselComponent } from "./Carousel";
import { GridComponent } from "./Grid";
import { HeroUnitComponent } from "./HeroUnit";
import { StackComponent } from "./Stack";
import { Block_VisualContainer } from "../../../models/content-types";
import { contentTypes } from "../../../models/environment";

type Props = Readonly<{
  item: Block_VisualContainer;
  index: number;
}>;

const VisualRepresentation: FC<Props> = (props) => {
  const { grid, hero_unit, stack } = contentTypes.visual_container.elements.visual_representation.options;
  switch (props.item.elements.visual_representation.value[0]?.codename) {
    case grid.codename:
      return (
        <GridComponent
          items={props.item.elements.items.linkedItems}
          subtitle={props.item.elements.subtitle.value}
          title={props.item.elements.title.value}
          codename={props.item.system.codename}
        />
      );
    case stack.codename:
      return (
        <StackComponent
          index={props.index}
          items={props.item.elements.items.linkedItems}
          subtitle={props.item.elements.subtitle.value}
          title={props.item.elements.title.value}
          itemId={props.item.system.id}
          codename={props.item.system.codename}
        />
      );
    case hero_unit.codename:
      if (props.item.elements.items.linkedItems.length === 1) {
        const fact = props.item.elements.items.linkedItems[0];
        return !fact ? (
          <BuildError>
            Visual container {props.item.system.codename} does not contain any
            Fact.
          </BuildError>
        ) : (
          <HeroUnitComponent item={fact} />
        );
      }

      return (
        <CarouselComponent items={props.item.elements.items.linkedItems} />
      );
    default:
      return (
        <BuildError>
          Visual representation &quot;
          {props.item.elements.visual_representation.value[0]?.name ??
            "Missing representation"}
          &quot; is not supported.
        </BuildError>
      );
  }
};

export const VisualContainer: FC<Props> = (props) => (
  // wrapper for anchor functionality, works by passing the item codename to Reference -> External link element
  <div id={sanitizeAnchor(props.item.system.codename)}>
    <VisualRepresentation
      index={props.index}
      item={props.item}
    />
  </div>
);
