import { FC } from "react";

import { mainColorBgClass } from "../../lib/constants/colors";
import { createElementSmartLink } from "../../lib/utils/smartLinkUtils";
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
      url={props.item.elements.backgroundImage.value[0]?.url || ""}
      itemId={props.item.system.id}
    >
      <div className={`py-5 md:py-5 px-3 w-full flex md:w-fit ${mainColorBgClass[siteCodename]}  opacity-[85%]`}>
        <h1
          className="m-0 text-3xl align-text-bottom tracking-wide font-semibold"
          {...createElementSmartLink(contentTypes.hero_unit.elements.title.codename)}
        >
          {props.item.elements.title.value}
        </h1>
      </div>
      <div className="py-1 px-3 w-full bg-white opacity-90">
        <h2
          className="m-0 text-xl font-medium break-words hyphens-auto"
          lang='en'
          {...createElementSmartLink(contentTypes.hero_unit.elements.subtitle.codename)}
        >
          {props.item.elements.subtitle.value}
        </h2>
      </div>
    </HeroImage>
  );
}

HeroUnitComponent.displayName = "HeroUnitComponent";

