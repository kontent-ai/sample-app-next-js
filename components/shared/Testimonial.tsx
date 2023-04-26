import { FC } from "react";
import { Testimonial } from "../../models";
import { AuthorVertical } from "./AuthorVertical";
import { AuthorHorizontal } from "./AuthorHorizontal";

type Props = Readonly<{
  item: Testimonial;
}>;

export const TestimonialComponent: FC<Props> = props => {
  return (
    <section className={`flex gap-4 ${layoutClasses(props.item)}`}>
      {renderAuthor(props.item)}
      <div>
        <p>
          {props.item.elements.title.value}
        </p>
        <p>
          {props.item.elements.subtitle.value}
        </p>
      </div>
    </section>
  );
};

const renderAuthor = (item: Testimonial) => {
  const authorItem = item.elements.author.linkedItems[0];

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

const layoutClasses = (item: Testimonial) => {
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
