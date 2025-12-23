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
} as const;

export type EnhancementCategory = keyof typeof ENHANCEMENT_CATEGORIES;

export const getCategoryNames = (): EnhancementCategory[] =>
  Object.keys(ENHANCEMENT_CATEGORIES) as EnhancementCategory[];

export const getCategoryOptions = (
  category: EnhancementCategory
): readonly string[] => ENHANCEMENT_CATEGORIES[category] ?? [];

export const getTotalOptions = (): number =>
  Object.values(ENHANCEMENT_CATEGORIES).reduce(
    (sum, options) => sum + options.length,
    0
  );
