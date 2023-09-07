import Image from "next/image";
import { FC } from "react";

import { mainColorAfterBgClass } from "../../lib/constants/colors";
import {
  createElementSmartLink,
  createItemSmartLink,
} from "../../lib/utils/smartLinkUtils";
import { contentTypes, Fact } from "../../models";
import { CTAButton } from "./internalLinks/CTAButton";
import { useSiteCodename } from "./siteCodenameContext";

type Props = Readonly<{
  item: Fact;
}>;

let reverseCounter = 0;
const shouldReverse = () => {
  reverseCounter++;
  return reverseCounter % 2 === 0;
};

export const FactComponent: FC<Props> = (props) => {
  const image = props.item.elements.image.value[0];
  const siteCodename = useSiteCodename();
  const reverse = shouldReverse();
  const authorElements = props.item.elements.author.linkedItems[0]?.elements;
  const { firstName, lastName, occupation } = authorElements ?? {};

  return (
    <figure
      className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-1 w-full m-0 py-10`}
      {...createItemSmartLink(props.item.system.id, true)}
    >
      {image && (
        <div
          className={`w-full md:w-1/2 h-[400px] relative drop-shadow-lg after:absolute ${reverse ? "after:left-3" : "after:right-3"} after:top-3 ${mainColorAfterBgClass[siteCodename]} after:bg-no-repeat after:w-full after:bg-contain after:h-full after:rounded-lg after:z-[1]`}
          {...createElementSmartLink(contentTypes.fact.elements.image.codename)}
        >
          <Image
            src={image.url}
            alt={props.item.elements.title.value}
            fill
            sizes="(max-width: 757px) 100vw, 50vw"
            className="object-cover m-0 rounded-lg z-10"
          />
        </div>
      )}
      <div
        className={`md:w-1/2 pl-2 pr-10 relative ${reverse ? "md:pl-0" : "md:pl-20"}`}
      >
        <h3
          className="heading scroll-mt-20"
          id={props.item.system.codename}
          {...createElementSmartLink(contentTypes.fact.elements.title.codename)}
        >
          <a
            className="fact"
            href={"#" + props.item.system.codename}
          >
            {props.item.elements.title.value}
          </a>
        </h3>
        <div
          className="text-justify"
          {...createElementSmartLink(
            contentTypes.fact.elements.reference__caption.codename
          )}
        >
          {props.item.elements.message.value}
        </div>
        {props.item.elements.author.value.length > 0 && (
          <div
            className="pt-5 text-right"
            {...createElementSmartLink(
              contentTypes.fact.elements.author.codename
            )}
          >
            <i>
              {[
                [firstName?.value, lastName?.value].join(" "),
                occupation?.value,
              ].join(", ")}
            </i>
          </div>
        )}
        {props.item.elements.referenceLabel.value && (
          <CTAButton reference={props.item} />
        )}
      </div>
    </figure>
  );
};
