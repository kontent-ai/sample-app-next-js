import { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// This function can be marked `async` if using `await` inside
export const middleware = (request: NextRequest) => {
  if(request.nextUrl.pathname === '/articles'){
    return NextResponse.rewrite(new URL('/articles/category/all', request.url));
  }
  if(request.nextUrl.pathname.endsWith('category/all')){
    return NextResponse.redirect(new URL('/articles', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/articles/category/all', '/articles'],
}