import dynamic from "next/dynamic";
import { FC, useEffect } from "react";

import { webAuth } from "../../lib/constants/auth";

const GetPreviewApiKey: FC = () => {
  useEffect(() => {
    const exitPreview = async () => {
      await fetch('/api/exit-preview');
    }
    exitPreview();

    //TODO: needs to be changed after presentation to environment variable 
    webAuth.authorize({ redirectUri: `https://ficto-surgical-git-devrel-914-dynamic-projects-devrel-kontentai.vercel.app/callback` });
  }, [])
//
  return null;
}

const callback = dynamic(() => Promise.resolve(GetPreviewApiKey), {
  ssr: false,
})

export default callback;