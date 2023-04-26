import KontentSmartLink from "@kontent-ai/smart-link"
import { useEffect } from "react";

export const useSmartLink = () => useEffect(() => {
  const sdk = KontentSmartLink.initialize({
    defaultDataAttributes: {
      projectId: "2cedc519-a547-01ba-dde7-b01e00b909a1",
      languageCodename: "en-US",
    }
  });

  return () => sdk.destroy()
}, []);
