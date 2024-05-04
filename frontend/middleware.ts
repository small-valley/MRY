import type { NextRequest } from 'next/server';

const protectedRouteMiddleware = (request: NextRequest) => {
  const token = request.cookies.get('access_token')?.value;

  if (!token && protectedPaths.includes(request.nextUrl.pathname)) {
    return Response.redirect(new URL('/', request.url));
  }
};

const protectedPaths = ['/home', '/programs', '/cohorts', '/schedules', '/instructors', '/notification', '/profile'];

export default protectedRouteMiddleware;
