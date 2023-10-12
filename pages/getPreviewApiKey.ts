import { setCookie } from "cookies-next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";

import { webAuth } from "../lib/constants/auth";
import { urlAfterAuthCookieName } from "../lib/constants/cookies";

const GetPreviewApiKey: FC = () => {
  const router = useRouter();
  const { path, promptLogin } = router.query;

  useEffect(() => {
    if (!router.isReady) { // We need to wait until the component is hydrated, because otherwise router.query is empty (https://nextjs.org/docs/pages/building-your-application/rendering/automatic-static-optimization)
      return;
    }
    if (!path) {
      console.warn("Missing query parameter 'path' in /getPreviewApiKey. Will redirect to / after auth.");
    }
    setCookie(urlAfterAuthCookieName, path, { path: "/", secure: true, sameSite: "none" });
    webAuth.authorize({ redirectUri: `${window.origin}/callback`, prompt: typeof promptLogin === "string" ? undefined : "none" });

  }, [path, router.isReady, promptLogin])

  return null;
}

const callback = dynamic(() => Promise.resolve(GetPreviewApiKey), {
  ssr: false,
})

export default callback;
