export const PHOTOMONIX_CONFIG = {
  SUGGESTION_SERVICE: "http://localhost:8000",
  IMAGE_SERVICE: "http://localhost:8001",
  ENDPOINTS: {
    REFINE: "/refine-image",
    GENERATE: "/image-to-image",
    PROXY_REFINE: "/proxy-refine",
  },
  TIMEOUT: {
    SUGGESTION: 30_000, // 30 seconds for analysis
    GENERATION: 60_000, // 60 seconds for image generation
  },
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FORMATS: ["image/jpeg", "image/png", "image/webp"],
};
