import { type IUpdateMessageData, KontentSmartLinkEvent } from "@kontent-ai/smart-link";
import { useEffect } from "react";
import { useSmartLink } from "./useSmartLink.ts";

export const useLivePreview = (
  callback: (data: IUpdateMessageData) => void | Promise<void>,
): void => {
  const smartLink = useSmartLink();

  useEffect(() => {
    if (smartLink) {
      smartLink.on(KontentSmartLinkEvent.Update, (data) => {
        void callback(data);
      });
      // useSmartLink destroys the sdk so there is no need to remove the event listener
    }

    return;
  }, [smartLink, callback]);
};
