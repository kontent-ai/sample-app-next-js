import { getCookie, setCookie } from "cookies-next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { BuildError } from "../components/shared/ui/BuildError";
import { webAuth } from "../lib/constants/auth";
import { envIdCookieName, previewApiKeyCookieName } from "../lib/constants/cookies";
import { internalApiDomain } from "../lib/utils/env";

const CallbackPage: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    const envId = getCookie(envIdCookieName, { path: '/', sameSite: 'none' });

    if (!internalApiDomain) {
      console.log("Enviroment variable KONTENT_DOMAIN is empty");
    }

    const getProjectContainerId = async (authToken: string) => {
      const response = await fetch(`${internalApiDomain}/api/project-management/${envId}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${authToken}`
          }
        });
      const data = await response.json();

      return data['projectContainerId'];
    }

    const getTokenSeedId = async (authToken: string, projectContainerId: string): Promise<string | Readonly<{ error: string }>> => {
      const data = {
        query: '',
        'token_types': ['delivery-api'],
        environments: [envId]
      }

      const tokenSeedUrl = `${internalApiDomain}/api/project-container/${projectContainerId}/keys/listing`;
      const tokenSeedResponse = await fetch(tokenSeedUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify(data)
      });

      const listingData = await tokenSeedResponse.json();
      const firstToken = listingData[0];
      if (!firstToken) {
        return { error: "There is no preview delivery API token generated for this environment." } as const;
      }

      return listingData[0]['token_seed_id']
    }


    const getPreviewApiKey = async (authToken: string, projectContainerId: string): Promise<string | Readonly<{ error: string }>> => {
      const tokenSeedId = await getTokenSeedId(authToken, projectContainerId);
      if (typeof tokenSeedId !== "string") {
        return tokenSeedId;
      }

      const apiKeyUrl = `${internalApiDomain}/api/project-container/${projectContainerId}/keys/${tokenSeedId}`;
      const apiKeyResponse = await fetch(apiKeyUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
      });

      const apiKeyData = await apiKeyResponse.json();
      return apiKeyData['api_key'];
    };

    webAuth.parseHash({ hash: window.location.hash }, async (err, authResult) => {
      if (err) {
        return console.error(err);
      }
      const projectContainerId = await getProjectContainerId(authResult?.accessToken as string);

      const api_key = await getPreviewApiKey(authResult?.accessToken as string, projectContainerId as string);

      if (typeof api_key === "string") {
        setCookie(previewApiKeyCookieName, api_key, { path: '/', sameSite: 'none', secure: true })
      }
      else {
        setError(api_key.error);
      }

      window.location.replace(authResult?.appState ?? '/'); // router.replace changes the "slug" query parameter so we can't use it here, because this parameter is used when calling the /api/preview endpoint
    });
  }, [router.isReady]);

  if (error) {
    return <BuildError>{error}</BuildError>;
  }

  return null;
}

const callback = dynamic(() => Promise.resolve(CallbackPage), {
  ssr: false,
})

export default callback;
