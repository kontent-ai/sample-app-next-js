import { Elements } from "@kontent-ai/delivery-sdk";
import { nodeParse } from "@kontent-ai/rich-text-resolver/dist/cjs/src/parser/node";
import { transformToPortableText } from "@kontent-ai/rich-text-resolver/dist/cjs/src/transformers/portable-text-transformer";
import { PortableText } from "@portabletext/react";
import { FC } from "react";

import { createDefaultResolvers } from "../../lib/richTextResolvers";
import { createElementSmartLink, createFixedAddSmartLink, createItemSmartLink } from "../../lib/utils/smartLinkUtils";
import { Block_ContentChunk, contentTypes } from "../../models";

type Props = Readonly<{
  item: Block_ContentChunk;
}>;

export const RichTextContentComponent: FC<Props> = props => (
  <div
    {...createItemSmartLink(props.item.system.id)}
    {...createElementSmartLink(contentTypes.content_chunk.elements.content.codename)}
    {...createFixedAddSmartLink("end")}
  >
    <RichTextElement element={props.item.elements.content} />
  </div>
);

type ElementProps = Readonly<{
  element: Elements.RichTextElement;
}>;

export const RichTextElement: FC<ElementProps> = props => {
  const portableText = transformToPortableText(nodeParse(props.element.value));

  return (
    <PortableText
      value={portableText}
      components={createDefaultResolvers(props.element, item => <RichTextContentComponent item={item} />)}
    />
  );
}
