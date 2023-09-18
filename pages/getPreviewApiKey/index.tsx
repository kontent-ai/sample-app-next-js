import dynamic from "next/dynamic";
import { FC, useEffect } from "react";

import { webAuth } from "../../lib/constants/auth";

const GetPreviewApiKey: FC = () => {
  useEffect(() => {
    const exitPreview = async () => {
      await fetch('/api/exit-preview');
    }
    exitPreview();

    webAuth.authorize({ redirectUri: `${process.env.NEXT_PUBLIC_VERCEL_URL}/callback` });
  }, [])

  return null;
}

const callback = dynamic(() => Promise.resolve(GetPreviewApiKey), {
  ssr: false,
})

export default callback;