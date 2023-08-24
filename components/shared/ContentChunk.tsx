import { FC } from "react";

import {
  createElementSmartLink,
  createFixedAddSmartLink,
  createItemSmartLink,
} from "../../lib/utils/smartLinkUtils";
import {
  Block_ContentChunk,
  contentTypes,
} from "../../models";
import { RichTextElement } from "./richText/RichTextElement";

type Props = Readonly<{
  item: Block_ContentChunk;
}>;

export const ContentChunk: FC<Props> = (props) => (
  <div
    className="px-10 py-5 chunk"
    {...createItemSmartLink(props.item.system.id)}
    {...createElementSmartLink(
      contentTypes.content_chunk.elements.content.codename
    )}
    {...createFixedAddSmartLink("end")}
  >
    <RichTextElement
      element={props.item.elements.content}
      isInsideTable={false}
    />
  </div>
);

