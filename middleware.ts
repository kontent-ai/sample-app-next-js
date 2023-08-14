import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {

  const x = request.cookies.get('envId');

  console.log("fsad", request.url)
  console.log("fdsafsad", request.nextUrl.pathname);

  if(request.nextUrl.pathname === '/articles'){
    return NextResponse.rewrite(new URL(`/${x}/articles/category/all`, request.url));
  }

  // Redirect to the /articles when manually type the /articles/category/all URL
  if(request.nextUrl.pathname === '/articles/category/all'){
    return NextResponse.redirect(new URL('/articles', request.url));
  }
  


  if (request.nextUrl.pathname  === '/_vercel/insights/script.js'){
    // console.log(new URL('/b0255462-358c-007b-0be0-43ee125ce1f0', request.url).toString())
    return NextResponse.rewrite(new URL('/b0255462-358c-007b-0be0-43ee125ce1f0', request.url))
  }


  console.log(`${x}${request.nextUrl.pathname ? `${request.nextUrl.pathname}` : ''}`);
  
  return NextResponse.rewrite(new URL(`/${x}${request.nextUrl.pathname ? `${request.nextUrl.pathname}` : ''}`, request.url))
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
    '/((?!api|_next/static|_next/image|favicon.ico).+)',
  ],
}