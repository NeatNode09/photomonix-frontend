import { PHOTOMONIX_CONFIG } from "@config/photomonix";
import type {
  SuggestionServiceResponse,
  GenerateImageResponse,
  SelectedOptions,
  PhotomonixError,
} from "@types/photomonix";

/**
 * Calls the Suggestion Service to analyze an image and get AI suggestions.
 */
export async function getEnhancementSuggestions(
  imageFile: File
): Promise<string[]> {
  const formData = new FormData();
  formData.append("file", imageFile);

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    PHOTOMONIX_CONFIG.TIMEOUT.SUGGESTION
  );

  try {
    const response = await fetch(
      `${PHOTOMONIX_CONFIG.SUGGESTION_SERVICE}${PHOTOMONIX_CONFIG.ENDPOINTS.REFINE}`,
      {
        method: "POST",
        body: formData,
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error: PhotomonixError = await response
        .json()
        .catch(() => ({ detail: "Unknown error" }));
      throw new Error(
        error.detail ||
          error.error ||
          `HTTP ${response.status}: Failed to get suggestions`
      );
    }

    const data: SuggestionServiceResponse = await response.json();

    if (!data.enhancement_prompts || !Array.isArray(data.enhancement_prompts)) {
      throw new Error("Invalid response format from suggestion service");
    }

    return data.enhancement_prompts;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error(
          "Request timeout: Image analysis is taking too long. Please try with a smaller image."
        );
      }
      throw error;
    }
    throw new Error("Failed to get enhancement suggestions");
  }
}

/**
 * Calls the Image Service to generate enhanced images.
 */
export async function generateEnhancedImages(
  imageFile: File,
  selectedOptions: SelectedOptions,
  referenceNotes: string = ""
): Promise<GenerateImageResponse> {
  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("selected", JSON.stringify(selectedOptions));
  formData.append("reference_notes", referenceNotes);

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    PHOTOMONIX_CONFIG.TIMEOUT.GENERATION
  );

  try {
    const response = await fetch(
      `${PHOTOMONIX_CONFIG.IMAGE_SERVICE}${PHOTOMONIX_CONFIG.ENDPOINTS.GENERATE}`,
      {
        method: "POST",
        body: formData,
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error: PhotomonixError = await response
        .json()
        .catch(() => ({ detail: "Unknown error" }));
      throw new Error(
        error.detail ||
          error.error ||
          `HTTP ${response.status}: Failed to generate images`
      );
    }

    const data: GenerateImageResponse = await response.json();

    if ((data as PhotomonixError).error) {
      throw new Error((data as PhotomonixError).error);
    }

    if (!data.images || !Array.isArray(data.images)) {
      throw new Error("Invalid response format from image service");
    }

    return {
      ...data,
      images: data.images.map((base64) => `data:image/png;base64,${base64}`),
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error(
          "Request timeout: Image generation is taking too long. Please try again or use a simpler enhancement."
        );
      }
      throw error;
    }
    throw new Error("Failed to generate enhanced images");
  }
}

/**
 * Retry wrapper for API calls (retries on non-4xx errors).
 */
export async function callWithRetry<T>(
  apiFunction: () => Promise<T>,
  maxRetries: number = 2
): Promise<T> {
  let lastError: Error | undefined;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await apiFunction();
    } catch (error) {
      lastError = error as Error;

      // Do not retry for client errors or timeouts
      if (
        error instanceof Error &&
        (error.message.includes("4") ||
          error.message.toLowerCase().includes("timeout"))
      ) {
        throw error;
      }

      if (i < maxRetries) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(2, i))
        );
      }
    }
  }

  throw lastError ?? new Error("Unknown error after retries");
}
