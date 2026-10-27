import { verifyToken, TokenPayload } from './jwt';
import { UserRole } from '@/models/validation';

/**
 * Extracts JWT token from Authorization header or cookie.
 */
export function extractToken(request: Request): string | null {
  // 1. Check Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  // 2. Check cookies
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map((c) => {
        const [k, ...v] = c.trim().split('=');
        return [k, decodeURIComponent(v.join('='))];
      })
    );
    if (cookies.token) {
      return cookies.token;
    }
    if (cookies['auth-token']) {
      return cookies['auth-token'];
    }
  }

  return null;
}

/**
 * Validates request authentication and returns user claims if valid.
 */
export async function authenticateRequest(request: Request): Promise<TokenPayload | null> {
  const token = extractToken(request);
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Enforces authentication. Throws Error if user is unauthenticated.
 */
export async function requireAuth(request: Request): Promise<TokenPayload> {
  const user = await authenticateRequest(request);
  if (!user) {
    throw new Error('Authentication required. Please log in to proceed.');
  }
  return user;
}

/**
 * Enforces Role-Based Access Control (RBAC).
 * Throws Error if user role is not within the authorized list.
 */
export async function requireRole(request: Request, allowedRoles: UserRole[]): Promise<TokenPayload> {
  const user = await requireAuth(request);
  if (!allowedRoles.includes(user.role)) {
    throw new Error(`Access denied. Role "${user.role}" does not have required permissions.`);
  }
  return user;
}

/**
 * Utility to check if a role is authorized without throwing.
 */
export function isAuthorizedRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole);
}
