import { FC } from "react";

import { mainColorBgClass } from "../../lib/constants/colors";
import { createElementSmartLink, createItemSmartLink } from "../../lib/utils/smartLinkUtils";
import { Block_HeroUnit, contentTypes } from "../../models";
import { HeroImage } from "../landingPage/ui/heroImage";
import { useSiteCodename } from "./siteCodenameContext";

type Props = Readonly<{
  item: Block_HeroUnit;
}>;

export const HeroUnitComponent: FC<Props> = props => {
  const siteCodename = useSiteCodename();
  return (
    <HeroImage
      url={props.item.elements.backgroundImage.value[0]?.url || props.item.elements.fact.linkedItems[0]?.elements.image.value[0]?.url || ""}
      itemId={props.item.system.id}
    >
      <div
        className={`py-5 md:py-5 px-3 w-full flex md:w-fit ${mainColorBgClass[siteCodename]}  opacity-[85%]`}
        {...createItemSmartLink(props.item.elements.fact.linkedItems[0]?.system.id)}
      >
        <h1
          className="m-0 text-3xl align-text-bottom tracking-wide font-semibold"
          {...createElementSmartLink(contentTypes.fact.elements.title.codename)}
        >
          {props.item.elements.fact.linkedItems[0]?.elements.title.value}
        </h1>
      </div>
      <div className="py-1 px-3 w-full bg-white opacity-90">
        <h2
          className="m-0 text-xl font-medium break-words hyphens-auto"
          lang='en'
          {...createElementSmartLink(contentTypes.fact.elements.message.codename)}
        >
          {props.item.elements.fact.linkedItems[0]?.elements.message.value}
        </h2>
      </div>
    </HeroImage>
  );
}

HeroUnitComponent.displayName = "HeroUnitComponent";

