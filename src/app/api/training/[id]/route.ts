import { NextRequest } from 'next/server';
import { TrainingProgramSchema } from '@/models/validation';
import { dbAdapter } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { apiSuccess, apiError, handleApiError } from '@/lib/api/response';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const prog = await dbAdapter.getTrainingProgramById(id);
    if (!prog) {
      return apiError(`Training program with ID "${id}" was not found.`, 404);
    }
    return apiSuccess(prog);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    await requireRole(request, ['ADMIN', 'ADMISSIONS']);
    const { id } = await params;
    const body = await request.json();
    const partialSchema = TrainingProgramSchema.partial();
    const validated = partialSchema.parse(body);

    const updated = await dbAdapter.updateTrainingProgram(id, validated);
    if (!updated) {
      return apiError(`Training program with ID "${id}" was not found.`, 404);
    }
    return apiSuccess(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    // Only ADMIN can delete training programs
    await requireRole(request, ['ADMIN']);
    const { id } = await params;

    const deleted = await dbAdapter.deleteTrainingProgram(id);
    if (!deleted) {
      return apiError(`Training program with ID "${id}" was not found.`, 404);
    }
    return apiSuccess({ message: `Training program "${id}" deleted successfully.` });
  } catch (error) {
    return handleApiError(error);
  }
}
