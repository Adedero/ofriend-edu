export function getFileType(url) {
  // Create a list of image and video extensions
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
  const videoExtensions = ['3gp', 'mp4', 'mov', 'wmv', 'flv', 'avi', 'mkv', 'webm', 'mpeg'];

  // Extract the file extension from the URL
  const extension = url.split('?alt')[0].slice(-3).toLowerCase();
  // Check if the extension matches any image or video extension
  if (imageExtensions.includes(extension)) {
    return {
      file: 'image',
      type: `image/${extension}`
    };
  } else if (videoExtensions.includes(extension)) {
    return {
      file: 'video',
      type: `video/${extension}`
    }
  } else {
    return 'unknown';
  }
}