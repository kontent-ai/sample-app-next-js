// import auth0 from 'auth0-js';
// import dynamic from 'next/dynamic';
// import { useSearchParams } from 'next/navigation'


// const EnvIdNoSSR: React.FC = () => {
//     const params = useSearchParams();

//     const envId = params.get('envId');

//     if(!envId) {
//         return <p>The envId query string parameters is not set</p>
//     }

//     const webAuth = new auth0.WebAuth({
//         audience: 'https://app.kenticocloud.com/',
//         clientID: "NPIPF1KyuQ7W0pgfE50nms09aDUR4mKi",
//         domain: "login.devkontentmasters.com",
//         responseType: 'token id_token',
//         scope: 'openid',
//     });


//     webAuth.authorize();

//     return <></>
// }

// const EnvId = dynamic(() => Promise.resolve(EnvIdNoSSR), {
//     ssr: false,
//   })

const EnvId = () => <></>;

export default EnvId;