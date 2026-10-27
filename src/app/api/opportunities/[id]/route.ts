import { NextRequest } from 'next/server';
import { OpportunitySchema } from '@/models/validation';
import { dbAdapter } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { apiSuccess, apiError, handleApiError } from '@/lib/api/response';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const opp = await dbAdapter.getOpportunityById(id);
    if (!opp) {
      return apiError(`Opportunity with ID "${id}" was not found.`, 404);
    }
    return apiSuccess(opp);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    await requireRole(request, ['ADMIN', 'RECRUITER']);
    const { id } = await params;
    const body = await request.json();
    const partialSchema = OpportunitySchema.partial();
    const validated = partialSchema.parse(body);

    const updated = await dbAdapter.updateOpportunity(id, validated);
    if (!updated) {
      return apiError(`Opportunity with ID "${id}" was not found.`, 404);
    }
    return apiSuccess(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    // Deleting opportunities is reserved strictly for ADMIN
    await requireRole(request, ['ADMIN']);
    const { id } = await params;

    const deleted = await dbAdapter.deleteOpportunity(id);
    if (!deleted) {
      return apiError(`Opportunity with ID "${id}" was not found.`, 404);
    }
    return apiSuccess({ message: `Opportunity "${id}" deleted successfully.` });
  } catch (error) {
    return handleApiError(error);
  }
}
