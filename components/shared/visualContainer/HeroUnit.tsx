import { FC } from "react";

import {
  createElementSmartLink,
  createItemSmartLink,
} from "../../../lib/utils/smartLinkUtils";
import { contentTypes, Fact } from "../../../models";
import { HeroImage } from "../../landingPage/ui/heroImage";
import { CTAButton } from "../internalLinks/CTAButton";

type Props = Readonly<{
  item: Fact;
}>;

export const HeroUnitComponent: FC<Props> = (props) => {
  const fact = props.item;

  return (
    <HeroImage
      url={fact.elements.image.value[0]?.url || ""}
      itemId={props.item.system.id}
    >
      <div className="p-5 text-white bg-indigo-950 bg-opacity-70 w-full">
        <div
          className="flex md:w-fit"
          {...createItemSmartLink(fact.system.id)}
        >
          <h1
            className="text-5xl min-[900px]:text-8xl pb-7 align-text-bottom tracking-wide font-semibold"
            {...createElementSmartLink(
              contentTypes.fact.elements.title.codename
            )}
          >
            {fact.elements.title.value}
          </h1>
        </div>
        <div className="text-2xl">
          <h2
            className="break-words hyphens-auto"
            lang="en"
            {...createElementSmartLink(
              contentTypes.fact.elements.reference__caption.codename
            )}
          >
            {fact.elements.message.value}
          </h2>
        </div>
        {fact.elements.referenceLabel.value && <CTAButton reference={fact} />}
      </div>
    </HeroImage>
  );
};

HeroUnitComponent.displayName = "HeroUnitComponent";
