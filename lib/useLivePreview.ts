import { IUpdateMessageData } from "@kontent-ai/smart-link";
import { useSmartLink } from "./useSmartLink";
import { useEffect } from "react";
import { KontentSmartLinkEvent } from "@kontent-ai/smart-link";

export const useLivePreview = (callback: (data: IUpdateMessageData) => void): void => {
  const smartLink = useSmartLink();

  useEffect(() => {
    if (smartLink) {
      smartLink.on(KontentSmartLinkEvent.Update, callback);
      // useSmartLink destroys the sdk so there is no need to remove the event listener
    }

    return;
  }, [smartLink, callback]);
};