import Link from "next/link";
import { FC } from "react";

import { mainColorBgClass } from "../../../lib/constants/colors";
import { resolveReference } from "../../../lib/routing";
import { createElementSmartLink, createItemSmartLink } from "../../../lib/utils/smartLinkUtils";
import { contentTypes, Fact } from "../../../models";
import { HeroImage } from "../../landingPage/ui/heroImage";
import { useSiteCodename } from "../siteCodenameContext";

type Props = Readonly<{
  item: Fact;
}>;

export const HeroUnitComponent: FC<Props> = props => {
  const siteCodename = useSiteCodename();
  const fact = props.item;
  const factUrl = fact.elements.referenceExternalUri.value || fact.elements.referenceContentItemLink.linkedItems.length > 0
    ? resolveReference(fact)
    : null;
  const heroUnit = (
    <HeroImage
      url={fact.elements.image.value[0]?.url || ""}
      itemId={props.item.system.id}
    >
      <div
        className={`py-5 md:py-5 px-3 w-full flex md:w-fit ${mainColorBgClass[siteCodename]}  opacity-[85%]`}
        {...createItemSmartLink(fact.system.id)}
      >
        <h1
          className="m-0 text-3xl align-text-bottom tracking-wide font-semibold"
          {...createElementSmartLink(contentTypes.fact.elements.title.codename)}
        >
          {fact.elements.title.value}
        </h1>
      </div>
      <div className="py-1 px-3 w-full bg-white opacity-90">
        <h2
          className="m-0 text-xl font-medium break-words hyphens-auto"
          lang='en'
          {...createElementSmartLink(contentTypes.fact.elements.reference__caption.codename)}
        >
          {fact.elements.message.value}
        </h2>
      </div>
    </HeroImage>
  );

  return factUrl
    ? (
      <Link
        href={factUrl || "#"}
        className={`no-underline ${!factUrl ? "pointer-events-none" : ""}`}
        title={fact.elements.referenceCaption.value}
      >{heroUnit}
      </Link>
    )
    : heroUnit;
}

HeroUnitComponent.displayName = "HeroUnitComponent";

