# PhotoMonix Backend Integration - Complete Implementation Guide

**Document Version:** 1.0  
**Date:** December 21, 2025  
**Project:** PhotoMonix AI Image Enhancement Platform  
**Estimated Timeline:** 15-20 hours

---

## 📋 Table of Contents

1. [Project Analysis & Current State](#project-analysis--current-state)
2. [Implementation Plan Overview](#implementation-plan-overview)
3. [Detailed Step-by-Step Procedure](#detailed-step-by-step-procedure)
4. [File Structure](#file-structure)
5. [Integration Points](#integration-points)
6. [Testing Plan](#testing-plan)
7. [Deployment Checklist](#deployment-checklist)
8. [Troubleshooting Guide](#troubleshooting-guide)

---

## 📊 Project Analysis & Current State

### ✅ What You Already Have:

- **React Router v7** with TypeScript configuration
- **Tailwind CSS v4** configured and working
- **Basic routing structure**:
  - `home.tsx` - Landing page with upload UI
  - `edit.tsx` - Enhancement page (currently with mock data)
  - Auth-related routes (login, register, profile, etc.)
- **Auth service layer** (`app/services/api.ts`) for authentication
- **Component structure**:
  - `Navbar.tsx`
  - `Footer.tsx`
  - `ProtectedRoute.tsx`
- **File upload UI** in home.tsx with drag-and-drop functionality
- **Mock AI analysis UI** in edit.tsx (needs backend integration)
- **Vite dev server** configured on port 3000

### ❌ What's Missing:

- PhotoMonix-specific API service layer for image enhancement
- Integration with backend services (Port 8000 & 8001)
- Enhancement categories constants matching backend
- Proper TypeScript types for backend responses
- State management for image enhancement workflow
- Error handling for AI operations
- Loading states for long-running operations (10-20 seconds)
- Image compression utilities
- Caching mechanism for suggestions
- Download functionality for enhanced images

---

## 🎯 Implementation Plan Overview

### Phase Breakdown:

| Phase       | Description               | Time Estimate   |
| ----------- | ------------------------- | --------------- |
| **Phase 1** | Setup & Configuration     | 1-2 hours       |
| **Phase 2** | API Services & Utilities  | 2-3 hours       |
| **Phase 3** | UI Components Integration | 3-4 hours       |
| **Phase 4** | Error & Loading States    | 2 hours         |
| **Phase 5** | Styling & Polish          | 2 hours         |
| **Phase 6** | Optimization & Caching    | 1-2 hours       |
| **Phase 7** | Testing & QA              | 2-3 hours       |
| **Phase 8** | Documentation             | 1 hour          |
| **TOTAL**   |                           | **15-20 hours** |

---

## 🔧 Detailed Step-by-Step Procedure

### **STEP 1: Environment Configuration**

**Objective:** Set up API endpoints and environment variables

**Files to Create:**

- `app/config/photomonix.ts`

**Implementation:**

```typescript
// app/config/photomonix.ts
export const PHOTOMONIX_CONFIG = {
  SUGGESTION_SERVICE: "http://localhost:8000",
  IMAGE_SERVICE: "http://localhost:8001",
  ENDPOINTS: {
    REFINE: "/refine-image",
    GENERATE: "/image-to-image",
    PROXY_REFINE: "/proxy-refine",
  },
  TIMEOUT: {
    SUGGESTION: 30000, // 30 seconds for analysis
    GENERATION: 60000, // 60 seconds for image generation
  },
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FORMATS: ["image/jpeg", "image/png", "image/webp"],
};
```

**Validation Criteria:**

- ✅ Config file exports all necessary endpoints
- ✅ Timeout values match backend expectations
- ✅ File size limits defined

---

### **STEP 2: Define Enhancement Categories Constants**

**Objective:** Create exact category mappings matching backend SHORT_LABELS

**Files to Create:**

- `app/constants/enhancements.ts`

**Implementation:**

```typescript
// app/constants/enhancements.ts

/**
 * Complete list of available enhancement categories and options
 * CRITICAL: These exact strings must match backend's SHORT_LABELS mapping
 */
export const ENHANCEMENT_CATEGORIES = {
  Background: [
    "Pure white background (255,255,255)",
    "Solid color background",
    "Gradient background",
    "Transparent background",
    "Lifestyle background",
    "Studio background",
    "Shadow type (soft, drop, none)",
  ],

  Lighting: [
    "Soft box lighting",
    "Directional lighting",
    "Diffused lighting",
    "High-key lighting (bright)",
    "Low-key lighting (dramatic)",
    "Natural daylight style",
    "Highlight on edges",
    "Reflective control (for shiny objects)",
  ],

  Style: [
    "Minimalist clean style",
    "Premium glossy style",
    "Matte professional style",
    "Realistic product rendering",
    "Consistent brand aesthetic",
    "Color matching",
    "Exposure balance",
    "Contrast & sharpness tuning",
    "Retouching / cleanup (dust removal, scratch removal)",
  ],

  Composition: [
    "Front view",
    "45-degree angle",
    "Top view",
    "Side view",
    "Macro close-up",
    "In-hand view",
    "Floating product",
    "Center alignment",
    "Proper margins",
    "Rule of thirds",
  ],

  Focus: [
    "Edge sharpening",
    "Texture enhancement",
    "True-color accuracy",
    "Highlighting material (metal, plastic, fabric, wood, etc.)",
    "Removing noise",
    "Correcting distortions",
    "Label visibility",
    "Logo clarity",
    "Important feature focus (buttons, flame, texture, mechanism)",
  ],
};

/**
 * Get all category names
 */
export const getCategoryNames = (): string[] =>
  Object.keys(ENHANCEMENT_CATEGORIES);

/**
 * Get options for a specific category
 */
export const getCategoryOptions = (category: string): string[] =>
  ENHANCEMENT_CATEGORIES[category as keyof typeof ENHANCEMENT_CATEGORIES] || [];

/**
 * Get total number of options across all categories
 */
export const getTotalOptions = (): number =>
  Object.values(ENHANCEMENT_CATEGORIES).reduce(
    (sum, options) => sum + options.length,
    0
  );
```

**Validation Criteria:**

- ✅ All 5 categories defined: Background, Lighting, Style, Composition, Focus
- ✅ Exact string matches with backend labels
- ✅ Helper functions exported

---

### **STEP 3: Create TypeScript Type Definitions**

**Objective:** Type safety for all backend communication

**Files to Create:**

- `app/types/photomonix.ts`

**Implementation:**

```typescript
// app/types/photomonix.ts

/**
 * Response from Suggestion Service (Port 8000)
 */
export interface SuggestionServiceResponse {
  enhancement_prompts: string[];
}

/**
 * Selected enhancement options structure
 * Example: { "Background": ["Pure white background"], "Lighting": ["Soft box"] }
 */
export interface SelectedOptions {
  [category: string]: string[];
}

/**
 * Response from Image Service (Port 8001)
 */
export interface GenerateImageResponse {
  images: string[]; // Base64 encoded images
  prompt_used: string;
  enh_text: string; // Formatted enhancement text
}

/**
 * Error response structure from backend
 */
export interface PhotomonixError {
  detail?: string;
  error?: string;
  message?: string;
}

/**
 * Image upload state
 */
export interface ImageUploadState {
  file: File | null;
  preview: string | null;
  isValid: boolean;
  error: string | null;
}

/**
 * Enhancement workflow state
 */
export interface EnhancementState {
  currentStep: "upload" | "analyze" | "enhance" | "results";
  suggestions: string[];
  selectedOptions: SelectedOptions;
  referenceNotes: string;
  enhancedImages: string[];
  loading: boolean;
  error: string | null;
}

/**
 * API call configuration
 */
export interface ApiCallConfig {
  timeout?: number;
  retries?: number;
  onProgress?: (progress: number) => void;
}
```

**Validation Criteria:**

- ✅ All backend response types defined
- ✅ State management types created
- ✅ Error types included

---

### **STEP 4: Build API Service Layer**

**Objective:** Create service functions for backend communication

**Files to Create:**

- `app/services/photomonixApi.ts`

**Implementation:**

```typescript
// app/services/photomonixApi.ts

import { PHOTOMONIX_CONFIG } from "../config/photomonix";
import type {
  SuggestionServiceResponse,
  GenerateImageResponse,
  SelectedOptions,
  PhotomonixError,
} from "../types/photomonix";

/**
 * Calls the Suggestion Service to analyze an image and get AI suggestions
 * @param imageFile - The image file to analyze
 * @returns Promise<string[]> Array of 5 enhancement suggestions
 * @throws Error if request fails
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
 * Calls the Image Service to generate enhanced images
 * @param imageFile - Original image file
 * @param selectedOptions - Selected enhancement categories
 * @param referenceNotes - Additional context/notes (optional)
 * @returns Promise<GenerateImageResponse> Generated images and metadata
 * @throws Error if request fails
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

    // Handle error in response body
    if ("error" in data) {
      throw new Error(data.error as unknown as string);
    }

    if (!data.images || !Array.isArray(data.images)) {
      throw new Error("Invalid response format from image service");
    }

    // Convert base64 to data URLs for display
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
 * Retry wrapper for API calls
 */
export async function callWithRetry<T>(
  apiFunction: () => Promise<T>,
  maxRetries: number = 2
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await apiFunction();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on client errors (4xx) or timeout
      if (
        error instanceof Error &&
        (error.message.includes("4") || error.message.includes("timeout"))
      ) {
        throw error;
      }

      // Exponential backoff
      if (i < maxRetries) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(2, i))
        );
      }
    }
  }

  throw lastError!;
}
```

**Validation Criteria:**

- ✅ Both API functions implemented
- ✅ Timeout handling with AbortController
- ✅ Error handling and user-friendly messages
- ✅ Response validation
- ✅ Retry logic for transient failures

---

### **STEP 5: Create Utility Functions**

**Objective:** Helper functions for image processing and validation

**Files to Create:**

- `app/utils/imageUtils.ts`
- `app/utils/validation.ts`

**Implementation:**

```typescript
// app/utils/imageUtils.ts

import { PHOTOMONIX_CONFIG } from "../config/photomonix";

/**
 * Validate image file
 */
export function isValidImageFile(file: File): {
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
      error: `File too large. Maximum size is ${
        PHOTOMONIX_CONFIG.MAX_FILE_SIZE / (1024 * 1024)
      }MB.`,
    };
  }

  return { isValid: true, error: null };
}

/**
 * Compress image before upload
 */
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

        // Resize if needed
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

/**
 * Generate hash for file caching
 */
export async function hashFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Convert File to base64
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}
```

```typescript
// app/utils/validation.ts

import type { SelectedOptions } from "../types/photomonix";
import { ENHANCEMENT_CATEGORIES } from "../constants/enhancements";

/**
 * Sanitize user input (reference notes)
 */
export function sanitizeReferenceNotes(text: string): string {
  return text
    .trim()
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .substring(0, 1000); // Enforce max length
}

/**
 * Validate selected options structure
 */
export function validateSelectedOptions(selectedOptions: SelectedOptions): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (typeof selectedOptions !== "object" || selectedOptions === null) {
    errors.push("Selected options must be an object");
    return { isValid: false, errors };
  }

  for (const [category, options] of Object.entries(selectedOptions)) {
    if (!Array.isArray(options)) {
      errors.push(`Options for ${category} must be an array`);
      continue;
    }

    if (!(category in ENHANCEMENT_CATEGORIES)) {
      errors.push(`Invalid category: ${category}`);
      continue;
    }

    const validOptions =
      ENHANCEMENT_CATEGORIES[category as keyof typeof ENHANCEMENT_CATEGORIES];
    for (const option of options) {
      if (!validOptions.includes(option)) {
        errors.push(`Invalid option "${option}" for category ${category}`);
      }
    }
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validate complete generation request
 */
export function validateGenerationRequest(
  imageFile: File | null,
  selectedOptions: SelectedOptions,
  referenceNotes: string
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate image file
  if (!imageFile) {
    errors.push("Image file is required");
  }

  // Validate selected options
  const optionsValidation = validateSelectedOptions(selectedOptions);
  if (!optionsValidation.isValid) {
    errors.push(...optionsValidation.errors);
  }

  // Validate reference notes length
  if (referenceNotes && referenceNotes.length > 1000) {
    errors.push("Reference notes must be less than 1000 characters");
  }

  return { isValid: errors.length === 0, errors };
}
```

**Validation Criteria:**

- ✅ File validation function
- ✅ Image compression utility
- ✅ Input sanitization
- ✅ Hash function for caching
- ✅ Selected options validation

---

### **STEP 6: Update Home Route for Image Upload**

**Objective:** Integrate backend analysis on image upload

**Files to Modify:**

- `app/routes/home.tsx`

**Key Changes:**

1. Import PhotoMonix API service
2. Add file validation before upload
3. Call `getEnhancementSuggestions()` on upload
4. Navigate to edit route with data
5. Add loading and error states

**Modification Points:**

```typescript
// Add imports
import { getEnhancementSuggestions } from "../services/photomonixApi";
import { isValidImageFile } from "../utils/imageUtils";
import { useNavigate } from "react-router";

// Add state for loading and error
const [isAnalyzing, setIsAnalyzing] = useState(false);
const [error, setError] = useState<string | null>(null);

// Modify file upload handler
const handleFileSelect = async (file: File) => {
  // Validate
  const validation = isValidImageFile(file);
  if (!validation.isValid) {
    setError(validation.error);
    return;
  }

  setError(null);
  setIsAnalyzing(true);

  try {
    // Call backend
    const suggestions = await getEnhancementSuggestions(file);

    // Navigate to edit with data
    navigate("/edit", {
      state: {
        imageFile: file,
        suggestions,
      },
    });
  } catch (err) {
    setError(err instanceof Error ? err.message : "Failed to analyze image");
  } finally {
    setIsAnalyzing(false);
  }
};
```

**Validation Criteria:**

- ✅ File validation before upload
- ✅ Backend API called on file select
- ✅ Loading state displayed during analysis
- ✅ Error messages shown to user
- ✅ Navigation with state to edit route

---

### **STEP 7: Create Image Enhancement Component**

**Objective:** Build the main enhancement workflow UI

**Files to Create:**

- `app/components/ImageEnhancer.tsx`

**Implementation:** (See detailed code in copilot-instructions.md Step 4)

**Key Features:**

- Image preview
- AI suggestions display (clickable)
- Enhancement category checkboxes
- Reference notes textarea
- Generate button
- Results display with download

**Component Structure:**

```typescript
export function ImageEnhancer({ imageFile, suggestions }: Props) {
  // State management
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [referenceNotes, setReferenceNotes] = useState(suggestions[0] || "");
  const [enhancedImages, setEnhancedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handlers
  const toggleOption = (category: string, option: string) => { ... };
  const handleGenerate = async () => { ... };
  const handleDownload = (imageUrl: string, index: number) => { ... };

  // Render phases
  return (
    <div>
      {/* Phase 1: Image Preview */}
      {/* Phase 2: Suggestions */}
      {/* Phase 3: Enhancement Options */}
      {/* Phase 4: Results */}
    </div>
  );
}
```

**Validation Criteria:**

- ✅ All 4 phases rendered correctly
- ✅ State management works
- ✅ API integration functional
- ✅ Download functionality works

---

### **STEP 8: Refactor Edit Route**

**Objective:** Replace mock data with real backend integration

**Files to Modify:**

- `app/routes/edit.tsx`

**Key Changes:**

1. Remove all mock data
2. Get image and suggestions from location state
3. Integrate ImageEnhancer component
4. Handle missing data (redirect to home)

**Implementation:**

```typescript
import { ImageEnhancer } from "../components/ImageEnhancer";
import { useLocation, useNavigate } from "react-router";

export default function Edit() {
  const location = useLocation();
  const navigate = useNavigate();

  const { imageFile, suggestions } = location.state || {};

  useEffect(() => {
    if (!imageFile || !suggestions) {
      navigate("/");
    }
  }, [imageFile, suggestions, navigate]);

  if (!imageFile || !suggestions) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="pt-20 px-4">
        <ImageEnhancer imageFile={imageFile} suggestions={suggestions} />
      </div>
    </div>
  );
}
```

**Validation Criteria:**

- ✅ Mock data removed
- ✅ Real backend integration
- ✅ Proper error handling
- ✅ Redirect if no data

---

### **STEP 9: Add Error Handling & User Feedback**

**Objective:** Robust error handling throughout the app

**Files to Create:**

- `app/components/Toast.tsx`
- `app/hooks/useToast.ts`
- `app/components/ErrorBoundary.tsx`

**Implementation:**

```typescript
// app/hooks/useToast.ts
import { useState, useCallback } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType = "info", duration = 5000) => {
      const id = Math.random().toString(36).substr(2, 9);
      const toast: Toast = { id, message, type };

      setToasts((prev) => [...prev, toast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
}
```

```typescript
// app/components/Toast.tsx
interface ToastProps {
  message: string;
  type: "success" | "error" | "info" | "warning";
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    warning: "bg-yellow-500",
  }[type];

  return (
    <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3`}>
      <p className="flex-1">{message}</p>
      <button onClick={onClose} className="text-white/80 hover:text-white">
        ✕
      </button>
    </div>
  );
}
```

**User-Friendly Error Messages:**

```typescript
export const ERROR_MESSAGES = {
  NETWORK_ERROR:
    "⚠️ Cannot connect to backend. Please ensure services are running on ports 8000 and 8001.",
  TIMEOUT:
    "⏱️ Request took too long. Try a smaller image or simpler enhancements.",
  INVALID_IMAGE: "🖼️ Invalid image format. Please upload JPEG, PNG, or WebP.",
  FILE_TOO_LARGE: "📦 Image is too large. Please use an image under 10MB.",
  API_KEY_ERROR: "🔑 API configuration error. Check backend .env file.",
  AI_BLOCKED: "🚫 AI blocked the request. Try different image or enhancements.",
  QUOTA_EXCEEDED: "💸 API quota exceeded. Check Google Cloud billing.",
};
```

**Validation Criteria:**

- ✅ Toast notification system
- ✅ Error boundary component
- ✅ User-friendly error messages
- ✅ Network error detection

---

### **STEP 10: Add Loading States & Progress Indicators**

**Objective:** Visual feedback during long operations

**Files to Create:**

- `app/components/LoadingOverlay.tsx`
- `app/components/LoadingSpinner.tsx`

**Implementation:**

```typescript
// app/components/LoadingOverlay.tsx
interface LoadingOverlayProps {
  message: string;
  stage: "analyzing" | "generating" | "processing";
}

export function LoadingOverlay({ message, stage }: LoadingOverlayProps) {
  const stageMessages = {
    analyzing: "Analyzing your image with AI...",
    generating: "Generating enhanced images (this may take 15-20 seconds)...",
    processing: "Processing...",
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-900 rounded-2xl p-8 max-w-md text-center">
        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        <h3 className="text-xl font-semibold text-white mb-2">
          {stageMessages[stage]}
        </h3>
        <p className="text-gray-400">{message}</p>
      </div>
    </div>
  );
}
```

**Validation Criteria:**

- ✅ Loading overlay with spinner
- ✅ Stage-specific messages
- ✅ Smooth animations
- ✅ Non-blocking UI

---

### **STEP 11: Add Styling & Responsive Design**

**Objective:** Professional UI matching existing design

**Key Styling Requirements:**

- Use existing Tailwind classes
- Match current design system (gray/blue theme)
- Responsive grid layouts
- Smooth transitions
- Hover effects

**Example Tailwind Classes:**

```typescript
// Suggestion items
className="p-4 border border-gray-700 rounded-lg cursor-pointer
  hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-200
  ${selected ? 'border-blue-500 bg-blue-500/20' : ''}"

// Enhancement checkboxes
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"

// Generate button
className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500
  text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600
  disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"

// Results grid
className="grid grid-cols-1 lg:grid-cols-2 gap-8"
```

**Validation Criteria:**

- ✅ Responsive on mobile, tablet, desktop
- ✅ Matches existing design system
- ✅ Smooth transitions
- ✅ Accessible contrast ratios

---

### **STEP 12: Implement Caching & Performance Optimization**

**Objective:** Optimize API calls and improve performance

**Files to Create:**

- `app/hooks/useCache.ts`

**Implementation:**

```typescript
// app/hooks/useCache.ts
import { useState, useCallback } from "react";
import { hashFile } from "../utils/imageUtils";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export function useSuggestionsCache(ttl: number = 3600000) {
  // 1 hour default
  const [cache, setCache] = useState<Map<string, CacheEntry<string[]>>>(
    new Map()
  );

  const getCached = useCallback(
    async (file: File): Promise<string[] | null> => {
      const hash = await hashFile(file);
      const entry = cache.get(hash);

      if (!entry) return null;

      // Check if expired
      if (Date.now() - entry.timestamp > ttl) {
        cache.delete(hash);
        return null;
      }

      return entry.data;
    },
    [cache, ttl]
  );

  const setCached = useCallback(async (file: File, data: string[]) => {
    const hash = await hashFile(file);
    setCache((prev) =>
      new Map(prev).set(hash, { data, timestamp: Date.now() })
    );
  }, []);

  return { getCached, setCached };
}
```

**Optimization Checklist:**

- ✅ Cache suggestions for same image
- ✅ Image compression before upload
- ✅ Lazy loading for results
- ✅ Debounce text inputs
- ✅ Memoize expensive computations

---

### **STEP 13: Add Download & Export Functionality**

**Objective:** Allow users to save enhanced images

**Implementation:**

```typescript
// In ImageEnhancer component
const handleDownload = (imageUrl: string, index: number) => {
  const link = document.createElement("a");
  link.href = imageUrl;
  link.download = `photomonix-enhanced-${Date.now()}-${index + 1}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const handleDownloadAll = () => {
  enhancedImages.forEach((imageUrl, index) => {
    setTimeout(() => handleDownload(imageUrl, index), index * 500);
  });
};
```

**Features:**

- Download individual images
- Download all images (sequential)
- Custom filename with timestamp
- PNG format (high quality)

**Validation Criteria:**

- ✅ Single image download works
- ✅ Batch download works
- ✅ Proper filenames generated
- ✅ Works across browsers

---

### **STEP 14: Testing & Validation**

**Objective:** Ensure all functionality works correctly

**Testing Checklist:**

**Unit Testing:**

- [ ] File validation function
- [ ] Image compression
- [ ] Input sanitization
- [ ] Selected options validation
- [ ] API service functions

**Integration Testing:**

- [ ] Full workflow: upload → analyze → enhance → download
- [ ] Error handling scenarios
- [ ] Loading state transitions
- [ ] Session/state persistence

**Manual Testing:**

- [ ] Upload various formats (JPEG, PNG, WebP)
- [ ] Upload large files (8-10MB)
- [ ] Test with slow network (3G throttling)
- [ ] Test timeout scenarios
- [ ] Test with invalid files
- [ ] Test all enhancement combinations
- [ ] Test empty reference notes
- [ ] Test special characters in notes
- [ ] Test rapid successive uploads
- [ ] Test with backend stopped
- [ ] Test CORS from different origins

**Browser Testing:**

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

**Device Testing:**

- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

---

### **STEP 15: Documentation & Cleanup**

**Objective:** Clean code and comprehensive documentation

**Tasks:**

1. Add JSDoc comments to all functions
2. Remove console.logs and debug code
3. Clean up unused imports
4. Update README with integration details
5. Document API endpoints

**Documentation Template:**

````typescript
/**
 * Analyzes an image and returns AI-powered enhancement suggestions
 *
 * @param imageFile - The image file to analyze (JPEG, PNG, or WebP)
 * @returns Promise resolving to array of 5 enhancement prompts (10-15 words each)
 * @throws Error if file is invalid, network fails, or backend returns error
 *
 * @example
 * ```typescript
 * const suggestions = await getEnhancementSuggestions(file);
 * console.log(suggestions); // ["Add professional studio lighting...", ...]
 * ```
 *
 * Backend Endpoint: POST http://localhost:8000/refine-image
 * Expected Response Time: 3-5 seconds
 * Timeout: 30 seconds
 */
````

**Validation Criteria:**

- ✅ All functions documented
- ✅ No debug code in production
- ✅ README updated
- ✅ Code passes linting

---

## 📁 File Structure

**Complete Directory Structure After Implementation:**

```
photomonix_ui/
├── app/
│   ├── config/
│   │   └── photomonix.ts           # API endpoints, timeouts, config
│   ├── constants/
│   │   └── enhancements.ts         # Enhancement categories (5 categories)
│   ├── types/
│   │   └── photomonix.ts           # TypeScript interfaces
│   ├── services/
│   │   ├── api.ts                  # Existing auth service
│   │   └── photomonixApi.ts        # NEW: Image enhancement APIs
│   ├── utils/
│   │   ├── imageUtils.ts           # Image compression, validation
│   │   └── validation.ts           # Input sanitization
│   ├── hooks/
│   │   ├── useCache.ts             # Caching logic
│   │   └── useToast.ts             # Toast notifications
│   ├── components/
│   │   ├── Navbar.tsx              # Existing
│   │   ├── Footer.tsx              # Existing
│   │   ├── ProtectedRoute.tsx      # Existing
│   │   ├── ImageEnhancer.tsx       # NEW: Main enhancement component
│   │   ├── LoadingOverlay.tsx      # NEW: Full-page loading
│   │   ├── LoadingSpinner.tsx      # NEW: Spinner component
│   │   ├── Toast.tsx               # NEW: Toast notifications
│   │   └── ErrorBoundary.tsx       # NEW: Error handling
│   ├── routes/
│   │   ├── home.tsx                # MODIFIED: Add backend integration
│   │   ├── edit.tsx                # MODIFIED: Replace mock with real data
│   │   ├── login.tsx               # Existing
│   │   ├── register.tsx            # Existing
│   │   └── ...                     # Other auth routes
│   ├── app.css                     # Existing styles
│   ├── root.tsx                    # Root component
│   └── routes.ts                   # Route configuration
├── public/                         # Static assets
├── .env.local                      # Environment variables (optional)
├── package.json                    # Dependencies
├── vite.config.ts                  # Vite configuration
├── tailwind.config.js              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
├── IMPLEMENTATION_GUIDE.md         # THIS FILE
└── README.md                       # Project README
```

**New Files Count:** 14 files  
**Modified Files Count:** 2 files  
**Total Changes:** 16 files

---

## 🔗 Integration Points

### Backend Services Communication:

#### **Suggestion Service (Port 8000)**

```
Endpoint: POST http://localhost:8000/refine-image
Method: POST
Content-Type: multipart/form-data

Request Body:
  - file: Binary image data

Response (200 OK):
{
  "enhancement_prompts": [
    "Add professional studio lighting with soft shadows",
    "Apply pure white background for clean product display",
    "Enhance edge sharpness and texture clarity",
    "Use minimalist composition with center alignment",
    "Adjust color accuracy and contrast for premium look"
  ]
}

Response (Error):
{
  "detail": "Error message"
}

Performance:
  - Expected: 3-5 seconds
  - Timeout: 30 seconds
  - Retries: 2 (for 5xx errors only)
```

#### **Image Service (Port 8001)**

```
Endpoint: POST http://localhost:8001/image-to-image
Method: POST
Content-Type: multipart/form-data

Request Body:
  - file: Binary image data
  - selected: JSON string (e.g., '{"Background":["Pure white background (255,255,255)"]}')
  - reference_notes: String (optional, max 1000 chars)

Response (200 OK):
{
  "images": ["base64_encoded_string_1", "base64_encoded_string_2"],
  "prompt_used": "Full prompt text sent to AI",
  "enh_text": "Background: pure white ; Lighting: softbox"
}

Response (Error):
{
  "detail": "Error from FastAPI",
  "error": "Error from processing logic"
}

Performance:
  - Expected: 10-20 seconds
  - Timeout: 60 seconds
  - Retries: 2 (for 5xx errors only)
  - May return 1-3 image variants
```

### Data Flow:

```
USER
  ↓ (selects image)
HOME.TSX
  ↓ (validates file)
PHOTOMONIX API
  ↓ (POST /refine-image)
SUGGESTION SERVICE (Port 8000)
  ↓ (AI analysis ~5s)
RESPONSE (5 suggestions)
  ↓ (navigate with state)
EDIT.TSX
  ↓ (displays suggestions)
IMAGE ENHANCER COMPONENT
  ↓ (user selects options)
PHOTOMONIX API
  ↓ (POST /image-to-image)
IMAGE SERVICE (Port 8001)
  ↓ (AI generation ~15s)
RESPONSE (enhanced images)
  ↓ (display results)
USER
  ↓ (downloads images)
```

---

## 🧪 Testing Plan

### **1. Unit Tests**

Create test files in `app/__tests__/`:

```typescript
// app/__tests__/imageUtils.test.ts
import { isValidImageFile, compressImage } from "../utils/imageUtils";

describe("imageUtils", () => {
  test("validates image files correctly", () => {
    const validFile = new File(["content"], "test.jpg", {
      type: "image/jpeg",
    });
    const result = isValidImageFile(validFile);
    expect(result.isValid).toBe(true);
  });

  test("rejects oversized files", () => {
    const largeFile = new File(
      [new ArrayBuffer(11 * 1024 * 1024)],
      "large.jpg",
      {
        type: "image/jpeg",
      }
    );
    const result = isValidImageFile(largeFile);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("too large");
  });
});
```

### **2. Integration Tests**

Test full user workflows:

```typescript
// Test full enhancement workflow
test("complete enhancement workflow", async () => {
  // 1. Upload image
  const file = createMockImageFile();

  // 2. Get suggestions
  const suggestions = await getEnhancementSuggestions(file);
  expect(suggestions).toHaveLength(5);

  // 3. Generate enhanced images
  const result = await generateEnhancedImages(
    file,
    { Background: ["Pure white background"] },
    suggestions[0]
  );
  expect(result.images).toBeDefined();
  expect(result.images.length).toBeGreaterThan(0);
});
```

### **3. Manual Testing Scenarios**

| Scenario                     | Expected Result                            |
| ---------------------------- | ------------------------------------------ |
| Upload 5MB JPEG              | ✅ Successfully uploads and analyzes       |
| Upload 12MB PNG              | ❌ Shows "File too large" error            |
| Upload .txt file             | ❌ Shows "Invalid file type" error         |
| Generate with no selections  | ✅ Still works (uses only reference notes) |
| Generate with all categories | ✅ Creates enhanced images                 |
| Backend offline              | ❌ Shows network error after timeout       |
| Slow network (3G)            | ✅ Shows loading, completes eventually     |
| Cancel during analysis       | ✅ Abort signal cancels request            |

### **4. Performance Testing**

```bash
# Test with different image sizes
- 500KB image: Should complete in < 5s (analysis) + < 15s (generation)
- 2MB image: Should complete in < 8s (analysis) + < 20s (generation)
- 5MB image: Should complete in < 12s (analysis) + < 25s (generation)
- 10MB image: Should be compressed first, then proceed
```

### **5. Browser Compatibility Testing**

Test matrix:

- ✅ Chrome 120+ (Windows, Mac, Linux)
- ✅ Firefox 120+ (Windows, Mac, Linux)
- ✅ Safari 17+ (Mac, iOS)
- ✅ Edge 120+ (Windows)

---

## 🚀 Deployment Checklist

### **Pre-Deployment:**

- [ ] All backend services running (ports 8000, 8001)
- [ ] Frontend dev server on port 3000
- [ ] CORS properly configured in backend `.env`
- [ ] API keys set in backend `.env`
- [ ] All tests passing
- [ ] No console errors in browser
- [ ] No TypeScript errors
- [ ] Build succeeds: `npm run build`

### **Environment Setup:**

- [ ] Backend Docker containers running
- [ ] Network connectivity verified between services
- [ ] File upload size limits configured
- [ ] Timeout values appropriate for server specs

### **Post-Deployment Verification:**

- [ ] Upload test image → get suggestions
- [ ] Select enhancements → generate images
- [ ] Download enhanced images
- [ ] Error handling works (simulate errors)
- [ ] Loading states display correctly
- [ ] Mobile responsive
- [ ] All routes accessible

### **Monitoring (Optional):**

- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Monitor API response times
- [ ] Track user conversion rates
- [ ] Monitor backend service health

---

## 🔧 Troubleshooting Guide

### **Common Issues:**

#### **1. CORS Errors**

```
Error: Access to fetch at 'http://localhost:8000' has been blocked by CORS policy
```

**Solution:**

- Check backend `.env` has `FRONTEND_ORIGINS=http://localhost:3000`
- Restart backend services after .env changes
- Verify no trailing slashes in URLs

#### **2. Network Timeout**

```
Error: Request timeout: Image analysis is taking too long
```

**Solution:**

- Reduce image size (compress before upload)
- Check backend service logs for issues
- Increase timeout in `config/photomonix.ts`
- Verify backend API key is valid

#### **3. Invalid Response Format**

```
Error: Invalid response format from suggestion service
```

**Solution:**

- Check backend is running correct version
- Verify backend didn't return error as 200 OK
- Check network tab for actual response
- Validate backend prompt templates

#### **4. Image Not Displaying**

```
Enhanced images array is empty
```

**Solution:**

- Check browser console for errors
- Verify base64 data is valid
- Check if data URL prefix is correct
- Inspect network response

#### **5. File Upload Fails**

```
Error: Failed to upload file
```

**Solution:**

- Check file size (max 10MB)
- Verify file type is supported
- Check network connectivity
- Try with smaller image

### **Debug Mode:**

Add to component:

```typescript
const DEBUG = true;

if (DEBUG) {
  console.log("Image file:", imageFile);
  console.log("Selected options:", selectedOptions);
  console.log("Reference notes:", referenceNotes);
}
```

### **Backend Health Check:**

```bash
# Test suggestion service
curl -X POST http://localhost:8000/refine-image -F "file=@test.jpg"

# Test image service
curl -X POST http://localhost:8001/image-to-image \
  -F "file=@test.jpg" \
  -F 'selected={"Background":["pure white"]}' \
  -F 'reference_notes=test'
```

---

## 📊 Success Metrics

### **Technical Metrics:**

- ✅ Suggestion API response time < 8 seconds (p95)
- ✅ Generation API response time < 25 seconds (p95)
- ✅ Error rate < 5%
- ✅ File upload success rate > 95%
- ✅ Zero critical bugs in production

### **User Experience Metrics:**

- ✅ Time from upload to suggestions < 10 seconds
- ✅ Time from generate to results < 30 seconds
- ✅ Mobile responsiveness score > 90
- ✅ Accessibility score > 90

---

## 📚 Additional Resources

- [Backend Integration Guide](/.github/copilot-instructions.md)
- [React Router v7 Docs](https://reactrouter.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Google Gemini AI Docs](https://ai.google.dev/docs)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/)

---

## 🎯 Quick Reference Commands

```bash
# Development
npm run dev              # Start dev server (port 3000)
npm run build           # Build for production
npm run typecheck       # Check TypeScript types

# Testing
npm test                # Run all tests
npm test -- --watch     # Run tests in watch mode

# Code Quality
npm run lint            # Run ESLint
npm run format          # Format code with Prettier
```

---

## ✅ Completion Checklist

Copy this to track your progress:

```markdown
## Phase 1: Setup

- [ ] STEP 1: Environment configuration
- [ ] STEP 2: Enhancement categories constants
- [ ] STEP 3: TypeScript type definitions

## Phase 2: Core Implementation

- [ ] STEP 4: API service layer
- [ ] STEP 5: Utility functions
- [ ] STEP 6: Update home route
- [ ] STEP 7: Image enhancer component
- [ ] STEP 8: Refactor edit route

## Phase 3: Polish

- [x] STEP 9: Error handling
- [x] STEP 10: Loading states
- [x] STEP 11: Styling
- [x] STEP 12: Performance optimization
- [x] STEP 13: Download functionality

## Phase 4: Quality Assurance

- [ ] STEP 14: Testing
- [ ] STEP 15: Documentation

## Deployment

- [ ] Backend services running
- [ ] All tests passing
- [ ] Production build successful
- [ ] User acceptance testing complete
```

---

**Ready to start implementation? Begin with STEP 1!** 🚀

---

**Last Updated:** December 21, 2025  
**Version:** 1.0  
**Author:** PhotoMonix Development Team
