import { NextRequest } from 'next/server';
import { RegisterUserSchema } from '@/models/validation';
import { dbAdapter } from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';
import { apiSuccess, apiError, handleApiError } from '@/lib/api/response';
import { authRateLimiter, getClientIp, getRateLimitHeaders } from '@/lib/security/rate-limit';

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimit = authRateLimiter.check(`register:${ip}`);
  const rateHeaders = getRateLimitHeaders(rateLimit);

  if (!rateLimit.allowed) {
    return apiError(
      'Too many registration attempts. Please wait before retrying.',
      429,
      null,
      rateHeaders
    );
  }

  try {
    const body = await request.json();
    const validated = RegisterUserSchema.parse(body);

    // Check if email already registered
    const existing = await dbAdapter.findUserByEmail(validated.email);
    if (existing) {
      return apiError('An account with this email address already exists.', 409);
    }

    // Securely hash password with bcrypt
    const passwordHash = await hashPassword(validated.password);

    // Save user to database
    const user = await dbAdapter.createUser({
      fullName: validated.fullName,
      email: validated.email,
      phone: validated.phone,
      passwordHash,
      role: validated.role || 'CANDIDATE'
    });

    // Generate JWT token
    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName
    });

    const response = apiSuccess(
      {
        user,
        token
      },
      undefined,
      201
    );

    // Set secure HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
