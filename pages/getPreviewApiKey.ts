import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";

import { webAuth } from "../lib/constants/auth";

const GetPreviewApiKey: FC = () => {
  const router = useRouter();
  const { path } = router.query;

  useEffect(() => {
    if (!router.isReady) { // We need to wait until the component is hydrated, because otherwise router.query is empty (https://nextjs.org/docs/pages/building-your-application/rendering/automatic-static-optimization)
      return;
    }
    if (!path) {
      console.warn("Missing query parameter 'path' in /getPreviewApiKey. Will redirect to / after auth.");
    }
    webAuth.authorize({ redirectUri: `${window.origin}/callback`, appState: path });

  }, [path, router.isReady])

  return null;
}

const callback = dynamic(() => Promise.resolve(GetPreviewApiKey), {
  ssr: false,
})

export default callback;
