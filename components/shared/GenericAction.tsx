import { FC } from "react";
import { GenericAction, contentTypes } from "../../models";
import Image from "next/image"
import { createElementSmartLink, createItemSmartLink } from "../../lib/utils/smartLinkUtils";

type Props = Readonly<{
  item: GenericAction;
}>;

export const GenericActionComponent: FC<Props> = props => {
  const image = props.item.elements.cardImage.value[0];
  return (
    <figure
      className="flex flex-col md:flex-row-reverse  items-center gap-1 w-full m-0 p-2 bg-gray-200"
      {...createItemSmartLink(props.item.system.id, true)}
    >
      {image && (
        <div
          className="w-full h-72 relative overflow-hidden"
          {...createElementSmartLink(contentTypes.generic_action.elements.card_image.codename)}
        >
          <Image
            src={image.url}
            alt={props.item.elements.title.value}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="px-7">
        <h3 {...createElementSmartLink(contentTypes.generic_action.elements.title.codename)}>
          {props.item.elements.title.value}
        </h3>
        <div className="text-justify" {...createElementSmartLink(contentTypes.generic_action.elements.message.codename)}>
          {props.item.elements.message.value}
        </div>
      </div>
      
    </figure>
  );
}
