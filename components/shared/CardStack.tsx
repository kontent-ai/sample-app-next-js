import { FC } from "react";
import { CardStack } from "../../models"
import { CardComponent } from "./Card";

type Props = Readonly<{
  item: CardStack;
}>;

export const CardStackComponent: FC<Props> = props => (
  <div className="rounded border-black p-7">
    <b>{props.item.elements.title.value}</b>
    {props.item.elements.message.value}
    <div className="flex flex-wrap gap-6">
      {props.item.elements.stack.linkedItems.map(item => (
        <CardComponent key={item.system.id} item={item} />
      ))}
    </div>
  </div>
);
