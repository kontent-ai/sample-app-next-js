import { NextRequest, NextResponse } from 'next/server'

import { defaultCookieOptions, envIdCookieName, previewApiKeyCookieName } from './lib/constants/cookies';
import { createQueryString } from './lib/routing';
import { defaultEnvId } from './lib/utils/env';

const envIdRegex = /(?<envId>[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12})(?<remainingUrl>.*)/;

const KONTENT_PREVIEW_API_KEY = process.env.KONTENT_PREVIEW_API_KEY;
if (!KONTENT_PREVIEW_API_KEY) {
  throw new Error(`Environment variable KONTENT_PREVIEW_API_KEY is missing`);
}

export const middleware = (request: NextRequest) => {
  if (request.method === 'OPTIONS') {
    return NextResponse.next(); // Allow OPTIONS to proceed
  }

  const currentEnvId = request.cookies.get(envIdCookieName)?.value ?? defaultEnvId;

  // the order of functions is important
  const handlers = [
    handleArticlesRoute(currentEnvId),
    handleArticlesCategoryRoute,
    handleArticlesCategoryWithNoPaginationRoute(currentEnvId),
    handleExplicitProjectRoute(currentEnvId),
    handleEmptyApiKeyCookie(currentEnvId),
    handleEmptyCookies
  ];

  const initialResponse = request.nextUrl.pathname.startsWith("/api/")
    ? NextResponse.next()
    : NextResponse.rewrite(new URL(`/${currentEnvId}${request.nextUrl.pathname ? `${request.nextUrl.pathname}` : ''}`, request.url));


  return handlers.reduce((prevResponse, handler) => handler(prevResponse, request), initialResponse);
};

const handleExplicitProjectRoute = (currentEnvId: string) => (prevResponse: NextResponse, request: NextRequest) => {
  const regexResult = request.nextUrl.pathname.match(envIdRegex);
  const routeEnvId = regexResult?.groups?.envId
  const remainingUrl = regexResult?.groups?.remainingUrl;

  if (!routeEnvId) {
    return prevResponse;
  }

  if (routeEnvId === defaultEnvId) {
    const res = NextResponse.redirect(new URL(createUrlWithQueryString(remainingUrl, request.nextUrl.searchParams.entries()), request.nextUrl.origin));
    res.cookies.set(envIdCookieName, defaultEnvId, defaultCookieOptions);
    res.cookies.set(previewApiKeyCookieName, "", cookieDeleteOptions);

    return res
  }

  if (routeEnvId !== currentEnvId) {
    const originalPath = encodeURIComponent(createUrlWithQueryString(remainingUrl, request.nextUrl.searchParams.entries()));
    const redirectPath = `/api/exit-preview?callback=${originalPath}`; // We need to exit preview, because the old preview API key is in preview data
    const res = NextResponse.redirect(new URL(redirectPath, request.nextUrl.origin));

    res.cookies.set(envIdCookieName, routeEnvId, defaultCookieOptions);
    res.cookies.set(previewApiKeyCookieName, "", cookieDeleteOptions);

    return res;
  }

  return NextResponse.redirect(new URL(`${remainingUrl ?? ''}?${createQueryString(Object.fromEntries(request.nextUrl.searchParams.entries()))}`, request.nextUrl.origin));
}

const handleEmptyApiKeyCookie = (currentEnvId: string) => (prevResponse: NextResponse, request: NextRequest) => {
  if (request.cookies.get(previewApiKeyCookieName)?.value || !request.nextUrl.pathname.startsWith("/api/preview")) {
    return prevResponse;
  }

  if (currentEnvId === defaultEnvId) {
    const res = NextResponse.redirect(request.url); // Workaround for this issue https://github.com/vercel/next.js/issues/49442, we cannot set cookies on NextResponse.next()
    res.cookies.set(previewApiKeyCookieName, KONTENT_PREVIEW_API_KEY, defaultCookieOptions);
    return res;
  }

  const originalPath = encodeURIComponent(createUrlWithQueryString(request.nextUrl.pathname, request.nextUrl.searchParams.entries()));
  const redirectPath = `/getPreviewApiKey?path=${originalPath}`;
  return NextResponse.redirect(new URL(redirectPath, request.nextUrl.origin));
};

const handleArticlesRoute = (currentEnvId: string) => (prevResponse: NextResponse, request: NextRequest) => request.nextUrl.pathname === '/articles'
  ? NextResponse.rewrite(new URL(`/${currentEnvId}/articles/category/all/page/1`, request.url))
  : prevResponse;

const handleArticlesCategoryRoute = (prevReponse: NextResponse, request: NextRequest) => request.nextUrl.pathname === '/articles/category/all'
  // Redirect to the /articles when manually type the /articles/category/all URL
  ? NextResponse.redirect(new URL('/articles', request.url))
  : prevReponse;

const handleArticlesCategoryWithNoPaginationRoute = (currentEnvId: string) => (prevResponse: NextResponse, request: NextRequest) => /^\/articles\/category\/[^/]+$/.test(request.nextUrl.pathname)
  // If there is no pagination, but category provided - add the first page ti URL path
  ? NextResponse.rewrite(new URL(`/${currentEnvId}${request.nextUrl.pathname}/page/1`, request.url))
  : prevResponse

const handleEmptyCookies = (prevResponse: NextResponse, request: NextRequest) => {
  if (!request.cookies.get(envIdCookieName)?.value && !prevResponse.cookies.get(envIdCookieName)) {
    prevResponse.cookies.set(envIdCookieName, defaultEnvId, defaultCookieOptions);
  }

  return prevResponse;
}

const createUrlWithQueryString = (url: string | undefined, searchParams: IterableIterator<[string, string]>) => {
  const entries = Object.fromEntries(searchParams);

  return Object.entries(entries).length > 0 ? `${url ?? ''}?${createQueryString(entries)}` : url ?? '';
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.png|getPreviewApiKey|logo.png|callback).*)',
    '/'
  ],
};

const cookieDeleteOptions = { ...defaultCookieOptions, maxAge: -1 } as const; // It seems that res.cookies.delete doesn't propagate provided options (we need sameSite: none) so we use this as a workaround
