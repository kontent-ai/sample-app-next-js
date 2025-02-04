import {  getCookie } from "cookies-next/client";

import { defaultCookieOptions, envIdCookieName } from "../constants/cookies";

export const getEnvIdFromCookie = () => getCookie(envIdCookieName, defaultCookieOptions);
