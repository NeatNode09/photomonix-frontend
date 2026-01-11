import type { SelectedOptions } from "../types/photomonix";

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
    if (typeof category !== "string" || category.trim().length === 0) {
      errors.push("Category keys must be non-empty strings");
      continue;
    }

    if (!Array.isArray(options)) {
      errors.push(`Options for ${category} must be an array`);
      continue;
    }

    for (const option of options) {
      if (typeof option !== "string" || option.trim().length === 0) {
        errors.push(
          `Invalid option for category ${category}: must be a non-empty string`
        );
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
