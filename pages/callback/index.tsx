import { getCookie, setCookie } from "cookies-next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { webAuth } from "../../lib/constants/auth";
import { envIdCookieName, previewApiKeyCookieName } from "../../lib/constants/cookies";
import { internalApiDomain } from "../../lib/utils/env";

const CallbackPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
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

    const getTokenSeedId = async (authToken: string, projectContainerId: string) => {
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
      return listingData[0]['token_seed_id']
    }


    const getPreviewApiKey = async (authToken: string, projectContainerId: string) => {
      const tokenSeedId = await getTokenSeedId(authToken, projectContainerId);

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
      setCookie(previewApiKeyCookieName, api_key, { path: '/', sameSite: 'none', secure: true })

      router.replace(authResult?.appState ?? '/');
    });
  }, [router]);

  return null;
}

const callback = dynamic(() => Promise.resolve(CallbackPage), {
  ssr: false,
})

export default callback;
