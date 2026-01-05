import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  ENHANCEMENT_CATEGORIES,
  getCategoryNames,
  type EnhancementCategory,
} from "@constants/enhancements";
import { generateEnhancedImages, callWithRetry } from "@services/photomonixApi";
import type { SelectedOptions } from "@types/photomonix";
import {
  sanitizeReferenceNotes,
  validateGenerationRequest,
} from "@utils/validation";
import LoadingOverlay from "@components/LoadingOverlay";
import { useDebounce } from "@hooks/useDebounce";
import { downloadImage } from "@utils/download";
import DownloadProgress from "@components/DownloadProgress";

interface ImageEnhancerProps {
  imageFile: File;
  suggestions: string[];
}

const ImageEnhancer: React.FC<ImageEnhancerProps> = ({
  imageFile,
  suggestions,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [referenceNotes, setReferenceNotes] = useState<string>(
    suggestions[0] ?? ""
  );
  const [enhancedImages, setEnhancedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);

  // Memoize preview URL creation
  const previewUrl = useMemo(() => URL.createObjectURL(imageFile), [imageFile]);

  // Debounce reference notes to avoid excessive re-renders
  const debouncedNotes = useDebounce(referenceNotes, 300);

  useEffect(() => {
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  // Memoize toggle function to prevent unnecessary re-renders
  const toggleOption = useCallback(
    (category: EnhancementCategory, option: string) => {
      setSelectedOptions((prev) => {
        const current = prev[category] || [];
        const exists = current.includes(option);
        const next = exists
          ? current.filter((o) => o !== option)
          : [...current, option];
        return { ...prev, [category]: next };
      });
    },
    []
  );

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setReferenceNotes(suggestion);
  }, []);

  const handleGenerate = useCallback(async () => {
    setError(null);
    const notes = sanitizeReferenceNotes(debouncedNotes);
    const validation = validateGenerationRequest(
      imageFile,
      selectedOptions,
      notes
    );
    if (!validation.isValid) {
      setError(validation.errors.join("; "));
      return;
    }

    setLoading(true);
    try {
      const result = await callWithRetry(() =>
        generateEnhancedImages(imageFile, selectedOptions, notes)
      );
      setEnhancedImages(result.images);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate images."
      );
    } finally {
      setLoading(false);
    }
  }, [imageFile, selectedOptions, debouncedNotes]);

  const handleDownload = useCallback((imageUrl: string, index: number) => {
    const filename = `photomonix-enhanced-${Date.now()}-${index + 1}.png`;
    downloadImage(imageUrl, filename);
  }, []);

  const handleDownloadAll = useCallback(async () => {
    if (enhancedImages.length === 0) return;

    setDownloadProgress({ current: 0, total: enhancedImages.length });

    try {
      for (let i = 0; i < enhancedImages.length; i++) {
        const filename = `photomonix-enhanced-${Date.now()}-${i + 1}.png`;
        downloadImage(enhancedImages[i], filename);

        setDownloadProgress({ current: i + 1, total: enhancedImages.length });

        // Wait before next download to avoid browser blocking
        if (i < enhancedImages.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      // Clear progress after a brief delay
      setTimeout(() => setDownloadProgress(null), 2000);
    } catch (err) {
      console.error("Error downloading images:", err);
      setError("Failed to download some images. Please try again.");
      setDownloadProgress(null);
    }
  }, [enhancedImages]);

  // Memoize category names to avoid re-computation
  const categoryNames = useMemo(() => getCategoryNames(), []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      <div className="lg:col-span-1">
        <div className="sticky top-20 bg-linear-to-b from-white/8 to-white/5 border border-gray-700 rounded-2xl p-6 shadow-lg shadow-black/20 backdrop-blur-sm">
          <h2 className="text-lg lg:text-xl font-semibold text-white mb-4">
            Original Image
          </h2>
          <div className="rounded-lg lg:rounded-xl overflow-hidden border border-gray-700 bg-black/40 aspect-square lg:aspect-auto">
            <img
              src={previewUrl}
              alt="Original upload"
              className="w-full h-full object-contain"
            />
          </div>
          {suggestions.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h3 className="text-base lg:text-lg font-medium text-white mb-3">
                AI Suggestions
              </h3>
              <div className="space-y-2">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`w-full text-left p-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-gray-900 ${
                      referenceNotes === suggestion
                        ? "border-blue-500 bg-blue-500/20 text-white"
                        : "border-gray-700 bg-white/5 text-gray-200 hover:border-gray-600 hover:bg-white/8"
                    }`}
                  >
                    <span className="text-xs text-gray-400 mr-2 font-medium">
                      {idx + 1}.
                    </span>
                    <span className="text-sm line-clamp-2">{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-2 bg-linear-to-b from-white/8 to-white/5 border border-gray-700 rounded-2xl p-6 lg:p-8 shadow-lg shadow-black/20 backdrop-blur-sm">
        <h2 className="text-lg lg:text-xl font-semibold text-white mb-6 lg:mb-8">
          Enhancement Options
        </h2>

        <div className="space-y-6 lg:space-y-8">
          {categoryNames.map((category) => (
            <div key={category}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-white">{category}</h3>
                <span className="text-xs text-gray-400">
                  {ENHANCEMENT_CATEGORIES[category].length} options
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                {ENHANCEMENT_CATEGORIES[category].map((option) => {
                  const checked = (selectedOptions[category] || []).includes(
                    option
                  );
                  return (
                    <label
                      key={option}
                      className={`flex items-start gap-3 p-3 lg:p-4 rounded-lg border cursor-pointer transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-1 focus-within:ring-offset-gray-900 ${
                        checked
                          ? "border-blue-500 bg-blue-500/15 text-white"
                          : "border-gray-700 bg-white/5 text-gray-200 hover:border-blue-500 hover:bg-blue-500/10"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="mt-1 w-5 h-5 accent-blue-500 cursor-pointer"
                        checked={checked}
                        onChange={() => toggleOption(category, option)}
                        aria-label={option}
                      />
                      <span className="text-sm leading-snug text-gray-100">
                        {option}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 lg:mt-10 pt-6 lg:pt-8 border-t border-gray-700">
          <label
            htmlFor="reference-notes"
            className="block text-base font-medium text-white mb-3"
          >
            Reference Notes (Optional)
          </label>
          <textarea
            id="reference-notes"
            className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-gray-900 transition-colors duration-200"
            rows={4}
            value={referenceNotes}
            onChange={(e) => setReferenceNotes(e.target.value)}
            placeholder="Add custom enhancement instructions or let AI suggestions guide the generation..."
          />
        </div>

        {error && (
          <div className="mt-4 p-4 text-red-300 text-sm bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3 animate-in fade-in">
            <svg
              className="w-5 h-5 text-red-400 shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="mt-8 lg:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="px-8 py-3 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg shadow-md shadow-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            {loading ? "Generating..." : "Generate Enhanced Images"}
          </button>
          {enhancedImages.length > 0 && (
            <span className="text-sm text-gray-300">
              {enhancedImages.length} result
              {enhancedImages.length > 1 ? "s" : ""} ready
            </span>
          )}
        </div>

        {enhancedImages.length > 0 && (
          <div className="mt-10 lg:mt-12 pt-8 lg:pt-10 border-t border-gray-700">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h3 className="text-lg lg:text-xl font-semibold text-white">
                Enhanced Images ({enhancedImages.length})
              </h3>
              {enhancedImages.length > 1 && (
                <button
                  type="button"
                  onClick={handleDownloadAll}
                  className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium text-sm rounded-lg shadow-md shadow-green-500/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download All ({enhancedImages.length})
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {enhancedImages.map((imageUrl, index) => (
                <div
                  key={imageUrl}
                  className="group border border-gray-700 rounded-xl overflow-hidden bg-black/40 hover:border-gray-600 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-lg hover:shadow-blue-500/10"
                >
                  <div className="relative bg-black/40 aspect-video lg:aspect-square overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={`Enhanced variant ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-between px-4 py-4 border-t border-gray-700 bg-white/5">
                    <span className="text-sm font-medium text-gray-200">
                      Variant {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDownload(imageUrl, index)}
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-gray-900 rounded px-2 py-1"
                      aria-label={`Download variant ${index + 1}`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {loading && <LoadingOverlay stage="generating" />}
      {downloadProgress && (
        <DownloadProgress
          current={downloadProgress.current}
          total={downloadProgress.total}
        />
      )}
    </div>
  );
};

export default ImageEnhancer;
