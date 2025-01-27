import { getCookie } from "cookies-next";

import { defaultCookieOptions, envIdCookieName } from "../constants/cookies";

export const getEnvIdFromCookie = () => getCookie(envIdCookieName, defaultCookieOptions);
