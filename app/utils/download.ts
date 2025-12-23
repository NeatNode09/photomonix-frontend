/**
 * Download utilities for enhanced images
 */

export interface DownloadOptions {
  filename?: string;
  delay?: number;
}

/**
 * Download a single image
 * @param imageUrl The image URL (data URL or blob URL)
 * @param filename Custom filename (optional)
 */
export function downloadImage(imageUrl: string, filename?: string): void {
  const link = document.createElement("a");
  link.href = imageUrl;
  link.download = filename || `photomonix-${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Download multiple images sequentially
 * @param imageUrls Array of image URLs
 * @param options Download options
 * @returns Promise that resolves when all downloads complete
 */
export async function downloadMultipleImages(
  imageUrls: string[],
  options: DownloadOptions = {}
): Promise<void> {
  const { delay = 500 } = options;

  for (let i = 0; i < imageUrls.length; i++) {
    const filename =
      options.filename || `photomonix-enhanced-${Date.now()}-${i + 1}.png`;

    downloadImage(imageUrls[i], filename);

    // Wait before next download to avoid browser blocking
    if (i < imageUrls.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

/**
 * Create a ZIP file from multiple images (requires JSZip library)
 * Note: This is a placeholder for future ZIP functionality
 * @param imageUrls Array of image URLs
 * @param zipFilename Name of the ZIP file
 */
export async function downloadAsZip(
  imageUrls: string[],
  zipFilename: string = `photomonix-${Date.now()}.zip`
): Promise<void> {
  console.warn(
    "ZIP download not yet implemented. Falling back to sequential download."
  );
  await downloadMultipleImages(imageUrls);
}

/**
 * Convert data URL to Blob
 * @param dataUrl Data URL to convert
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], { type: mime });
}

/**
 * Convert Blob to data URL
 * @param blob Blob to convert
 */
export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Get file size from data URL
 * @param dataUrl Data URL
 * @returns Size in bytes
 */
export function getDataUrlSize(dataUrl: string): number {
  const base64 = dataUrl.split(",")[1];
  const padding = (base64.match(/=/g) || []).length;
  return base64.length * 0.75 - padding;
}

/**
 * Format file size for display
 * @param bytes Size in bytes
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
