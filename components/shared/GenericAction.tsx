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
      className="flex items-center gap-1 w-full m-0 h-72"
      {...createItemSmartLink(props.item.system.id, true)}
    >
      <div className="p-4 w-2/3">
        <h3 {...createElementSmartLink(contentTypes.generic_action.elements.title.codename)}>
          {props.item.elements.title.value}
        </h3>
        <div {...createElementSmartLink(contentTypes.generic_action.elements.message.codename)}>
          {props.item.elements.message.value}
        </div>
      </div>
      {image && (
        <div
          className="h-full w-1/3 relative not-prose rounded-3xl overflow-hidden"
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
    </figure>
  );
}
