import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role

  // Protected routes that require authentication
  const protectedRoutes = ['/receipt-entry', '/residents', '/reports']
  const adminRoutes = ['/admin']
  
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(route + '/')
  )
  
  const isAdminRoute = adminRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )

  // Redirect to sign in if accessing protected route without authentication
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }

  // Redirect to sign in if user is not approved
  if (isProtectedRoute && isLoggedIn && userRole !== 'approved' && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/auth/signin?error=pending', req.url))
  }

  // Redirect to dashboard if accessing admin route without admin role
  if (isAdminRoute && (!isLoggedIn || userRole !== 'admin')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|auth).*)'],
}
