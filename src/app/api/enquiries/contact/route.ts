import { NextRequest } from 'next/server';
import { ContactEnquirySchema, PaginationQuerySchema } from '@/models/validation';
import { dbAdapter } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { apiSuccess, apiError, handleApiError } from '@/lib/api/response';
import { submissionRateLimiter, getClientIp, getRateLimitHeaders } from '@/lib/security/rate-limit';

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimit = submissionRateLimiter.check(`contact:${ip}`);
  const rateHeaders = getRateLimitHeaders(rateLimit);

  if (!rateLimit.allowed) {
    return apiError(
      'Too many contact messages dispatched. Please wait before transmitting another inquiry.',
      429,
      null,
      rateHeaders
    );
  }

  try {
    const body = await request.json();
    const validated = ContactEnquirySchema.parse(body);

    const created = await dbAdapter.createContactEnquiry(validated);
    return apiSuccess(created, undefined, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    // Only ADMIN can view general corporate communication inquiries
    await requireRole(request, ['ADMIN']);

    const { searchParams } = new URL(request.url);
    const query = PaginationQuerySchema.parse({
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 10,
      status: searchParams.get('status') || undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: searchParams.get('sortOrder') || 'desc'
    });

    const result = await dbAdapter.getContactEnquiries(query);
    return apiSuccess(result.data, result.pagination);
  } catch (error) {
    return handleApiError(error);
  }
}
