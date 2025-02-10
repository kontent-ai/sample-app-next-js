'use client'

import { FC, useState } from "react";
import { parseFlatted, stringifyAsType } from '../../../lib/utils/circularityUtils';
import { WSL_WebSpotlightRoot } from "../../../models";
import { applyUpdateOnItemAndLoadLinkedItems } from "@kontent-ai/smart-link";
import Homepage from "./homepage";
import { useLivePreview } from "../../../lib/useLivePreview";

type HomepageProps = {
  homepageData: WSL_WebSpotlightRoot
}

const PreviewHomepage: FC<HomepageProps> = ({homepageData}) => {
  const [homepage, setHomepage] = useState(parseFlatted(stringifyAsType(homepageData)));

  useLivePreview(async (data) => {
    const updatedHomepage = applyUpdateOnItemAndLoadLinkedItems(homepage, data, async codenamesToFetch => {
      const response = await fetch('/api/items?codenames=' + codenamesToFetch.join(','));
      
      return await response.json();
    })

    setHomepage(updatedHomepage as unknown as WSL_WebSpotlightRoot);
})

  return <Homepage homepageData={homepage}></Homepage>
}

export default PreviewHomepage