import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";

import { webAuth } from "../../lib/constants/auth";

const GetPreviewApiKey: FC = () => {
  const router = useRouter();
  const { path } = router.query;

  useEffect(() => {
   fetch('/api/exit-preview').then(() => {
    const redirectUri = process.env.NEXT_PUBLIC_AUTH0_WEBAUTH_REDIRECT_URI;
    if(!redirectUri){
      console.error("Enviroment variable AUTH0_WEBAUTH_REDIRECT_URI is missing");
      return;
    }
    webAuth.authorize({ redirectUri: redirectUri, appState: path });
   });
    
  }, [router, path])

  return null;
}

const callback = dynamic(() => Promise.resolve(GetPreviewApiKey), {
  ssr: false,
})

export default callback;