import { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const middleware = (request: NextRequest) => {
  // /articles will be shown in as URL but request will be against /articles/category/all
  if(request.nextUrl.pathname === '/articles'){
    return NextResponse.rewrite(new URL('/articles/category/all', request.url));
  }

  // Redirect to the /articles when manually type the /articles/category/all URL
  if(request.nextUrl.pathname === '/articles/category/all'){
    return NextResponse.redirect(new URL('/articles', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/articles/category/all', '/articles'],
}