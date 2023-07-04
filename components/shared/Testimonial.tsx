import { FC } from "react";

import { createElementSmartLink, createItemSmartLink } from "../../lib/utils/smartLinkUtils";
import { contentTypes,Testimonial } from "../../models";
import { PersonHorizontal } from "./PersonHorizontal";

type Props = Readonly<{
  item: Testimonial;
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
        <p {...createElementSmartLink(contentTypes.testimonial.elements.title.codename)}>
          {props.item.elements.title.value}
        </p>
        <p {...createElementSmartLink(contentTypes.testimonial.elements.quote.codename)}>
          {props.item.elements.quote.value}
        </p>
      </div>
    </section>
  );
};
