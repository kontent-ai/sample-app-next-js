import KontentSmartLink from "@kontent-ai/smart-link"
import { useEffect } from "react";

export const useSmartLink = () => useEffect(() => {
  const envId = process.env.NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID;
  if (!envId) {
    throw new Error("Cannot initialize smart-link sdk without 'NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID' environment variable.");
  }
  const sdk = KontentSmartLink.initialize({
    defaultDataAttributes: {
      projectId: envId,
      languageCodename: "default",
    }
  });

  return () => sdk.destroy()
}, []);
