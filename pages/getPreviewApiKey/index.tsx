import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";

import { webAuth } from "../../lib/constants/auth";

const GetPreviewApiKey: FC = () => {
  const router = useRouter();
  const { path } = router.query;

  useEffect(() => {
    fetch('/api/exit-preview').then(() => {
      webAuth.authorize({ redirectUri: `${window.origin}/callback`, appState: path });
    });

  }, [router, path])

  return null;
}

const callback = dynamic(() => Promise.resolve(GetPreviewApiKey), {
  ssr: false,
})

export default callback;
