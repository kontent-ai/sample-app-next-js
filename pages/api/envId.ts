import { serialize } from 'cookie';
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
    const envId = req.query.envId;
    if (typeof envId !== "string") {
        return res.status(400).json({ error: "You have to provide 'envId' query parameter with the environmentId." });
    }

    res.setHeader('Set-Cookie', serialize('envId', envId, { path: '/' }));
    res.redirect('/');

    // const webAuth = new auth0.WebAuth({
    //     audience: 'https://app.kenticocloud.com/',
    //     clientID: "NPIPF1KyuQ7W0pgfE50nms09aDUR4mKi",
    //     domain: "login.devkontentmasters.com",
    //     responseType: 'token id_token',
    //     scope: 'openid',
    // });


    // const url = webAuth.client.buildAuthorizeUrl({
    //     clientID: 'NPIPF1KyuQ7W0pgfE50nms09aDUR4mKi', // string
    //     responseType: 'token id_token', // code
    //     redirectUri: 'https://localhost:3000/api/test',
    //     state: 'blabla',
    //     nonce: '20'
    //   });

    // const url = `https://${'login.devkontentmasters.com'}/authorize?
    // response_type=token%id_token&
    // client_id=${'NPIPF1KyuQ7W0pgfE50nms09aDUR4mKi'}&
    // redirect_uri={https://localhost:3000/api/test}&
    // state=blabla`;


    return res.redirect('/');
}

export default handler