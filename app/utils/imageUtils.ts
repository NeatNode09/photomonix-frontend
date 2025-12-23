import { PHOTOMONIX_CONFIG } from "../config/photomonix";

// Validates an image file against type and size constraints.
export function isValidImageFile(file: File | null): {
  isValid: boolean;
  error: string | null;
} {
  if (!file) {
    return { isValid: false, error: "No file provided" };
  }

  if (!PHOTOMONIX_CONFIG.SUPPORTED_FORMATS.includes(file.type)) {
    return {
      isValid: false,
      error: "Invalid file type. Please upload JPEG, PNG, or WebP images.",
    };
  }

  if (file.size > PHOTOMONIX_CONFIG.MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File too large. Maximum size is ${PHOTOMONIX_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB.`,
    };
  }

  return { isValid: true, error: null };
}

// Compresses an image using canvas before upload.
export async function compressImage(
  file: File,
  maxWidth: number = 1920,
  quality: number = 0.9
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to compress image"));
              return;
            }
            resolve(new File([blob], file.name, { type: "image/jpeg" }));
          },
          "image/jpeg",
          quality
        );
      };

      img.onerror = () => reject(new Error("Failed to load image"));
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
  });
}

// Generates a SHA-256 hash for a file (for caching).
export async function hashFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Converts a File to base64 (without data URL prefix).
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}
