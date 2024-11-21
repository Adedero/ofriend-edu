const fs = require('node:fs/promises');
const { getDownloadURL } = require('firebase-admin/storage');
const bucket = require('../config/firebase-admin.config');

// Upload multiple files
async function uploadMultipleFiles(files, options = {}) {
  options = {
    path: "",
    timeout: 1000 * 60,
    ...options
  }

  let fileArray;
  if (Array.isArray(files)) fileArray = [...files];
  else fileArray = Object.keys(files).map(key => files[key]);

  if (!fileArray) {
    throw new Error("No files were provided.")
  }

  try {
    const uploadPromises = fileArray.map(file => uploadSingleFile(file, options));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Error uploading files:", error.message);
    throw new Error(`Error uploading files: ${error.message}`);
  }
}

// Upload a single file
async function uploadSingleFile(file, options = {}) {
  options = {
    path: "",
    timeout: 1000 * 60,
    ...options
  }
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const fileName = `${timestamp}-${randomString}-${file.name}`;

  const timeout = options.timeout;
  if (typeof timeout !== 'number') timeout = 0;
  let timer;

  try {
    if (timeout) {
      timer = setTimeout(() => {
        throw new Error("The request took too long to complete.");
      }, timeout);
    }

    const uploadedFile = await bucket.upload(file.tempFilePath, {
      destination: `${options.path}/${fileName}`,
      metadata: {
        contentType: file.mimetype
      }
    });

    const fileRef = bucket.file(uploadedFile[0].metadata.name);
    const downloadURL = await getDownloadURL(fileRef);

    return {
      id: `${timestamp}-${randomString}`,
      url: downloadURL,
      type: file.mimetype,
      name: fileName,
    };
  } catch (error) {
    console.error(`Error uploading file ${file.name}: ${error.message}`);
    throw new Error(`Error uploading file ${file.name}: ${error.message}`);
  } finally {
    if (timer) clearTimeout(timer);
    // Cleanup the temp file
    await fs.unlink(file.tempFilePath).catch(err => console.error(`Error deleting file from disk: ${err.message}`));
  }
}


// Delete multiple files
async function deleteMultipleFiles(files = [], options = {}) {
  options = {
    path: "",
    useURL: false,
    timeout: 1000 * 60,
    ...options
  }
  if (!options.useURL && !options.path) {
    throw new Error("File path must be specified when not using a URL");
  }

  try {
    const deletePromises = files.map(file => deleteSingleFile(file, options));
    return await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error deleting files:", error.message);
    throw new Error(`Error deleting files: ${error.message}`);
  }
}

// Delete a single file
async function deleteSingleFile(file, options = {}) {
  options = {
    path: "",
    useURL: false,
    timeout: 1000 * 60,
    ...options
  }
  if (!options.useURL && !options.path) {
    throw new Error("File path must be specified when not using a URL");
  }

  const timeout = options.timeout;
  if (typeof timeout !== 'number') timeout = 0;
  let timer;

  try {
    if (timeout) {
      timer = setTimeout(() => {
        throw new Error("The request took too long to complete.");
      }, timeout);
    }

    let filePath;
    if (options.useURL) {
      const fileUrl = new URL(file.url || file);
      filePath = decodeURIComponent(fileUrl.pathname.split('/o/')[1].split('?')[0]);
    } else {
      filePath = `${options.path}/${file.name}`;
    }

    const fileRef = bucket.file(filePath);
    await fileRef.delete();
    console.log(`File ${filePath} deleted successfully.`);
  } catch (err) {
    console.error(`Error deleting file: ${err.message}`);
    throw new Error(`Error deleting file: ${err.message}`);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

module.exports = { uploadMultipleFiles, uploadSingleFile, deleteMultipleFiles, deleteSingleFile };