import { nodeParse } from "@kontent-ai/rich-text-resolver/dist/cjs/src/parser/node";
import { transformToPortableText } from "@kontent-ai/rich-text-resolver/dist/cjs/src/transformers/portable-text-transformer";
import { PortableText } from "@portabletext/react";
import { FC } from "react";
import { RichTextContent } from "../../models/content-types/component___rich_text_content"

type Props = Readonly<{
  item: RichTextContent;
}>;

export const RichTextContentComponent: FC<Props> = props => {
  const portableText = transformToPortableText(nodeParse(props.item.elements.content.value));

  return <PortableText value={portableText} />
}
