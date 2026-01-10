import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  generateEnhancedImagesQueued,
  callWithRetry,
  trackTokenUsage,
} from "@services/photomonixApi";
import type {
  SelectedOptions,
  SuggestionServiceResponse,
  EnhancementCategory,
} from "~/types/photomonix";
import {
  sanitizeReferenceNotes,
  validateGenerationRequest,
} from "@utils/validation";
import LoadingOverlay from "@components/LoadingOverlay";
import { useDebounce } from "@hooks/useDebounce";
import { downloadImage } from "@utils/download";
import DownloadProgress from "@components/DownloadProgress";
import { useAuth } from "@contexts/AuthContext";
import { auth } from "@services/api";

interface ImageEnhancerProps {
  imageFile: File;
  suggestions: SuggestionServiceResponse;
}

const ImageEnhancer: React.FC<ImageEnhancerProps> = ({
  imageFile,
  suggestions,
}) => {
  const { user } = useAuth();
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [referenceNotes, setReferenceNotes] = useState<string>("");
  const [enhancedImages, setEnhancedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const [previewImage, setPreviewImage] = useState<{
    url: string;
    index: number;
  } | null>(null);

  // Extract categories from suggestions (excluding debug_caption)
  const categories = useMemo(() => {
    const { debug_caption, ...cats } = suggestions;
    return Object.keys(cats) as EnhancementCategory[];
  }, [suggestions]);

  // Memoize preview URL creation
  const previewUrl = useMemo(() => URL.createObjectURL(imageFile), [imageFile]);

  // Debounce reference notes to avoid excessive re-renders
  const debouncedNotes = useDebounce(referenceNotes, 300);

  const analysisPhrases = useMemo(() => {
    const caption = suggestions.debug_caption?.trim();
    if (!caption) return [];
    const normalized = caption.replace(/\s+/g, " ").replace(/\.+$/, "");
    const splits = normalized
      .split(/[,;]+|\s+and\s+/i)
      .map((s) => s.trim())
      .filter(Boolean);
    return splits.map((s) => s.charAt(0).toUpperCase() + s.slice(1));
  }, [suggestions]);

  useEffect(() => {
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  // Memoize toggle function to prevent unnecessary re-renders
  const toggleOption = useCallback((category: string, option: string) => {
    setSelectedOptions((prev) => {
      const current = prev[category] || [];
      const exists = current.includes(option);
      const next = exists
        ? current.filter((o) => o !== option)
        : [...current, option];
      return { ...prev, [category]: next };
    });
  }, []);

  const handleGenerate = useCallback(async () => {
    setError(null);
    setLoadingProgress(0);
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
        generateEnhancedImagesQueued(
          imageFile,
          selectedOptions,
          notes,
          (progress) => setLoadingProgress(progress)
        )
      );
      setEnhancedImages(result.images);
      setLoadingProgress(100);

      // Track token usage if authenticated (token stored in auth service)
      const accessToken = auth.getAccessToken();
      if (accessToken) {
        try {
          // Estimate tokens used (you can get actual count from API if available)
          const estimatedTokens = 1000; // Adjust based on your API
          await trackTokenUsage(estimatedTokens, accessToken);
        } catch (tokenError) {
          console.error("Token tracking failed:", tokenError);
          // Don't show error to user - token tracking is non-critical
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate images."
      );
    } finally {
      setLoading(false);
      setLoadingProgress(0);
    }
  }, [imageFile, selectedOptions, debouncedNotes, user]);

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
      <div className="lg:col-span-4">
        <div className="sticky top-24 space-y-6">
          <div className="bg-linear-to-b from-white/8 to-white/5 border border-gray-700 rounded-2xl p-4 shadow-lg shadow-black/20 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-300">
                Original Image
              </h3>
            </div>
            <div className="rounded-lg overflow-hidden border border-gray-700 bg-black/40 aspect-square">
              <img
                src={previewUrl}
                alt="Original upload"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {enhancedImages.length > 0 && (
            <div className="bg-linear-to-b from-white/8 to-white/5 border border-gray-700 rounded-2xl p-4 shadow-lg shadow-black/20 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-white">
                  Enhanced Images ({enhancedImages.length})
                </h3>
                {enhancedImages.length > 1 && (
                  <button
                    type="button"
                    onClick={handleDownloadAll}
                    className="text-xs px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                  >
                    Download All
                  </button>
                )}
              </div>
              <div className="space-y-4 max-h-[calc(100vh-20rem)] overflow-y-auto pr-2 custom-scrollbar">
                {enhancedImages.map((imageUrl, index) => (
                  <div
                    key={imageUrl}
                    className="group relative border border-gray-700 rounded-lg overflow-hidden bg-black/40 hover:border-blue-500 transition-all duration-300"
                  >
                    <div className="relative bg-black/40 aspect-square overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={`Enhanced variant ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewImage({ url: imageUrl, index })
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg"
                          aria-label={`Preview variant ${index + 1}`}
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
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          Preview
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownload(imageUrl, index)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg"
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
                    <div className="flex items-center justify-between px-3 py-2 border-t border-gray-700 bg-white/5">
                      <span className="text-xs font-medium text-gray-200">
                        Variant {index + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="bg-linear-to-b from-white/8 to-white/5 border border-gray-700 rounded-2xl p-6 lg:p-8 shadow-lg shadow-black/20 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-6 lg:mb-8">
            <h2 className="text-lg lg:text-xl font-semibold text-white">
              AI-Suggested Enhancements
            </h2>
          </div>

          <div className="space-y-6">
            {categories.map((category) => {
              const options = suggestions[category] || [];
              if (options.length === 0) return null;

              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-medium text-white">
                      {category}
                    </h3>
                    <span className="text-xs text-gray-400">
                      {options.length} options
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {options.map((option) => {
                      const checked = (
                        selectedOptions[category] || []
                      ).includes(option);
                      return (
                        <label
                          key={option}
                          className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                            checked
                              ? "border-blue-500 bg-blue-500/15 text-white"
                              : "border-gray-700 bg-white/5 text-gray-200 hover:border-blue-500 hover:bg-blue-500/10"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="mt-0.5 w-4 h-4 accent-blue-500 cursor-pointer"
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
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <label
              htmlFor="reference-notes"
              className="block text-sm font-medium text-white mb-2"
            >
              Custom Instructions (Optional)
            </label>
            <textarea
              id="reference-notes"
              className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              rows={3}
              value={referenceNotes}
              onChange={(e) => setReferenceNotes(e.target.value)}
              placeholder="Add any specific requirements..."
            />
          </div>

          {error && (
            <div className="mt-4 p-3 text-red-300 text-sm bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2">
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

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="mt-6 w-full px-6 py-3 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg shadow-md shadow-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? "Generating..." : "Generate Enhanced Images"}
          </button>
        </div>
      </div>

      <div className="lg:col-span-3">
        <div className="sticky top-24 bg-linear-to-b from-white/8 to-white/5 border border-gray-700 rounded-2xl p-6 shadow-lg shadow-black/20 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg lg:text-xl font-semibold text-white">
              AI Analysis
            </h2>
          </div>
          {analysisPhrases.length > 0 ? (
            <ul className="space-y-3">
              {analysisPhrases.map((line, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-300"
                >
                  <svg
                    className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="leading-relaxed">{line}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 italic">
              AI analysis will appear here after processing your image.
            </p>
          )}
        </div>
      </div>

      {loading && (
        <LoadingOverlay stage="generating" progress={loadingProgress} />
      )}
      {downloadProgress ? (
        <DownloadProgress
          current={downloadProgress.current}
          total={downloadProgress.total}
        />
      ) : null}

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-7xl max-h-[90vh] w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300 transition-colors"
              aria-label="Close preview"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Image */}
            <div className="bg-black/40 rounded-lg overflow-hidden border border-gray-700">
              <img
                src={previewImage.url}
                alt={`Enhanced variant ${previewImage.index + 1} preview`}
                className="w-full h-full max-h-[80vh] object-contain"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <span className="text-white text-sm font-medium">
                Variant {previewImage.index + 1}
              </span>
              <button
                type="button"
                onClick={() =>
                  handleDownload(previewImage.url, previewImage.index)
                }
                className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-lg"
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
                Download Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageEnhancer;
