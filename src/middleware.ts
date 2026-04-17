import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const adminToken = request.cookies.get('admin_token')?.value;
  const { pathname } = request.nextUrl;

  // Protect Admin Pages (except login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (adminToken !== 'authenticated') {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  // Protect POST /api/dashboard
  if (pathname.startsWith('/api/dashboard') && request.method === 'POST') {
    if (adminToken !== 'authenticated') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // If trying to access login page while authenticated, redirect to admin panel
  if (pathname === '/admin/login' && adminToken === 'authenticated') {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/dashboard/:path*',
  ],
};
