import type { FC } from "react";

import { createElementSmartLink, createItemSmartLink } from "../../../lib/utils/smartLinkUtils.ts";
import type { Fact } from "../../../models/content-types/index.ts";
import { contentTypes } from "../../../models/environment/index.ts";
import { HeroImage } from "../../landingPage/ui/heroImage.tsx";
import { CTAButton } from "../internalLinks/CTAButton.tsx";

type Props = Readonly<{ item: Fact }>;

export const HeroUnitComponent: FC<Props> = (props) => {
  const fact = props.item;

  return (
    <HeroImage url={fact.elements.image.value[0]?.url ?? ""} itemId={props.item.system.id}>
      <div className="p-5 text-white bg-mainBackgroundColor w-full">
        <div className="flex md:w-fit" {...createItemSmartLink(fact.system.id)}>
          <h1
            className="text-5xl min-[900px]:text-8xl pb-7 align-text-bottom tracking-wide font-semibold"
            {...createElementSmartLink(contentTypes.fact.elements.title.codename)}
          >
            {fact.elements.title.value}
          </h1>
        </div>
        <div className="text-2xl">
          <h2
            className="break-words hyphens-auto"
            lang="en"
            {...createElementSmartLink(contentTypes.fact.elements.message.codename)}
          >
            {fact.elements.message.value}
          </h2>
        </div>
        {fact.elements.reference__label.value ? <CTAButton reference={fact} /> : null}
      </div>
    </HeroImage>
  );
};

HeroUnitComponent.displayName = "HeroUnitComponent";
