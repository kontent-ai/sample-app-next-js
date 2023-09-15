import dynamic from "next/dynamic";
import { FC, useEffect } from "react";

import { webAuth } from "../../lib/constants/auth";

const GetPreviewApiKey: FC = () => {
  useEffect(() => {
    webAuth.authorize({ redirectUri: `https://localhost:3000/callback` },);
  }, [])

  return null;
}

const callback = dynamic(() => Promise.resolve(GetPreviewApiKey), {
  ssr: false,
})

export default callback;