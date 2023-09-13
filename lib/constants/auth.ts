import { WebAuth } from "auth0-js";

export const webAuth = new WebAuth({
    audience: 'https://app.kenticocloud.com/',
    clientID: "NPIPF1KyuQ7W0pgfE50nms09aDUR4mKi",
    domain: "login.devkontentmasters.com",
    responseType: 'token id_token',
    scope: 'openid',
});