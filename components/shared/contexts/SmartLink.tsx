import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";

import KontentSmartLink, {KontentSmartLinkEvent} from "../../../../smart-link";
import {IRefreshMessageData, IRefreshMessageMetadata} from "../../../../smart-link/types/lib/IFrameCommunicatorTypes";
import {defaultEnvId} from "../../../lib/utils/env";
import {getEnvIdFromCookie} from "../../../lib/utils/pageUtils";

type SmartLinkContextValue = {
  readonly smartLink?: KontentSmartLink | null;
};

const defaultContext: SmartLinkContextValue = {};

export const SmartLinkContext = React.createContext<SmartLinkContextValue>(defaultContext);

interface SmartLinkContextProps {
  readonly children: React.ReactNode;
}

export const SmartLinkProvider: React.FC<SmartLinkContextProps> = ({children}) => {
  const [smartLink, setSmartLink] = useState<KontentSmartLink | null>(null);

  useEffect(() => {
    const envId = getEnvIdFromCookie() ?? defaultEnvId;

    setSmartLink(KontentSmartLink.initialize({
      defaultDataAttributes: {
        projectId: envId,
        languageCodename: "default",
      }
    }));

    return () => smartLink?.destroy()
  }, [smartLink]);

  const value = useMemo(() => ({smartLink}), [smartLink]);

  return (
    <SmartLinkContext.Provider value={value}>
      {children}
    </SmartLinkContext.Provider>
  );
};

SmartLinkProvider.displayName = 'SmartLinkProvider';

export const useSmartLink = (): KontentSmartLink | null => {
  const {smartLink} = useContext(SmartLinkContext);
  if (smartLink === undefined) {
    throw new Error('You need to place SmartLinkProvider to one of the parent components to use useSmartLink.');
  }

  return smartLink;
};

export const useSmartLinkRefresh = (callback: () => void) => {
  // Wrap callback to the ref so that we don't have to refresh the event subscription
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const smartLink = useSmartLink();
  const onRefresh = useCallback(
    (data: IRefreshMessageData, metadata: IRefreshMessageMetadata, originalRefresh: () => void) => {
      if (metadata.manualRefresh) {
        originalRefresh();
      } else {
        callbackRef.current();
      }
    }, []);

  useEffect(() => {
    smartLink?.on(KontentSmartLinkEvent.Refresh, onRefresh);

    return () => smartLink?.off(KontentSmartLinkEvent.Refresh, onRefresh);
  }, [smartLink, onRefresh]);
};
