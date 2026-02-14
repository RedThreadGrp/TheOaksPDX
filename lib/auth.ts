import { NextRequest } from 'next/server';

/**
 * Verifies the admin password
 */
export function verifyAdminPassword(password: string): boolean {
  const adminPassword = process.env.OAKS_ADMIN_PASSWORD;
  
  if (!adminPassword) {
    console.error('OAKS_ADMIN_PASSWORD environment variable is not set');
    return false;
  }
  
  return password === adminPassword;
}

/**
 * Checks if the request has a valid admin cookie
 */
export function isAdmin(req: NextRequest): boolean {
  const adminCookie = req.cookies.get('oaks_admin');
  return adminCookie?.value === '1';
}

/**
 * Middleware to require admin authentication
 * Returns null if authenticated, or a Response with 401 if not
 */
export function requireAdmin(req: NextRequest): Response | null {
  if (!isAdmin(req)) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  return null;
}
