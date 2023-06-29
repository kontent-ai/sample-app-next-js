import { FC } from "react";

import { createElementSmartLink, createItemSmartLink } from "../../lib/utils/smartLinkUtils";
import { Block_Testimonial, contentTypes } from "../../models";
import { AuthorHorizontal } from "./AuthorHorizontal";
import { AuthorVertical } from "./AuthorVertical";

type Props = Readonly<{
  item: Block_Testimonial;
}>;

export const TestimonialComponent: FC<Props> = props => {
  return (
    <section
      className={`flex gap-4 ${layoutClasses(props.item)}`}
      {...createItemSmartLink(props.item.system.id)}
    >
      {renderAuthor(props.item)}
      <div>
        <p {...createElementSmartLink(contentTypes.testimonial.elements.title.codename)}>
          {props.item.elements.title.value}
        </p>
        <p {...createElementSmartLink(contentTypes.testimonial.elements.subtitle.codename)}>
          {props.item.elements.subtitle.value}
        </p>
      </div>
    </section>
  );
};

const renderAuthor = (item: Block_Testimonial) => {
  const authorItem = item.elements.author.linkedItems[0];

  if (!authorItem) {
    throw new Error(`Cannot render author in an unknown format ${item.elements.format.value[0]?.codename}.`)
  }

  switch (item.elements.format.value[0]?.codename) {
    case formatOptions.imageTop:
      return <AuthorHorizontal item={authorItem} />;
    case formatOptions.imageLeft:
      return <AuthorVertical item={authorItem} />;
    case formatOptions.imageRight:
      return <AuthorVertical item={authorItem} />;
    default:
      throw new Error(`Cannot render author in an unknown format ${item.elements.format.value[0]?.codename}.`);
  }
}

const layoutClasses = (item: Block_Testimonial) => {
  switch (item.elements.format.value[0]?.codename) {
    case formatOptions.imageTop:
      return "flex-col items-start";
    case formatOptions.imageRight:
      return "flex-row-reverse items-center";
    case formatOptions.imageLeft:
      return "items-center";
    default:
      throw new Error(`Cannot render author in an unknown format ${item.elements.format.value[0]?.codename}.`);
  }
}

const formatOptions = {
  imageTop: "image_on_top_of_the_text",
  imageLeft: "image_to_the_left__text_to_the_right",
  imageRight: "text_to_the_left__image_to_the_right",
} as const satisfies Readonly<Record<string, string>>;
