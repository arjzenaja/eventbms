import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check if the request is for admin API routes
  if (pathname.startsWith('/api/admin/') && pathname !== '/api/admin/login') {
    // For now, we'll allow all admin API access
    // In production, you should implement proper JWT token validation here
    return NextResponse.next();
  }
  
  // Check if the request is for payments API (should be protected)
  if (pathname.startsWith('/api/payments')) {
    // For now, we'll allow all payments API access
    // In production, you should implement proper authentication here
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/admin/:path*',
    '/api/payments/:path*'
  ]
};
