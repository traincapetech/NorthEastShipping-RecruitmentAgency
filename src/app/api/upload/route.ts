import { NextRequest } from 'next/server';
import { saveUploadedFile } from '@/lib/storage/upload';
import { dbAdapter } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';
import { apiSuccess, apiError, handleApiError } from '@/lib/api/response';
import { uploadRateLimiter, getClientIp, getRateLimitHeaders } from '@/lib/security/rate-limit';
import { DocumentMetadata } from '@/models/validation';

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimit = uploadRateLimiter.check(`upload:${ip}`);
  const rateHeaders = getRateLimitHeaders(rateLimit);

  if (!rateLimit.allowed) {
    return apiError(
      'Upload limit reached. Please wait before uploading another file.',
      429,
      null,
      rateHeaders
    );
  }

  try {
    const session = await authenticateRequest(request);
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const documentType = (formData.get('documentType') as DocumentMetadata['documentType']) || 'resume';

    if (!file) {
      return apiError('No file provided in form data. Expected "file" field.', 400);
    }

    const uploadRes = await saveUploadedFile(file, documentType, session?.userId);
    if (!uploadRes.success || !uploadRes.metadata) {
      return apiError(uploadRes.error || 'Failed to upload file.', 400);
    }

    // Save document metadata in database
    await dbAdapter.saveDocumentMetadata(uploadRes.metadata);

    // Return safe metadata (excluding local server filePath)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { filePath, ...safeMetadata } = uploadRes.metadata;
    return apiSuccess(safeMetadata, undefined, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
