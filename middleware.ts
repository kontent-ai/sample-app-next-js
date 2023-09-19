import { NextRequest, NextResponse } from 'next/server'

import { createQueryString } from './lib/routing';

const envIdRegex = /(?<envId>[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12})(?<remainingUrl>.*)/

export const middleware = (request: NextRequest) => {
  const currentEnvId = request.cookies.get('currentEnvId')?.value 
    ? request.cookies.get('currentEnvId')?.value
    : process.env.NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID

  if (!currentEnvId) {
    throw new Error("Missing 'NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID' environment variable.");
  }

  const regexResult = request.nextUrl.pathname.match(envIdRegex);
  const routeEnvId = regexResult?.groups?.envId
  const remainingUrl = regexResult?.groups?.remainingUrl;

  // the order of functions is important
  const handlers = [
    handleArticlesRoute(currentEnvId),
    handleArticlesCategoryRoute,
    handleArticlesCategoryWithNoPaginationRoute(currentEnvId),
    handleExplicitProjectRoute(currentEnvId, routeEnvId, remainingUrl),
    handleEmptyCookies
  ];

  return handlers.reduce((prevResponse, handler) => handler(prevResponse, request),
    NextResponse.rewrite(new URL(`/${currentEnvId}${request.nextUrl.pathname ? `${request.nextUrl.pathname}` : ''}`, request.url)))
};

const handleExplicitProjectRoute = (currentEnvId: string, routeEnvId: string | undefined, remainingUrl: string | undefined) => (prevResponse: NextResponse, request: NextRequest) => {
  if (!routeEnvId) {
    return prevResponse;
  }

  if (routeEnvId === process.env.NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID) {
    const res = NextResponse.redirect(new URL(createUrlWithQueryString(remainingUrl, request.nextUrl.searchParams), request.nextUrl.origin));
    res.cookies.set('currentEnvId', routeEnvId, { path: '/', sameSite: 'none', secure: true });
    res.cookies.set('currentPreviewApiKey', '', { path: '/', sameSite: 'none', secure: true });

    return res
  }

  if (routeEnvId !== currentEnvId || !request.cookies.get('currentPreviewApiKey')) {
    const res = NextResponse.redirect(new URL(`/getPreviewApiKey?path=${encodeURIComponent(createUrlWithQueryString(remainingUrl, request.nextUrl.searchParams.entries()))}`, request.url))

    res.cookies.set('currentEnvId', routeEnvId, { path: '/', sameSite: 'none', secure: true });
    res.cookies.set('currentPreviewApiKey', '', { path: '/', sameSite: 'none', secure: true });

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
  if (!request.cookies.get('currentEnvId')?.value) {
    prevResponse.cookies.set('currentEnvId', process.env.NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID ?? '', { path: '/', sameSite: 'none', secure: true })
  }
  return prevResponse;
}

const createUrlWithQueryString = (url: string | undefined, searchParams: any) => {
  const entries = Object.fromEntries(searchParams);

  return  Object.entries(entries).length > 0 ? `${url ?? ''}?${createQueryString(entries)}` : url ?? '';
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|getPreviewApiKey|logo.png|callback).*)',
    '/'
  ],
}
