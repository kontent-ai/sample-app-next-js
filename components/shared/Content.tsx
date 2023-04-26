import { ComponentType, FC } from "react";
import { contentTypes } from "../../models";
import { HeroUnit } from "../../models/content-types/component___hero_unit";
import { RichTextContent } from "../../models/content-types/component___rich_text_content";
import { HeroUnitComponent } from "./HeroUnit";
import { RichTextContentComponent } from "./RichTextContent";

type AcceptedType = AcceptedTypesByCodename[keyof AcceptedTypesByCodename];

type Props = Readonly<{
  item: AcceptedType;
}>;

export const Content: FC<Props> = props => {
  const TargetComponent = componentMap[props.item.system.type as keyof AcceptedTypesByCodename];
  if (!TargetComponent) {
    throw new Error(`Cannot render a content item with codename: ${props.item.system.codename}`);
  }

  return <TargetComponent item={props.item as any} />;
}

const componentMap: Readonly<{ [key in keyof AcceptedTypesByCodename]: ComponentType<Readonly<{ item: AcceptedTypesByCodename[key] }>> }> = {
  component___hero_unit: HeroUnitComponent,
  component___rich_text_content: RichTextContentComponent,
};

// Unfortunately, we need to define the relationship manually, becase the generator doesn't define it itself. :/
type AcceptedTypesByCodename = {
  [contentTypes.component___hero_unit.codename]: HeroUnit;
  [contentTypes.component___rich_text_content.codename]: RichTextContent;
};

