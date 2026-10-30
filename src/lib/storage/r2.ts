import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

/**
 * Cloudflare R2 Object Storage Client
 * Cloudflare R2 provides zero-egress, S3-compatible cloud storage.
 */

let r2ClientInstance: S3Client | null = null;

export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME
  );
}

export function getR2Client(): S3Client | null {
  if (!isR2Configured()) return null;

  if (!r2ClientInstance) {
    const accountId = process.env.R2_ACCOUNT_ID!;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID!;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY!;

    r2ClientInstance = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    });
  }

  return r2ClientInstance;
}

export async function uploadToR2(
  fileKey: string,
  buffer: Buffer,
  mimeType: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const client = getR2Client();
    const bucket = process.env.R2_BUCKET_NAME;

    if (!client || !bucket) {
      return { success: false, error: 'Cloudflare R2 is not configured.' };
    }

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: fileKey,
      Body: buffer,
      ContentType: mimeType
    });

    await client.send(command);

    const publicUrl = process.env.R2_PUBLIC_URL
      ? `${process.env.R2_PUBLIC_URL.replace(/\/$/, '')}/${fileKey}`
      : undefined;

    return {
      success: true,
      url: publicUrl
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message || 'Failed to upload to Cloudflare R2'
    };
  }
}

export async function downloadFromR2(fileKey: string): Promise<Buffer | null> {
  try {
    const client = getR2Client();
    const bucket = process.env.R2_BUCKET_NAME;

    if (!client || !bucket) return null;

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: fileKey
    });

    const response = await client.send(command);
    if (!response.Body) return null;

    const byteArray = await response.Body.transformToByteArray();
    return Buffer.from(byteArray);
  } catch {
    return null;
  }
}

export async function deleteFromR2(fileKey: string): Promise<boolean> {
  try {
    const client = getR2Client();
    const bucket = process.env.R2_BUCKET_NAME;

    if (!client || !bucket) return false;

    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: fileKey
    });

    await client.send(command);
    return true;
  } catch {
    return false;
  }
}
