import { SignJWT, jwtVerify } from 'jose';
import { UserRole, UserAccount, SafeUserAccount } from '@/models/validation';

const DEFAULT_SECRET = 'northeast_maritime_recruitment_jwt_secret_key_change_in_production_32chars';
const JWT_SECRET = process.env.JWT_SECRET || DEFAULT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const secretKey = new TextEncoder().encode(JWT_SECRET);

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  fullName: string;
}

/**
 * Signs a cryptographically secure JWT token with user claims.
 */
export async function signToken(payload: TokenPayload, expiresIn: string = JWT_EXPIRES_IN): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secretKey);
}

/**
 * Verifies and decodes a JWT token. Returns null if invalid or expired.
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as UserRole,
      fullName: payload.fullName as string
    };
  } catch {
    return null;
  }
}

/**
 * Strips passwordHash and sensitive internals from a user object before returning to client.
 */
export function sanitizeUser(user: UserAccount): SafeUserAccount {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...safe } = user;
  return safe;
}
