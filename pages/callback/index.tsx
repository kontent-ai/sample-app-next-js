import { getCookie, setCookie } from "cookies-next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { webAuth } from "../../lib/constants/auth";

const CallbackPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const envId = getCookie('currentEnvId', { path: '/', sameSite: 'none' });

    const domain = process.env.NEXT_PUBLIC_KONTENT_DOMAIN;
    if(!domain) {
      console.log("Enviroment variable KONTENT_DOMAIN is empty");
    }

    const getProjectContainerId = async (authToken: string) => {
      const response = await fetch(`${domain}/api/project-management/${envId}`,
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

      const tokenSeedUrl = `${domain}/api/project-container/${projectContainerId}/keys/listing`;
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

      const apiKeyUrl = `${domain}/api/project-container/${projectContainerId}/keys/${tokenSeedId}`;
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
      setCookie('currentPreviewApiKey', api_key, { path: '/', sameSite: 'none', secure: true })

      router.replace(authResult?.appState ?? '/');
    });
  }, [router]);

  return null;
}

const callback = dynamic(() => Promise.resolve(CallbackPage), {
  ssr: false,
})

export default callback;