"use client";

import type { IContentItem } from "@kontent-ai/delivery-sdk";
import { applyUpdateOnItemAndLoadLinkedItems } from "@kontent-ai/smart-link";
import { type FC, useState } from "react";
import type { FeaturedNotice } from "../../lib/types/compliance.ts";
import { useLivePreview } from "../../lib/useLivePreview.ts";
import { parseFlatted, stringifyAsType } from "../../lib/utils/circularityUtils.ts";
import GraniteHomepage from "./GraniteHomepage.tsx";

type Props = Readonly<{
  notices: ReadonlyArray<FeaturedNotice>;
}>;

const PreviewGraniteHomepage: FC<Props> = ({ notices }) => {
  const [items, setItems] = useState(parseFlatted(stringifyAsType(notices)));

  useLivePreview(async (data) => {
    const updatedItems = await Promise.all(
      items.map(async (item) => {
        const updatedItem = await applyUpdateOnItemAndLoadLinkedItems(
          item,
          data,
          async (codenamesToFetch) => {
            const response = await fetch(`/api/items?codenames=${codenamesToFetch.join(",")}`);

            return (await response.json()) as ReadonlyArray<IContentItem>;
          },
        );

        return updatedItem as unknown as FeaturedNotice;
      }),
    );

    setItems(updatedItems);
  });

  return <GraniteHomepage notices={items} />;
};

export default PreviewGraniteHomepage;
