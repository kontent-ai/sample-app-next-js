import { FC } from "react";
import { Card } from "../../models";
import Image from "next/image"

type Props = Readonly<{
  item: Card;
}>;

export const CardComponent: FC<Props> = props => {
  const image = props.item.elements.cardImage.value[0];
  return (
    <figure className="w-64 h-96 rounded shadow">
      {image && (
        <Image
          src={image.url}
          alt={props.item.elements.title.value}
          width={300}
          height={200}
        />
      )}
      <div className="p-4">
        <b>{props.item.elements.title.value}</b>
        {props.item.elements.message.value}
      </div>
    </figure>
  );
}
