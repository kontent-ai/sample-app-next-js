'use client'

import { FC, useEffect, useState } from "react";
import { useSmartLink } from "../../../lib/useSmartLink";
import { parseFlatted, Stringified, stringifyAsType } from '../../../lib/utils/circularityUtils';
import { WSL_WebSpotlightRoot } from "../../../models";
import { KontentSmartLinkEvent } from "@kontent-ai/smart-link";
import { IRefreshMessageData, IRefreshMessageMetadata } from "@kontent-ai/smart-link/types/lib/IFrameCommunicatorTypes";
import Homepage from "./homepage";

type HomepageProps = {
  homepageData: WSL_WebSpotlightRoot
}

const PreviewHomepage: FC<HomepageProps> = ({homepageData}) => {
  const [homepage, setHomepage] = useState(parseFlatted(stringifyAsType(homepageData)));
  const sdk = useSmartLink();

  useEffect(() => {
    const getHomepage = async () => {
      const response = await fetch(`/api/homepage`);
      const data = await response.json();

      setHomepage(parseFlatted(stringifyAsType(data)));
    }

    sdk?.on(KontentSmartLinkEvent.Refresh, (data: IRefreshMessageData, metadata: IRefreshMessageMetadata, originalRefresh: () => void) => {
      if (metadata.manualRefresh) {
        originalRefresh();
      } else {
        getHomepage();
      }
    });
  }, [sdk]);

  return <Homepage homepageData={homepage}></Homepage>
}

export default PreviewHomepage