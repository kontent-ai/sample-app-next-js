import { NextRequest, NextResponse } from 'next/server'

import { createQueryString } from './lib/routing';

const envIdRegex = /(?<envId>[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12})(?<remainingUrl>.*)/

export const middleware = (request: NextRequest) => {
  let currentEnvId = request.cookies.get('currentEnvId');

  //try to fix css on web spotlight
  if(request.nextUrl.pathname.startsWith('/_next/static')){
    return NextResponse.next();
  }

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
    if(routeEnvId === process.env.NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID) {
      const res = NextResponse.redirect(new URL(`${remainingUrl ?? ''}?${createQueryString(Object.fromEntries(request.nextUrl.searchParams.entries()))}`, request.nextUrl.origin));
      res.cookies.set('currentEnvId', routeEnvId, {path: '/', sameSite: 'none', secure: true});
      res.cookies.set('currentPreviewApiKey', '', {path: '/', sameSite: 'none', secure: true});
      return res
    }

    if (routeEnvId !== currentEnvId || !request.cookies.get('currentPreviewApiKey')) {
      const res = NextResponse.redirect(new URL('/getPreviewApiKey', request.url))
      res.cookies.set('currentEnvId', routeEnvId, {path: '/', sameSite: 'none', secure: true});
      res.cookies.set('currentPreviewApiKey', '', {path: '/', sameSite: 'none', secure: true});

      // https://github.com/vercel/next.js/issues/40146
      res.cookies.set("__next_preview_data", ``);
      res.cookies.set("__prerender_bypass", ``);
      res.cookies.delete('__next_preview_data');
      res.cookies.delete('__prerender_bypass');

      return res;
    } else {
      return NextResponse.redirect(new URL(`${remainingUrl ?? ''}?${createQueryString(Object.fromEntries(request.nextUrl.searchParams.entries()))}`, request.nextUrl.origin));
    }
  }

  if (request.nextUrl.pathname === '/callback') {
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
    '/((?!api|_next/static|_next/image|favicon.ico|getPreviewApiKey|logo.png).*)',
    '\/'
  ],
}
