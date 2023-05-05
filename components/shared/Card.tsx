import { FC } from "react";
import { Card } from "../../models";
import Image from "next/image"

type Props = Readonly<{
  item: Card;
}>;

export const CardComponent: FC<Props> = props => {
  const image = props.item.elements.cardImage.value[0];
  return (
    <figure className="flex items-center gap-1 w-full m-0 h-72">
      <div className="p-4 w-2/3">
        <h3>{props.item.elements.title.value}</h3>
        {props.item.elements.message.value}
      </div>
      {image && (
        <div className="h-full w-1/3 relative not-prose rounded-3xl overflow-hidden">
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
