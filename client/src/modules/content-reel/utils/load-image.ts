const loadImage = (file: File): Promise<{ file: File; data: { url: string, width: number, height: number } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileUrl = e.target?.result as string;
      const img = new Image(); // Use an Image object for better control

      img.onload = () => {
        resolve({ file, data: { url: fileUrl, width: img.width, height: img.height } });
      };

      img.onerror = reject; // Reject if the image fails to load
      img.src = fileUrl;  // Trigger image loading
    };

    reader.onerror = reject; // Reject if the file read fails
    reader.readAsDataURL(file);
  });
};

export default loadImage;
