import KontentSmartLink from "@kontent-ai/smart-link"
import { useEffect, useState } from "react";

export const useSmartLink = () => {
  const [sdk, setSdk] = useState<KontentSmartLink | null>(null);

  useEffect(() => {
    const envId = process.env.NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID;
    if (!envId) {
      throw new Error("Cannot initialize smart-link sdk without 'NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID' environment variable.");
    }
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
