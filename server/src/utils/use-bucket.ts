import fs from 'node:fs/promises';
import { getDownloadURL } from 'firebase-admin/storage';
import bucket from '../config/firebase-admin.config';
import type { FileArray, UploadedFile } from 'express-fileupload';
import { generateRandomPin } from './pin-generator';
import logger from '../config/winston.config';

interface UseBucketOptions {
  path?: string;
  timeout?: number;
};

export interface FileData {
  id: string;
  name: string;
  url: string;
  mimetype: string;
}

interface Result<T> {
  error: string | null;
  data: T | null;
}

const useBucket = (
  filesOrFileArray: UploadedFile[] | FileArray,
  options: UseBucketOptions
) => {
  const defaultOptions: UseBucketOptions = {
    path: '',
    timeout: 60 * 1000,
    ...options
  };

  let fileArray : UploadedFile[] = filesOrFileArray as UploadedFile[];
  if (!Array.isArray(filesOrFileArray)) {
    fileArray = Object.keys(filesOrFileArray).map(key => filesOrFileArray[key]).flat();
  }

  return {
    upload: async () => await uploadMultipleFiles(fileArray, defaultOptions),
    delete: async () => await deleteMultipleFiles(fileArray, defaultOptions)
  };
};

async function uploadSingleFile(file: UploadedFile, options: UseBucketOptions): Promise<Result<FileData>> {
  const { path, timeout } = options;
  const timestamp = Date.now();
  const randomString = generateRandomPin(6, 'alpha');
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

    const fileRef = bucket?.file(uploadedFile[0].metadata.name ?? '');
    const downloadURL = await getDownloadURL(fileRef);

    return {
      error: null,
      data: {
        id: `${timestamp}-${randomString}`,
        url: downloadURL,
        mimetype: file.mimetype,
        name: fileName,
      },
    };
  } catch (error) {
    console.error(`Error uploading file ${file.name}:`, (error as Error).message);
    return { error: `Error uploading file ${file.name}: ${(error as Error).message}`, data: null };
  } finally {
    if (timer) clearTimeout(timer);
    await cleanupTempFile(file.tempFilePath);
  }
}

async function uploadMultipleFiles(files: UploadedFile[], options: UseBucketOptions): Promise<Result<FileData[]>> {
  try {
    if (!files.length) {
      throw new Error('No files provided');
    }

    const uploadPromises = files.map(file => uploadSingleFile(file, options));
    const results = await Promise.all(uploadPromises);

    const data: FileData[] = results.map(result => result.data).filter(Boolean) as FileData[];

    return {
      error: null,
      data,
    };
  } catch (error) {
    console.error("Error uploading files:", (error as Error).message);
    return { error: `Error uploading files: ${(error as Error).message}`, data: null };
  }
}


async function cleanupTempFile(tempFilePath: string) {
  try {
    await fs.unlink(tempFilePath);
  } catch (error) {
    logger.error(`Error cleaning up temporary file: ${(error as Error).message}`);
  }
}

async function deleteSingleFile(file: UploadedFile, options: UseBucketOptions): Promise<Result<null>> {
  const { path, timeout } = options;
  let timer: NodeJS.Timeout | null = null;

  try {
    if (timeout) {
      timer = setTimeout(() => {
        throw new Error('Delete request timed out');
      }, timeout);
    }

    const filePath = `${path}/${file.name}`;
    const fileRef = bucket.file(filePath);
    await fileRef.delete();
    return { error: null, data: null };
  } catch (error) {
    console.error((error as Error).message);
    return { error: (error as Error).message, data: null };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function deleteMultipleFiles(files: UploadedFile[], options: UseBucketOptions): Promise<Result<null>> {
  try {
    if (!files.length) {
      throw new Error('No files provided');
    }
    const deletePromises = files.map(file => deleteSingleFile(file, options));
    await Promise.all(deletePromises);
    return {
      error: null,
      data: null
    };
  } catch (error) {
    console.error((error as Error).message);
    return { error: (error as Error).message, data: null };
  }
}

export default useBucket;
