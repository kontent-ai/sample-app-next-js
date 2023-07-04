import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import { Elements } from "@kontent-ai/delivery-sdk";
import { IPortableTextComponent, IPortableTextImage, IPortableTextInternalLink, IPortableTextItem, IPortableTextTable } from "@kontent-ai/rich-text-resolver";
import { nodeParse } from "@kontent-ai/rich-text-resolver/dist/cjs/src/parser/node";
import { transformToPortableText } from "@kontent-ai/rich-text-resolver/dist/cjs/src/transformers/portable-text-transformer";
import { PortableText, PortableTextMarkComponentProps, PortableTextReactComponents, PortableTextTypeComponentProps } from "@portabletext/react";
import Image from "next/image";
import { FC } from "react";

import { createElementSmartLink, createFixedAddSmartLink, createItemSmartLink } from "../../lib/utils/smartLinkUtils";
import { Block_ContentChunk, Component_Callout, contentTypes, Testimonial } from "../../models";
import { InternalLink } from "./internalLinks/InternalLink";
import { CalloutComponent } from "./richText/Callout";
import { TestimonialComponent } from "./Testimonial";

type Props = Readonly<{
  item: Block_ContentChunk;
}>;

export const RichTextContentComponent: FC<Props> = props => (
  <div
    {...createItemSmartLink(props.item.system.id)}
    {...createElementSmartLink(contentTypes.content_chunk.elements.content.codename)}
    {...createFixedAddSmartLink("end")}
  >
    <RichTextElement
      element={props.item.elements.content}
      isInsideTable={false}
    />
  </div>
);

type ElementProps = Readonly<{
  element: Elements.RichTextElement;
  isInsideTable: boolean;
}>;

export const RichTextElement: FC<ElementProps> = props => {
  const portableText = transformToPortableText(nodeParse(props.element.value));

  return (
    <PortableText
      value={portableText}
      components={createDefaultResolvers(props.element, false)}
    />
  );
};

type RichTextValueProps = Readonly<{
  element: Elements.RichTextElement;
  value: IPortableTextItem[];
  isInsideTable: boolean;
}>;

const RichTextValue: FC<RichTextValueProps> = props => (
  <PortableText
    value={props.value}
    components={createDefaultResolvers(props.element, props.isInsideTable)}
  />
);

const createDefaultResolvers = (element: Elements.RichTextElement, isElementInsideTable: boolean = false): Partial<PortableTextReactComponents> => ({
  types: {
    image: ({ value }: PortableTextTypeComponentProps<IPortableTextImage>) => {
      const asset = element.images.find(i => i.imageId === value.asset._ref);
      if (!asset) {
        throw new Error(`Asset ${value.asset._ref} not found.`);
      }

      if (isElementInsideTable) {
        return (
          <div className="w-28 h-14 relative not-prose">
            <Image
              src={value.asset.url}
              alt={asset.description ?? ""}
              fill
              className="object-contain"
            />
          </div>
        )
      }

      return (
        <span className="flex justify-center">
          <Image
            src={value.asset.url}
            alt={asset.description ?? ""}
            width={asset.width ?? undefined}
            height={asset.height ?? undefined}
          />
        </span>
      );
    },
    table: ({ value }: PortableTextTypeComponentProps<IPortableTextTable>) => {
      return (
        <table className="table-auto">
          <tbody>
            {value.rows.map(r => (
              <tr key={r._key}>
                {r.cells.map(c => (
                  <td key={c._key}>
                    <RichTextValue
                      isInsideTable
                      value={c.content}
                      element={element}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )
    },
    component: ({ value }: PortableTextTypeComponentProps<IPortableTextComponent>) => {
      const componentItem = element.linkedItems.find(i => i.system.codename === value.component._ref);
      if (!componentItem) {
        throw new Error("Component item not found, probably not enought depth requested.");
      }

      switch (componentItem.system.type) {
        case contentTypes.callout.codename:
          return <CalloutComponent item={componentItem as Component_Callout} />;
        case contentTypes.content_chunk.codename:
          return <RichTextContentComponent item={componentItem as Block_ContentChunk} />;
        case contentTypes.testimonial.codename:
          return <TestimonialComponent item={componentItem as Testimonial} />;
        default:
          return <div>Unsupported content type &quot;{componentItem.system.type}&quot;</div>;
      }
    },
  },
  marks: {
    sub: props => (
      <sub>
        {props.children}
      </sub>
    ),
    sup: props => (
      <sup>
        {props.children}
      </sup>
    ),
    internalLink: ({ value, children }: PortableTextMarkComponentProps<IPortableTextInternalLink>) => {
      const link = element.links.find(l => l.linkId === value?.reference._ref);
      if (!link) {
        throw new Error("Cannot find link reference in links. This should never happen.");
      }

      return (
        <InternalLink link={link}>
          {children}
        </InternalLink>
      );
    },
    link: ({ value, children }) => {
      const target = (value?.href || "").startsWith("http")
        ? "_blank"
        : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={value?.rel}
          title={value?.title}
        >
          {children}
          {!!value["data-new-window"] && <ArrowTopRightOnSquareIcon className="w-5 inline-block ml-1" />}
        </a>
      );
    },
  },
});

