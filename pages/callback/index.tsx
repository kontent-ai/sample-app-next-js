
import { getCookie } from "cookies-next";
import dynamic from "next/dynamic";
import { useEffect } from "react";

import { webAuth } from "../../lib/constants/auth";

const CallbackPage: React.FC = () => {

    useEffect(() => {
        const envId = getCookie('envId', {path:'/'});
        let api_key = '';

        console.log(envId);

        const fetchApiKey = async (authToken: string, projectContainerId: string) => {
            api_key = await getPreviewApiKey(authToken, projectContainerId, envId as string);
        }

        const fetchProjectContainer = async (authToken: string) => {
            const response = await fetch(`https://app.devkontentmasters.com/api/project-management/${envId}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${authToken}`
                }
            });
            const d = await response.json()
            console.log(d);         
            return d;
        }

        webAuth.parseHash({ hash: window.location.hash }, async (err, authResult) => {
            if (err) {
              return console.log(err);
            }

            const projectData = await fetchProjectContainer(authResult?.accessToken as string);

            await fetchApiKey(authResult?.accessToken as string, projectData['projectContainerId'] as string);
            console.log(api_key);
          });
    }, [])

    return <>Callback</>
}



const getPreviewApiKey = async (authToken: string, projectContainerId: string, envId: string) => {
    // filters keys
    const data = {
        //filters by the name of key
        query: '',
        // mngmt or delivery
        'token_types': ['delivery-api'],
        //for which environments
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