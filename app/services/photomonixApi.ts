import { PHOTOMONIX_CONFIG } from "@config/photomonix";
import type {
  SuggestionServiceResponse,
  GenerateImageResponse,
  SelectedOptions,
  PhotomonixError,
  TokenTrackingResponse,
  ServiceHealthResponse,
} from "~/types/photomonix";
import { compressImage } from "@utils/imageUtils";
import { requestQueue } from "@utils/requestQueue";

/**
 * Calls the Suggestion Service to analyze an image and get AI suggestions.
 * Returns categorized suggestions (Background, Lighting, Style, etc.)
 */
export async function getEnhancementSuggestions(
  imageFile: File
): Promise<SuggestionServiceResponse> {
  // Compress image before sending to reduce upload time
  const compressedFile = await compressImage(imageFile, 1920, 0.9);

  const formData = new FormData();
  formData.append("file", compressedFile);

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

    // Validate response structure
    if (!data.Background || !data.Lighting || !data.Style) {
      throw new Error("Invalid response format from suggestion service");
    }

    return data;
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
  referenceNotes: string = "",
  onProgress?: (progress: number) => void
): Promise<GenerateImageResponse> {
  // Compress image before sending
  const compressedFile = await compressImage(imageFile, 1920, 0.9);

  // Sanitize selected options: remove empty strings and empty categories
  const selectedClean: SelectedOptions = Object.entries(selectedOptions).reduce(
    (acc, [key, values]) => {
      const cleaned = Array.isArray(values)
        ? values.filter((v) => typeof v === "string" && v.trim().length > 0)
        : [];
      if (cleaned.length > 0) {
        acc[key] = cleaned;
      }
      return acc;
    },
    {} as SelectedOptions
  );

  const formData = new FormData();
  formData.append("file", compressedFile);
  formData.append("selected", JSON.stringify(selectedClean));
  if (referenceNotes && referenceNotes.trim().length > 0) {
    formData.append("reference_notes", referenceNotes.trim());
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    PHOTOMONIX_CONFIG.TIMEOUT.GENERATION
  );

  // Simulate progressive loading
  const startTime = Date.now();
  const progressInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const estimatedTotal = 45000; // 45 seconds average
    const progress = Math.min(95, (elapsed / estimatedTotal) * 100);
    onProgress?.(progress);
  }, 2000);

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
    clearInterval(progressInterval);
    onProgress?.(100);

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
    clearInterval(progressInterval);
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
 * Retry wrapper for API calls (retries on 5xx errors and network failures).
 * Does not retry on 4xx client errors.
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

      // Do not retry for client errors (4xx)
      // Extract HTTP status from error message like "HTTP 400: ..."
      const statusMatch =
        error instanceof Error && error.message.match(/HTTP (\d{3})/);
      const statusCode = statusMatch ? parseInt(statusMatch[1]) : 0;

      // Skip retry for 4xx errors (client errors)
      if (statusCode >= 400 && statusCode < 500) {
        throw error;
      }

      // Do not retry timeout errors (user should adjust their request)
      if (
        error instanceof Error &&
        error.message.toLowerCase().includes("timeout")
      ) {
        throw error;
      }

      // Retry for 5xx errors and network failures
      if (i < maxRetries) {
        const delay = 1000 * Math.pow(2, i); // Exponential backoff: 1s, 2s, 4s
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError ?? new Error("Unknown error after retries");
}

/**
 * Check health status of AI services
 */
export async function checkServiceHealth(): Promise<{
  suggestion: ServiceHealthResponse;
  generation: ServiceHealthResponse;
}> {
  try {
    const [suggestionRes, generationRes] = await Promise.allSettled([
      fetch(
        `${PHOTOMONIX_CONFIG.SUGGESTION_SERVICE}${PHOTOMONIX_CONFIG.ENDPOINTS.HEALTH}`
      ),
      fetch(
        `${PHOTOMONIX_CONFIG.IMAGE_SERVICE}${PHOTOMONIX_CONFIG.ENDPOINTS.HEALTH}`
      ),
    ]);

    const suggestionHealth: ServiceHealthResponse = {
      status:
        suggestionRes.status === "fulfilled" && suggestionRes.value.ok
          ? "healthy"
          : "offline",
      service: "Suggestion Service",
      timestamp: new Date().toISOString(),
    };

    const generationHealth: ServiceHealthResponse = {
      status:
        generationRes.status === "fulfilled" && generationRes.value.ok
          ? "healthy"
          : "offline",
      service: "Generation Service",
      timestamp: new Date().toISOString(),
    };

    return {
      suggestion: suggestionHealth,
      generation: generationHealth,
    };
  } catch (error) {
    throw new Error("Failed to check service health");
  }
}

/**
 * Track token usage after AI generation
 */
export async function trackTokenUsage(
  tokensUsed: number,
  accessToken: string
): Promise<TokenTrackingResponse> {
  try {
    const response = await fetch(
      `${PHOTOMONIX_CONFIG.AUTH_SERVICE}${PHOTOMONIX_CONFIG.ENDPOINTS.TOKEN_TRACKING}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ tokens_used: tokensUsed }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to track tokens`);
    }

    return await response.json();
  } catch (error) {
    console.error("Token tracking failed:", error);
    // Don't throw - token tracking is non-critical
    return {
      tokens_used: tokensUsed,
      tokens_remaining: 0,
      total_tokens: 0,
    };
  }
}

/**
 * Queue-wrapped version of getEnhancementSuggestions
 * Ensures only one request at a time
 */
export async function getEnhancementSuggestionsQueued(
  imageFile: File
): Promise<SuggestionServiceResponse> {
  return requestQueue.enqueue(() => getEnhancementSuggestions(imageFile));
}

/**
 * Queue-wrapped version of generateEnhancedImages
 * Ensures only one request at a time
 */
export async function generateEnhancedImagesQueued(
  imageFile: File,
  selectedOptions: SelectedOptions,
  referenceNotes: string = "",
  onProgress?: (progress: number) => void
): Promise<GenerateImageResponse> {
  return requestQueue.enqueue(() =>
    generateEnhancedImages(
      imageFile,
      selectedOptions,
      referenceNotes,
      onProgress
    )
  );
}
