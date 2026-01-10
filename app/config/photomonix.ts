export const PHOTOMONIX_CONFIG = {
  SUGGESTION_SERVICE:
    import.meta.env.VITE_SUGGESTION_SERVICE_URL || "http://localhost:8000",
  IMAGE_SERVICE:
    import.meta.env.VITE_GENERATION_SERVICE_URL || "http://localhost:8001",
  AUTH_SERVICE: import.meta.env.VITE_API_URL || "http://localhost:5000",
  ENDPOINTS: {
    REFINE: "/refine-image",
    GENERATE: "/image-to-image",
    PROXY_REFINE: "/proxy-refine",
    HEALTH: "/",
    TOKEN_TRACKING: "/api/users/tokens",
  },
  TIMEOUT: {
    SUGGESTION: 30_000, // 30 seconds for analysis
    GENERATION: 60_000, // 60 seconds for image generation
  },
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FORMATS: ["image/jpeg", "image/png", "image/webp"],
};
