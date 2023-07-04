import Image from "next/image"
import { FC } from "react";

import { createElementSmartLink, createItemSmartLink } from "../../lib/utils/smartLinkUtils";
import { contentTypes, Fact } from "../../models";

type Props = Readonly<{
  item: Fact;
}>;

export const FactComponent: FC<Props> = props => {
  const image = props.item.elements.image.value[0];
  return (
    <figure
      className="flex flex-col md:flex-row-reverse  items-center gap-1 w-full m-0 p-2 bg-gray-200"
      {...createItemSmartLink(props.item.system.id, true)}
    >
      {image && (
        <div
          className="w-full h-72 relative overflow-hidden"
          {...createElementSmartLink(contentTypes.fact.elements.image.codename)}
        >
          <Image
            src={image.url}
            alt={props.item.elements.title.value}
            fill
            className="object-cover m-0"
          />
        </div>
      )}
      <div className="px-7">
        <h3 {...createElementSmartLink(contentTypes.fact.elements.title.codename)}>
          {props.item.elements.title.value}
        </h3>
        <div
          className="text-justify"
          {...createElementSmartLink(contentTypes.fact.elements.message.codename)}
        >
          {props.item.elements.message.value}
        </div>
      </div>

    </figure>
  );
}
