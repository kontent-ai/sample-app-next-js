'use client'

import { FC, useState } from "react";
import { parseFlatted, stringifyAsType } from '../../../lib/utils/circularityUtils';
import { LP_WebsiteRoot } from "../../../models/content-types";
import { applyUpdateOnItemAndLoadLinkedItems } from "@kontent-ai/smart-link";
import Homepage from "./homepage";
import { useLivePreview } from "../../../lib/useLivePreview";

type HomepageProps = {
  homepageData: LP_WebsiteRoot
}

const PreviewHomepage: FC<HomepageProps> = ({homepageData}) => {
  const [homepage, setHomepage] = useState(parseFlatted(stringifyAsType(homepageData)));

  useLivePreview(async (data) => {
    const updatedHomepage = await applyUpdateOnItemAndLoadLinkedItems(homepage, data, async codenamesToFetch => {
      const response = await fetch('/api/items?codenames=' + codenamesToFetch.join(','));
      
      return await response.json();
    })

    setHomepage(updatedHomepage as unknown as LP_WebsiteRoot);
})

  return <Homepage homepageData={homepage} />
}

export default PreviewHomepage