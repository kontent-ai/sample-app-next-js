"use client";
import { setCookie } from "cookies-next";
import { type FC, useEffect } from "react";

import { webAuth } from "../../lib/constants/auth.ts";
import { defaultCookieOptions, urlAfterAuthCookieName } from "../../lib/constants/cookies.ts";

const GetPreviewApiKey: FC = () => {
  useEffect(() => {
    const searchParams = new URLSearchParams(document.location.search);
    const path = searchParams?.get("path");
    const promptLogin = searchParams?.get("promptLogin");

    if (!path) {
      console.warn(
        "Missing query parameter 'path' in /getPreviewApiKey. Will redirect to / after auth.",
      );
    }
    void setCookie(urlAfterAuthCookieName, path, defaultCookieOptions);
    webAuth.authorize({
      redirectUri: `${window.origin}/callback`,
      prompt: typeof promptLogin === "string" ? undefined : "none",
    });
  }, []);

  return null;
};

export default GetPreviewApiKey;
