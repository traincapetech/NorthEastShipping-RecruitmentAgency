import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { dbAdapter } from '@/lib/db';
import { apiSuccess, apiError, handleApiError } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    const user = await dbAdapter.findUserById(session.userId);

    if (!user) {
      return apiError('User account not found.', 404);
    }

    return apiSuccess({ user });
  } catch (error) {
    return handleApiError(error);
  }
}
