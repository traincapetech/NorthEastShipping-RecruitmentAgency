import { NextRequest } from 'next/server';
import { TrainingEnquirySchema, PaginationQuerySchema } from '@/models/validation';
import { dbAdapter } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { apiSuccess, apiError, handleApiError } from '@/lib/api/response';
import { submissionRateLimiter, getClientIp, getRateLimitHeaders } from '@/lib/security/rate-limit';

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimit = submissionRateLimiter.check(`trn-enquiry:${ip}`);
  const rateHeaders = getRateLimitHeaders(rateLimit);

  if (!rateLimit.allowed) {
    return apiError(
      'Too many admission enquiries submitted. Please wait before submitting another enquiry.',
      429,
      null,
      rateHeaders
    );
  }

  try {
    const body = await request.json();
    const validated = TrainingEnquirySchema.parse(body);

    if (validated.programId) {
      const prog = await dbAdapter.getTrainingProgramById(validated.programId);
      if (prog) {
        validated.programTitle = `${prog.title} (${prog.code})`;
      }
    }

    const created = await dbAdapter.createTrainingEnquiry(validated);
    return apiSuccess(created, undefined, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    // Only ADMIN and ADMISSIONS can review academy inquiries
    await requireRole(request, ['ADMIN', 'ADMISSIONS']);

    const { searchParams } = new URL(request.url);
    const query = PaginationQuerySchema.parse({
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 10,
      search: searchParams.get('search') || undefined,
      status: searchParams.get('status') || undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: searchParams.get('sortOrder') || 'desc'
    });

    const result = await dbAdapter.getTrainingEnquiries(query);
    return apiSuccess(result.data, result.pagination);
  } catch (error) {
    return handleApiError(error);
  }
}
