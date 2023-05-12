import { FC, useState } from "react";
import { CardStack, contentTypes } from "../../models"
import { CardComponent } from "./Card";
import { useSiteCodename } from "./siteCodenameContext";
import { mainColorBorderClass } from "../../lib/constants/colors";
import { createElementSmartLink, createItemSmartLink, createRelativeAddSmartLink } from "../../lib/utils/smartLinkUtils";

type Props = Readonly<{
  item: CardStack;
}>;

export const CardStackComponent: FC<Props> = props => {
  const [cardIndex, setCardIndex] = useState(0);

  const currentCard = props.item.elements.stack.linkedItems[cardIndex];

  if (!currentCard) {
    return null;
  }

  return (
    <div
      className="p-7"
      {...createItemSmartLink(props.item.system.id, true)}
    >
      <h2 {...createElementSmartLink(contentTypes.card_stack.elements.title.codename)}>
        {props.item.elements.title.value}
      </h2>
      <div {...createElementSmartLink(contentTypes.card_stack.elements.message.codename)}>
        {props.item.elements.message.value}
      </div>
      <section
        className="py-11"
        {...createElementSmartLink(contentTypes.card_stack.elements.stack.codename)}
      >
        <Headers
          headers={props.item.elements.stack.linkedItems.map(item => ({ id: item.system.id, label: item.elements.title.value }))}
          onHeaderSelected={setCardIndex}
          selectedHeaderIndex={cardIndex}
        />
        <div className="pt-3">
          <CardComponent item={currentCard} />
        </div>
      </section>
    </div>
  );
};

type HeadersProps = Readonly<{
  headers: ReadonlyArray<Readonly<{ id: string; label: string }>>;
  selectedHeaderIndex: number;
  onHeaderSelected: (headerIndex: number) => void;
}>;

const Headers: FC<HeadersProps> = props => {
  const siteCodename = useSiteCodename();

  return (
    <menu className="flex gap-6 border-b-2 border-b-gray-100">
      {props.headers.map((header, i) => (
        <li
          key={i}
          className={`overflow-hidden h-full m-0 shrink text-ellipsis flex justify-center items-center cursor-pointer ${mainColorBorderClass[siteCodename]} ${props.selectedHeaderIndex === i ? "border-b-2" : ""}`}
          onClick={() => props.onHeaderSelected(i)}
          {...createItemSmartLink(header.id, true)}
          {...createRelativeAddSmartLink("after", "right")}
        >
          {header.label}
        </li>
      ))}
    </menu>
  );
}

