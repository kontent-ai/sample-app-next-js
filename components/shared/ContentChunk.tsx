import type { FC } from "react";

import {
  createElementSmartLink,
  createFixedAddSmartLink,
  createItemSmartLink,
} from "../../lib/utils/smartLinkUtils.ts";
import { contentTypes } from "../../models/environment/index.ts";
import type { Block_ContentChunk } from "../../models/index.ts";
import { RichTextElement } from "./richText/RichTextElement.tsx";

type Props = Readonly<{
  item: Block_ContentChunk;
}>;

export const ContentChunk: FC<Props> = (props) => (
  <div
    className="px-10 py-5 vis-container"
    {...createItemSmartLink(props.item.system.id)}
    {...createElementSmartLink(contentTypes.content_chunk.elements.content.codename)}
    {...createFixedAddSmartLink("end")}
  >
    <RichTextElement element={props.item.elements.content} isInsideTable={false} />
  </div>
);
