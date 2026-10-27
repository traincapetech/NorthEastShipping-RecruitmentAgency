import { NextRequest } from 'next/server';
import { EnquiryStatusEnum } from '@/models/validation';
import { dbAdapter } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { apiSuccess, apiError, handleApiError } from '@/lib/api/response';
import { z } from 'zod';

type RouteContext = {
  params: Promise<{ id: string }>;
};

const UpdateEnquiryStatusSchema = z.object({
  status: EnquiryStatusEnum,
  counselorNotes: z.string().optional()
});

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    await requireRole(request, ['ADMIN', 'ADMISSIONS']);
    const { id } = await params;

    const body = await request.json();
    const { status, counselorNotes } = UpdateEnquiryStatusSchema.parse(body);

    const updated = await dbAdapter.updateTrainingEnquiryStatus(id, status, counselorNotes);
    if (!updated) {
      return apiError(`Training enquiry with ID "${id}" was not found.`, 404);
    }

    return apiSuccess(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
