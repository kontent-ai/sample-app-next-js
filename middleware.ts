import { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const middleware = (request: NextRequest) => {
  // /articles will be shown in as URL but request will be against fully defined URL path
  if (request.nextUrl.pathname === '/articles') {
    return NextResponse.rewrite(new URL('/articles/category/all/page/1', request.url));
  }

  // If there is no pagination, but category provided - add the first page ti URL path
  if (/^\/articles\/category\/[^\/]+$/.test(request.nextUrl.pathname)) {
    return NextResponse.rewrite(new URL(request.url + "/page/1", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/articles',
    '/articles/category/:category+'
  ],
}