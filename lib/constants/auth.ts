import { WebAuth } from "auth0-js";

export const webAuth = new WebAuth({
    audience: process.env.NEXT_PUBLIC_AUTH0_WEBAUTH_AUDIENCE,
    clientID: process.env.NEXT_PUBLIC_AUTH0_WEBAUTH_CLIENT_ID ?? '',
    domain: process.env.NEXT_PUBLIC_AUTH0_WEBAUTH_DOMAIN ?? '',
    responseType: 'token id_token',
    scope: 'openid',
});