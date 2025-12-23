import type { SelectedOptions } from "../types/photomonix";
import { ENHANCEMENT_CATEGORIES } from "../constants/enhancements";

// Sanitizes user-provided reference notes.
export function sanitizeReferenceNotes(text: string): string {
  return text
    .trim()
    .replace(/<[^>]*>/g, "")
    .substring(0, 1000);
}

// Validates the selected options structure against known categories/options.
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

// Validates the full generation request before calling backend.
export function validateGenerationRequest(
  imageFile: File | null,
  selectedOptions: SelectedOptions,
  referenceNotes: string
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!imageFile) {
    errors.push("Image file is required");
  }

  const optionsValidation = validateSelectedOptions(selectedOptions);
  if (!optionsValidation.isValid) {
    errors.push(...optionsValidation.errors);
  }

  if (referenceNotes && referenceNotes.length > 1000) {
    errors.push("Reference notes must be less than 1000 characters");
  }

  return { isValid: errors.length === 0, errors };
}
