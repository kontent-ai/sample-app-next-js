import { nodeParse } from "@kontent-ai/rich-text-resolver/dist/cjs/src/parser/node";
import { transformToPortableText } from "@kontent-ai/rich-text-resolver/dist/cjs/src/transformers/portable-text-transformer";
import { PortableText } from "@portabletext/react";
import { FC } from "react";
import { UMLPComponent_RichTextContent, contentTypes } from "../../models";
import { createElementSmartLink, createFixedAddSmartLink, createItemSmartLink } from "../../lib/utils/smartLinkUtils";
import { createDefaultResolvers } from "../../lib/richTextResolvers";

type Props = Readonly<{
  item: UMLPComponent_RichTextContent;
}>;

export const RichTextContentComponent: FC<Props> = props => {
  const portableText = transformToPortableText(nodeParse(props.item.elements.content.value));

  return (
    <div
      {...createItemSmartLink(props.item.system.id)}
      {...createElementSmartLink(contentTypes.component___rich_text_content.elements.content.codename)}
      {...createFixedAddSmartLink("end")}
    >
      <PortableText value={portableText} components={createDefaultResolvers(props.item.elements.content)} />
    </div >
  );
}
