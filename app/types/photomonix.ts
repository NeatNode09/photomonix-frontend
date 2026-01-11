/** Response from Suggestion Service (Port 8000) - Categorized suggestions */
export interface SuggestionServiceResponse {
  Background: string[];
  Lighting: string[];
  Style: string[];
  Composition: string[];
  Focus: string[];
  Props: string[];
  Angles: string[];
  debug_caption?: string;
}

/** Category keys for type safety */
export type EnhancementCategory =
  | "Background"
  | "Lighting"
  | "Style"
  | "Composition"
  | "Focus"
  | "Props"
  | "Angles";

/** Categorized suggestions for UI rendering */
export interface CategorizedSuggestions {
  [K in EnhancementCategory]: string[];
}

/** Selected enhancement options structure */
export interface SelectedOptions {
  [category: string]: string[];
}

/** Response from Image Service (Port 8001) */
export interface GenerateImageResponse {
  images: string[]; // Base64 strings
  prompt_used: string;
  enh_text: string; // Formatted enhancement text
  error?: string; // Optional error field from backend
}

/** Error response shape */
export interface PhotomonixError {
  detail?: string;
  error?: string;
  message?: string;
}

/** Image upload state */
export interface ImageUploadState {
  file: File | null;
  preview: string | null;
  isValid: boolean;
  error: string | null;
}

/** Enhancement workflow state */
export interface EnhancementState {
  currentStep: "upload" | "analyze" | "enhance" | "results";
  suggestions: string[];
  selectedOptions: SelectedOptions;
  referenceNotes: string;
  enhancedImages: string[];
  loading: boolean;
  error: string | null;
}

/** API call config */
export interface ApiCallConfig {
  timeout?: number;
  retries?: number;
  onProgress?: (progress: number) => void;
}

/** Token tracking response */
export interface TokenTrackingResponse {
  tokens_used: number;
  tokens_remaining: number;
  total_tokens: number;
}

/** Service health check response */
export interface ServiceHealthResponse {
  status: "healthy" | "degraded" | "offline";
  service: string;
  timestamp: string;
}
