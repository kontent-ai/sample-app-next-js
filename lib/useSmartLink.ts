import KontentSmartLink from "@kontent-ai/smart-link"
import { useEffect } from "react";

export const useSmartLink = () => useEffect(() => {
  const sdk = KontentSmartLink.initialize({
    defaultDataAttributes: {
      projectId: "5e23f9dd-ef3a-00fb-1a3e-631a7be899bc",
      languageCodename: "en-US",
    }
  });

  return () => sdk.destroy()
}, []);
