import { NextRequest, NextResponse } from 'next/server';
import { dbAdapter } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { readUploadedFile } from '@/lib/storage/upload';
import { apiError, handleApiError } from '@/lib/api/response';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await requireAuth(request);
    const { id } = await params;

    const metadata = await dbAdapter.getDocumentMetadata(id);
    if (!metadata) {
      return apiError(`Document with ID "${id}" was not found.`, 404);
    }

    // Role check: Only the candidate owner, ADMIN, or RECRUITER can download documents
    const isOwner = metadata.uploadedByUserId === session.userId;
    const isPrivileged = session.role === 'ADMIN' || session.role === 'RECRUITER';

    if (!isOwner && !isPrivileged) {
      return apiError('Access denied. You do not have permission to access this seafarer document.', 403);
    }

    const fileBuffer = await readUploadedFile(metadata);

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        'Content-Type': metadata.mimeType,
        'Content-Length': metadata.sizeBytes.toString(),
        'Content-Disposition': `inline; filename="${metadata.originalName}"`,
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'private, no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}
