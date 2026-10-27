import { NextRequest } from 'next/server';
import { JobApplicationSchema, PaginationQuerySchema } from '@/models/validation';
import { dbAdapter } from '@/lib/db';
import { requireRole, authenticateRequest } from '@/lib/auth';
import { apiSuccess, apiError, handleApiError } from '@/lib/api/response';
import { submissionRateLimiter, getClientIp, getRateLimitHeaders } from '@/lib/security/rate-limit';

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimit = submissionRateLimiter.check(`app-submit:${ip}`);
  const rateHeaders = getRateLimitHeaders(rateLimit);

  if (!rateLimit.allowed) {
    return apiError(
      'Too many application submissions from this IP. Please wait before submitting another dossier.',
      429,
      null,
      rateHeaders
    );
  }

  try {
    const body = await request.json();
    const validated = JobApplicationSchema.parse(body);

    // Optional auth: if user is logged in, bind candidateId
    const session = await authenticateRequest(request);
    if (session && !validated.candidateId) {
      validated.candidateId = session.userId;
    }

    // Verify opportunity exists
    const opp = await dbAdapter.getOpportunityById(validated.opportunityId);
    if (opp) {
      validated.opportunityTitle = opp.title;
    }

    const created = await dbAdapter.createApplication(validated);
    return apiSuccess(created, undefined, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    // Only ADMIN and RECRUITER can list candidate applications
    await requireRole(request, ['ADMIN', 'RECRUITER']);

    const { searchParams } = new URL(request.url);
    const query = PaginationQuerySchema.parse({
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 10,
      search: searchParams.get('search') || undefined,
      status: searchParams.get('status') || undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: searchParams.get('sortOrder') || 'desc'
    });

    const result = await dbAdapter.getApplications(query);
    return apiSuccess(result.data, result.pagination);
  } catch (error) {
    return handleApiError(error);
  }
}
