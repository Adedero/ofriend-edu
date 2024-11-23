const loadMedia = (file: File): Promise<{ file: File; data: { url: string, width: number, height: number } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileUrl = e.target?.result as string;

      let el: HTMLImageElement | HTMLVideoElement | null = null;

      // Handle image type
      if (file.type.includes('image')) {
        el = new Image();
        el.onload = () => {
          resolve({ file, data: { url: fileUrl, width: (el as HTMLImageElement).width, height:  (el as HTMLImageElement).height } });
        };
      }

      // Handle video type
      if (file.type.includes('video')) {
        el = document.createElement('video');
        el.onloadeddata = () => {
          resolve({ file, data: { url: fileUrl, width: (el as HTMLVideoElement).width, height: (el as HTMLVideoElement).height } });
        };
      }

      // Check for unsupported file type
      if (!el) {
        reject(new Error('Unsupported file type'));
        return;
      }

      el.onerror = () => {
        reject(new Error('Failed to load the file'));
      };

      el.src = fileUrl; // Trigger loading of image/video
    };

    reader.onerror = () => {
      reject(new Error('Failed to read the file'));
    };

    reader.readAsDataURL(file); // Read the file as a Data URL
  });
};

export default loadMedia;
