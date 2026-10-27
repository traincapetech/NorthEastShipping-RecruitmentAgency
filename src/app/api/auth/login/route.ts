import { NextRequest } from 'next/server';
import { LoginUserSchema } from '@/models/validation';
import { dbAdapter } from '@/lib/db';
import { verifyPassword, signToken, sanitizeUser } from '@/lib/auth';
import { apiSuccess, apiError, handleApiError } from '@/lib/api/response';
import { authRateLimiter, getClientIp, getRateLimitHeaders } from '@/lib/security/rate-limit';

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimit = authRateLimiter.check(`login:${ip}`);
  const rateHeaders = getRateLimitHeaders(rateLimit);

  if (!rateLimit.allowed) {
    return apiError(
      'Too many authentication attempts. Please wait before retrying.',
      429,
      null,
      rateHeaders
    );
  }

  try {
    const body = await request.json();
    const validated = LoginUserSchema.parse(body);

    const user = await dbAdapter.findUserByEmail(validated.email);
    if (!user) {
      // Return generic credential failure to prevent account enumeration
      return apiError('Invalid email or password credentials.', 401);
    }

    if (!user.isActive) {
      return apiError('This account has been deactivated. Please contact support.', 403);
    }

    const isValid = await verifyPassword(validated.password, user.passwordHash);
    if (!isValid) {
      return apiError('Invalid email or password credentials.', 401);
    }

    const safeUser = sanitizeUser(user);

    const token = await signToken({
      userId: safeUser.id,
      email: safeUser.email,
      role: safeUser.role,
      fullName: safeUser.fullName
    });

    const response = apiSuccess({
      user: safeUser,
      token
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
