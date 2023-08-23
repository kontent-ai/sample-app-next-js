import { setCookie } from 'cookies-next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { webAuth } from '../../lib/constants/auth';

const EnvIdNoSSR: React.FC = () => {
  const router = useRouter();

  const { envid } = router.query;

  useEffect(() => {
    if (!envid) {
      return;
    }

    setCookie('envId', envid, { path: '/' });
    console.log(envid);

    webAuth.authorize({ redirectUri: 'http://localhost:3000/callback' });
  }, [envid, router.isReady, router.query])

  if (!envid) {
    return <p>The envId query string parameters is not set</p>
  }

  return <></>
}

//disable server side rendering for this page
const EnvId = dynamic(() => Promise.resolve(EnvIdNoSSR), {
  ssr: false,
})

export default EnvId;