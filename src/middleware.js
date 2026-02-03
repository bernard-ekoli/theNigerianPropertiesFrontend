import { jwtVerify } from 'jose'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value
  const secret = new TextEncoder().encode(process.env.JWT_SECRET)

  // 🔐 DASHBOARD protection
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }

    try {
      await jwtVerify(token, secret)
      return NextResponse.next()
    } catch {
      // 🔥 TOKEN IS INVALID → CLEAR IT
      const res = NextResponse.redirect(new URL('/auth', request.url))
      res.cookies.delete('token')
      return res
    }
  }

  // 🚫 AUTH page protection
  if (pathname.startsWith('/auth')) {
    if (!token) return NextResponse.next()

    try {
      await jwtVerify(token, secret)
      // ✅ token valid → go dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } catch {
      // ❌ token invalid → allow auth page
      const res = NextResponse.next()
      res.cookies.delete('token')
      return res
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
}
 