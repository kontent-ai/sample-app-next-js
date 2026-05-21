"use client";

import type { IContentItem } from "@kontent-ai/delivery-sdk";
import { applyUpdateOnItemAndLoadLinkedItems } from "@kontent-ai/smart-link";
import { type FC, useState } from "react";
import { useLivePreview } from "../../../lib/useLivePreview.ts";
import { parseFlatted, stringifyAsType } from "../../../lib/utils/circularityUtils.ts";
import type { LP_WebsiteRoot } from "../../../models/content-types/index.ts";
import Homepage from "./homepage.tsx";

type HomepageProps = {
  homepageData: LP_WebsiteRoot;
};

const PreviewHomepage: FC<HomepageProps> = ({ homepageData }) => {
  const [homepage, setHomepage] = useState(parseFlatted(stringifyAsType(homepageData)));

  useLivePreview(async (data) => {
    const updatedHomepage = await applyUpdateOnItemAndLoadLinkedItems(
      homepage,
      data,
      async (codenamesToFetch) => {
        const response = await fetch(`/api/items?codenames=${codenamesToFetch.join(",")}`);

        return (await response.json()) as ReadonlyArray<IContentItem>;
      },
    );

    setHomepage(updatedHomepage as unknown as LP_WebsiteRoot);
  });

  return <Homepage homepageData={homepage} />;
};

export default PreviewHomepage;
