import KontentSmartLink from "@kontent-ai/smart-link"
import { useEffect } from "react";

export const useSmartLink = () => useEffect(() => {
  const sdk = KontentSmartLink.initialize();

  return () => sdk.destroy()
}, []);
