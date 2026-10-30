import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { DocumentMetadata } from '@/models/validation';
import { isR2Configured, uploadToR2, downloadFromR2 } from './r2';

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
const MAX_FILE_SIZE_MB = parseInt(process.env.MAX_FILE_SIZE_MB || '5', 10);
const MAX_FILE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png'
]);

/**
 * Validates file magic bytes (signatures) to prevent disguised executable uploads.
 */
export function verifyFileSignature(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 4) return false;

  if (mimeType === 'application/pdf') {
    // PDF starts with %PDF- (0x25 0x50 0x44 0x46)
    return buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46;
  }

  if (mimeType === 'image/jpeg') {
    // JPEG starts with 0xFF 0xD8 0xFF
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  if (mimeType === 'image/png') {
    // PNG starts with 0x89 0x50 0x4E 0x47
    return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
  }

  return false;
}

export interface UploadResult {
  success: boolean;
  metadata?: DocumentMetadata;
  error?: string;
}

/**
 * Securely saves an uploaded candidate document (CV, CDC, STCW certificates).
 * Uses Cloudflare R2 when configured, with local filesystem fallback.
 */
export async function saveUploadedFile(
  file: File,
  documentType: DocumentMetadata['documentType'] = 'resume',
  userId?: string
): Promise<UploadResult> {
  // 1. File Size Verification
  if (file.size > MAX_FILE_BYTES) {
    return {
      success: false,
      error: `File size exceeds maximum allowed limit of ${MAX_FILE_SIZE_MB}MB.`
    };
  }

  // 2. MIME Type Whitelist Verification
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return {
      success: false,
      error: `Unsupported file type "${file.type}". Allowed formats: PDF, JPEG, PNG.`
    };
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 3. Binary Magic Bytes Verification
  if (!verifyFileSignature(buffer, file.type)) {
    return {
      success: false,
      error: 'File content does not match its reported format. Disguised binary files are rejected.'
    };
  }

  // 4. Sanitize extension
  let extension = '.pdf';
  if (file.type === 'image/jpeg') extension = '.jpg';
  if (file.type === 'image/png') extension = '.png';

  // 5. Generate secure storage key with UUID
  const docId = `DOC-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
  const storedFileName = `${docId}_${Date.now()}${extension}`;

  // 6. Sanitize original filename (remove directory traversal & special chars)
  const sanitizedOriginalName = path.basename(file.name).replace(/[^a-zA-Z0-9._-]/g, '_');

  let storagePath: string;

  // 7. Cloudflare R2 Upload or Local Fallback
  if (isR2Configured()) {
    const r2Key = `documents/${storedFileName}`;
    const r2Res = await uploadToR2(r2Key, buffer, file.type);
    if (!r2Res.success) {
      return {
        success: false,
        error: r2Res.error || 'Failed to upload document to Cloudflare R2.'
      };
    }
    storagePath = `r2://${r2Key}`;
  } else {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const fullPath = path.join(UPLOAD_DIR, storedFileName);
    await fs.writeFile(fullPath, buffer, { mode: 0o600 });
    storagePath = fullPath;
  }

  const metadata: DocumentMetadata = {
    id: docId,
    originalName: sanitizedOriginalName,
    storedFileName,
    mimeType: file.type,
    sizeBytes: file.size,
    uploadedByUserId: userId,
    documentType,
    filePath: storagePath,
    createdAt: new Date().toISOString()
  };

  return {
    success: true,
    metadata
  };
}

/**
 * Reads an uploaded file by metadata from Cloudflare R2 or local storage.
 */
export async function readUploadedFile(metadata: DocumentMetadata): Promise<Buffer> {
  if (metadata.filePath.startsWith('r2://')) {
    const key = metadata.filePath.replace('r2://', '');
    const buffer = await downloadFromR2(key);
    if (!buffer) {
      throw new Error(`File ${key} could not be retrieved from Cloudflare R2.`);
    }
    return buffer;
  }

  return fs.readFile(metadata.filePath);
}
