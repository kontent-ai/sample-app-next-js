import { IUpdateMessageData } from "@kontent-ai/smart-link/types/lib/IFrameCommunicatorTypes";
import { useSmartLink } from "./useSmartLink";
import { useEffect } from "react";
import { KontentSmartLinkEvent } from "@kontent-ai/smart-link";

export const useLivePreview = (callback: (data: IUpdateMessageData) => void): void => {
  const smartLink = useSmartLink();

  useEffect(() => {
    if (smartLink) {
      smartLink.on(KontentSmartLinkEvent.Update, callback);

      return () => {
        smartLink.off(KontentSmartLinkEvent.Update, callback); 
      }
    }

    return;
  }, [smartLink, callback]);
};