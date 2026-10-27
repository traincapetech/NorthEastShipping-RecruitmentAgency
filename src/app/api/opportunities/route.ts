import { NextRequest } from 'next/server';
import { OpportunitySchema, PaginationQuerySchema } from '@/models/validation';
import { dbAdapter } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { apiSuccess, handleApiError } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = PaginationQuerySchema.parse({
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 10,
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      status: searchParams.get('status') || undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: searchParams.get('sortOrder') || 'desc'
    });

    const result = await dbAdapter.getOpportunities(query);
    return apiSuccess(result.data, result.pagination);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Only ADMIN and RECRUITER can create opportunities
    await requireRole(request, ['ADMIN', 'RECRUITER']);

    const body = await request.json();
    const validated = OpportunitySchema.parse(body);

    const created = await dbAdapter.createOpportunity(validated);
    return apiSuccess(created, undefined, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
