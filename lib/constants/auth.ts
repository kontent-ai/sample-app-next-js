import { WebAuth } from "auth0-js";

import { authApiDomain } from "../utils/env";

export const webAuth = new WebAuth({
  audience: process.env.NEXT_PUBLIC_AUTH0_WEBAUTH_AUDIENCE,
  clientID: process.env.NEXT_PUBLIC_AUTH0_WEBAUTH_CLIENT_ID ?? '',
  domain: authApiDomain ?? '',
  responseType: 'token id_token',
  scope: 'openid',
});
