import { FC } from "react";

import { createElementSmartLink, createItemSmartLink } from "../../lib/utils/smartLinkUtils";
import { contentTypes } from "../../models";
import { Fact } from '../../models/content-types/fact';
import { PersonHorizontal } from "./PersonHorizontal";

type Props = Readonly<{
  item: Fact;
}>;

export const TestimonialComponent: FC<Props> = props => {
  const authorItem = props.item.elements.author.linkedItems[0];

  return (
    <section
      className="flex gap-4 flex-col items-start"
      {...createItemSmartLink(props.item.system.id)}
    >
      {authorItem && <PersonHorizontal item={authorItem} />}
      <div>
        <p {...createElementSmartLink(contentTypes.fact.elements.title.codename)}>
          {props.item.elements.title.value}
        </p>
        <p {...createElementSmartLink(contentTypes.fact.elements.reference__caption.codename)}>
          {props.item.elements.message.value}
        </p>
      </div>
    </section>
  );
};
