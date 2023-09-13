
// eslint-disable-next-line import/no-extraneous-dependencies
import { getCookie } from "cookies-next";
import dynamic from "next/dynamic";
import { useEffect } from "react";

import { webAuth } from "../../lib/constants/auth";

const CallbackPage: React.FC = () => {
  useEffect(() => {
    const envId = getCookie('currentEnvId', { path: '/' });
    console.log(envId);

    const fetchApiKey = async (authToken: string, projectContainerId: string) => {
      return await getPreviewApiKey(authToken, projectContainerId, envId as string);
    }

    const getProjectContainerId = async (authToken: string) => {
      const response = await fetch(`https://app.devkontentmasters.com/api/project-management/${envId}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${authToken}`
          }
        });
      const data = await response.json()
      console.log(data);
      return data['projectContainerId'];
    }

    webAuth.parseHash({ hash: window.location.hash }, async (err, authResult) => {
      if (err) {
        return console.error(err);
      }
      const projectContainerId = await getProjectContainerId(authResult?.accessToken as string);

      const api_key = await fetchApiKey(authResult?.accessToken as string, projectContainerId as string);
      console.log(api_key);
    });
  }, [])

  return <>hello</>;
}



const getPreviewApiKey = async (authToken: string, projectContainerId: string, envId: string) => {
  const data = {
    query: '',
    'token_types': ['delivery-api'],
    environments: [envId]
  }

  const url = `https://app.devkontentmasters.com/api/project-container/${projectContainerId}/keys/listing`;
  const respone = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`
    },
    body: JSON.stringify(data)
  });

  const d = await respone.json();
  return d;
};

const callback = dynamic(() => Promise.resolve(CallbackPage), {
  ssr: false,
})

export default callback;