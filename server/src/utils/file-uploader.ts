import fs from 'node:fs/promises';
import { getDownloadURL } from 'firebase-admin/storage';
import bucket from '../config/firebase-admin.config';
import type { FileArray, UploadedFile } from 'express-fileupload';

interface UseBucketOptions {
  path?: string;
  timeout?: number;
}

interface Result {
  error: string | null;
  data: { id: string; name: string; url: string; type: string }[] | null;
}

export default function useBucket(
  files: FileArray | UploadedFile | UploadedFile[] | null,
  options: UseBucketOptions = {}
) {
  const defaultOptions = { path: '', timeout: 1000 * 60, ...options };

  return {
    upload: () => handleFiles(files, defaultOptions, uploadSingleFile),
    delete: () => handleFiles(files, defaultOptions, deleteSingleFile),
  };
}

/**
 * Handles multiple files using the provided handler function.
 */
async function handleFiles(
  files: FileArray | UploadedFile | UploadedFile[] | null,
  options: UseBucketOptions,
  handler: (file: UploadedFile, options: UseBucketOptions) => Promise<Result>
): Promise<Result> {
  if (!files) return { error: 'No files provided', data: null };

  const fileArray = Array.isArray(files)
    ? files
    : files instanceof UploadedFile
      ? [files]
      : Object.values(files);

  const results = await Promise.all(fileArray.map((file) => handler(file, options)));
  const errors = results.filter((r) => r.error);

  return errors.length
    ? { error: `Some operations failed: ${errors.map((e) => e.error).join(', ')}`, data: null }
    : { error: null, data: results.map((r) => r.data).filter(Boolean) as T[] };
}

/**
 * Uploads a single file to the storage bucket.
 */
async function uploadSingleFile(file: UploadedFile, options: UseBucketOptions): Promise<Result<any>> {
  const { path, timeout } = options;
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const fileName = `${timestamp}-${randomString}-${file.name}`;
  let timer: NodeJS.Timeout | null = null;

  try {
    if (timeout) {
      timer = setTimeout(() => {
        throw new Error('Upload request timed out');
      }, timeout);
    }

    const uploadedFile = await bucket.upload(file.tempFilePath, {
      destination: `${path}/${fileName}`,
      metadata: { contentType: file.mimetype },
    });

    const fileRef = bucket.file(uploadedFile[0].metadata.name);
    const downloadURL = await getDownloadURL(fileRef);

    return {
      error: null,
      data: {
        id: `${timestamp}-${randomString}`,
        url: downloadURL,
        type: file.mimetype,
        name: fileName,
      },
    };
  } catch (error: any) {
    return { error: `Error uploading file ${file.name}: ${error.message}`, data: null };
  } finally {
    if (timer) clearTimeout(timer);
    await cleanupTempFile(file.tempFilePath);
  }
}

/**
 * Deletes a single file from the storage bucket.
 */
async function deleteSingleFile(file: UploadedFile, options: UseBucketOptions): Promise<Result<string>> {
  const { path } = options;

  try {
    const filePath = `${path}/${file.name}`;
    const fileRef = bucket.file(filePath);
    await fileRef.delete();
    return { error: null, data: `File ${filePath} deleted successfully` };
  } catch (error: any) {
    return { error: `Error deleting file ${file.name}: ${error.message}`, data: null };
  }
}

/**
 * Cleans up temporary files.
 */
async function cleanupTempFile(tempFilePath: string) {
  try {
    await fs.unlink(tempFilePath);
  } catch (error: any) {
    console.error(`Error cleaning up temporary file: ${error.message}`);
  }
}
