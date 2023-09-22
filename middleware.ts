import { NextRequest, NextResponse } from 'next/server'

import { envIdCookieName, previewApiKeyCookieName } from './lib/constants/cookies';
import { createQueryString } from './lib/routing';
import { defaultEnvId } from './lib/utils/env';

const envIdRegex = /(?<envId>[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12})(?<remainingUrl>.*)/;

export const middleware = (request: NextRequest) => {
  const currentEnvId = request.cookies.get(envIdCookieName)?.value ?? defaultEnvId;

  // the order of functions is important
  const handlers = [
    handleArticlesRoute(currentEnvId),
    handleArticlesCategoryRoute,
    handleArticlesCategoryWithNoPaginationRoute(currentEnvId),
    handleExplicitProjectRoute(currentEnvId),
    handleEmptyCookies
  ];

  return handlers.reduce((prevResponse, handler) => handler(prevResponse, request),
    NextResponse.rewrite(new URL(`/${currentEnvId}${request.nextUrl.pathname ? `${request.nextUrl.pathname}` : ''}`, request.url)))
};

const handleExplicitProjectRoute = (currentEnvId: string) => (prevResponse: NextResponse, request: NextRequest) => {
  const regexResult = request.nextUrl.pathname.match(envIdRegex);
  const routeEnvId = regexResult?.groups?.envId
  const remainingUrl = regexResult?.groups?.remainingUrl;

  if (!routeEnvId) {
    return prevResponse;
  }

  if (routeEnvId === defaultEnvId) {
    const res = NextResponse.redirect(new URL(createUrlWithQueryString(remainingUrl, request.nextUrl.searchParams), request.nextUrl.origin));
    res.cookies.set(envIdCookieName, routeEnvId, { path: '/', sameSite: 'none', secure: true });
    res.cookies.set(previewApiKeyCookieName, '', { path: '/', sameSite: 'none', secure: true });

    return res
  }

  if (routeEnvId !== currentEnvId || !request.cookies.get(previewApiKeyCookieName)) {
    const res = NextResponse.redirect(new URL(`/getPreviewApiKey?path=${encodeURIComponent(createUrlWithQueryString(remainingUrl, request.nextUrl.searchParams.entries()))}`, request.url))

    res.cookies.set(envIdCookieName, routeEnvId, { path: '/', sameSite: 'none', secure: true });
    res.cookies.set(previewApiKeyCookieName, '', { path: '/', sameSite: 'none', secure: true });

    return res;
  }

  return NextResponse.redirect(new URL(`${remainingUrl ?? ''}?${createQueryString(Object.fromEntries(request.nextUrl.searchParams.entries()))}`, request.nextUrl.origin));
}

const handleArticlesRoute = (currentEnvId: string) => (prevResponse: NextResponse, request: NextRequest,) => request.nextUrl.pathname === '/articles'
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
  if (!request.cookies.get(envIdCookieName)?.value) {
    prevResponse.cookies.set(envIdCookieName, defaultEnvId, { path: '/', sameSite: 'none', secure: true })
  }
  return prevResponse;
}

const createUrlWithQueryString = (url: string | undefined, searchParams: any) => {
  const entries = Object.fromEntries(searchParams);

  return Object.entries(entries).length > 0 ? `${url ?? ''}?${createQueryString(entries)}` : url ?? '';
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.png (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.png|getPreviewApiKey|logo.png|callback).*)',
    '/'
  ],
}
