import { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {

  let envId = request.cookies.get('envId');

  if (!envId){
    envId = "b0255462-358c-007b-0be0-43ee125ce1f0";
  }

  console.log("fdsafads", request.nextUrl.pathname);

  if(request.nextUrl.pathname.startsWith('/_next/static')){
    return NextResponse.next();
  }

  if(request.nextUrl.pathname === '/articles'){
    return NextResponse.rewrite(new URL(`/${envId}/articles/category/all`, request.url));
  }

  // Redirect to the /articles when manually type the /articles/category/all URL
  if(request.nextUrl.pathname === '/articles/category/all'){
    return NextResponse.redirect(new URL('/articles', request.url));
  }
  

  if (request.nextUrl.pathname  === '/_vercel/insights/script.js'){
    return NextResponse.rewrite(new URL('/b0255462-358c-007b-0be0-43ee125ce1f0', request.url))
  }
  
  return NextResponse.rewrite(new URL(`/${envId}${request.nextUrl.pathname ? `${request.nextUrl.pathname}` : ''}`, request.url))
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
    '/',
    '/((?!api|_next/image|favicon.ico).*)',
  ],
}