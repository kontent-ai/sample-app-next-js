import KontentSmartLink from "@kontent-ai/smart-link"
import { useEffect, useState } from "react";

import { defaultEnvId } from "./utils/env";
import { getEnvIdFromCookie } from "./utils/pageUtils";

export const useSmartLink = () => {
  const [sdk, setSdk] = useState<KontentSmartLink | null>(null);

  useEffect(() => {
    const envId = getEnvIdFromCookie() ?? defaultEnvId;

    setSdk(KontentSmartLink.initialize({
      defaultDataAttributes: {
        projectId: envId,
        languageCodename: "default",
      }
    }));

    return () => sdk?.destroy()
  }, [sdk]);

  return sdk;
}
