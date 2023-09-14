import { NextRequest, NextResponse } from 'next/server'

import { createQueryString } from './lib/routing';

const envIdRegex = /(?<envId>[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12})(?<remainingUrl>.*)/
export const middleware = (request: NextRequest) => {
  let currentEnvId = request.cookies.get('currentEnvId');

  if (!currentEnvId) {
    currentEnvId = process.env.NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID;
  }

  if (!currentEnvId) {
    throw new Error("Missing 'NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID' environment variable.");
  }

  const regexResult = request.nextUrl.pathname.match(envIdRegex);
  const routeEnvId = regexResult?.groups?.envId
  const remainingUrl = regexResult?.groups?.remainingUrl;

  if (routeEnvId) {
    if (routeEnvId !== currentEnvId && routeEnvId !== process.env.NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID) {
      const res = NextResponse.redirect(new URL('/getPreviewApiKey', request.url))
      res.cookies.set('currentEnvId', routeEnvId, {path: '/', sameSite: 'none', secure: true});
      return res;
    } else {
      return NextResponse.redirect(new URL(`${remainingUrl ?? ''}?${createQueryString(Object.fromEntries(request.nextUrl.searchParams.entries()))}`, request.url));
    }
  }


  if (request.nextUrl.pathname === '/envid' || request.nextUrl.pathname === '/callback') {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === '/articles') {
    return NextResponse.rewrite(new URL(`/${currentEnvId}/articles/category/all/page/1`, request.url));
  }

  // Redirect to the /articles when manually type the /articles/category/all URL
  if (request.nextUrl.pathname === '/articles/category/all') {
    return NextResponse.redirect(new URL('/articles', request.url));
  }

  // If there is no pagination, but category provided - add the first page ti URL path
  if (/^\/articles\/category\/[^/]+$/.test(request.nextUrl.pathname)) {
    return NextResponse.rewrite(new URL(request.url + "/page/1", request.url));
  }

  return NextResponse.rewrite(new URL(`/${currentEnvId}${request.nextUrl.pathname ? `${request.nextUrl.pathname}` : ''}`, request.url))
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
    '/((?!api|_next/static|_next/image|favicon.ico|getPreviewApiKey).*)',
    '/'
  ],
}
