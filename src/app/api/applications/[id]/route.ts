import { NextRequest } from 'next/server';
import { ApplicationStatusEnum } from '@/models/validation';
import { dbAdapter } from '@/lib/db';
import { requireAuth, requireRole } from '@/lib/auth';
import { apiSuccess, apiError, handleApiError } from '@/lib/api/response';
import { z } from 'zod';

type RouteContext = {
  params: Promise<{ id: string }>;
};

const UpdateStatusSchema = z.object({
  status: ApplicationStatusEnum,
  adminNotes: z.string().optional()
});

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await requireAuth(request);
    const { id } = await params;

    const application = await dbAdapter.getApplicationById(id);
    if (!application) {
      return apiError(`Application with ID "${id}" was not found.`, 404);
    }

    // Role check: If CANDIDATE, can only see their own application
    if (session.role === 'CANDIDATE') {
      const isOwner =
        application.candidateId === session.userId ||
        application.email.toLowerCase() === session.email.toLowerCase();

      if (!isOwner) {
        return apiError('Access denied. You can only view your own submitted dossier.', 403);
      }
    }

    return apiSuccess(application);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    // Only ADMIN and RECRUITER can update crewing status
    await requireRole(request, ['ADMIN', 'RECRUITER']);
    const { id } = await params;

    const body = await request.json();
    const { status, adminNotes } = UpdateStatusSchema.parse(body);

    const updated = await dbAdapter.updateApplicationStatus(id, status, adminNotes);
    if (!updated) {
      return apiError(`Application with ID "${id}" was not found.`, 404);
    }

    return apiSuccess(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
