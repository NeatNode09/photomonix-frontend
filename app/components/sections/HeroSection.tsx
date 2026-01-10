import React, { useState } from "react";
import { useNavigate } from "react-router";
import { getEnhancementSuggestionsQueued } from "@services/photomonixApi";
import { isValidImageFile } from "@utils/imageUtils";
import LoadingOverlay from "@components/LoadingOverlay";
import { useSuggestionsCache } from "@hooks/useCache";
import type { SuggestionServiceResponse } from "~/types/photomonix";

const HeroSection = () => {
  const [dragActive, setDragActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { getCached, setCached } = useSuggestionsCache();

  const handleFileSelect = async (file: File | null) => {
    if (!file) return;

    const validation = isValidImageFile(file);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setError(null);
    setIsAnalyzing(true);

    try {
      // Check cache first
      const cachedSuggestions = await getCached(file);

      let suggestions: SuggestionServiceResponse;
      if (cachedSuggestions) {
        // Use cached suggestions
        suggestions = cachedSuggestions;
      } else {
        // Fetch from API and cache
        suggestions = await getEnhancementSuggestionsQueued(file);
        await setCached(file, suggestions);
      }

      navigate("/edit", {
        state: {
          imageFile: file,
          suggestions,
        },
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to analyze image. Please try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer?.files?.[0] ?? null;
    void handleFileSelect(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    void handleFileSelect(file);
  };

  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 relative">
        <section className="relative overflow-hidden pt-5 pb-2 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-0">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 backdrop-blur-sm rounded-full text-blue-300 text-sm font-medium mb-2 border border-blue-500/30">
                <span>AI-Powered Images Enhancement</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-0 leading-tight">
                Enhance Your Photos
                <br />
                <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  In Seconds
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-5 leading-relaxed">
                Upload your image and let AI do the magic. Get multiple enhanced
                versions and choose your favorite.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative rounded-3xl border-2 border-dashed p-12 transition-all duration-300 ${
                  dragActive
                    ? "border-blue-400 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                    : "border-gray-600 bg-white/5 hover:border-gray-500 hover:bg-white/10"
                }`}
              >
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-2xl"></div>
                    <div className="relative w-20 h-20 bg-linear-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                      <svg
                        className="w-10 h-10 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">
                    Drop your image here
                  </h3>
                  <p className="text-gray-400 mb-6">
                    or click to browse from your device
                  </p>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    id="image-upload"
                    onChange={handleFileInput}
                    disabled={isAnalyzing}
                  />
                  <label
                    htmlFor="image-upload"
                    className="px-8 py-3 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 inline-block"
                  >
                    {isAnalyzing ? "Analyzing..." : "Choose Image"}
                  </label>

                  {error && (
                    <div className="mt-4 text-red-300 text-sm bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-lg">
                      {error}
                    </div>
                  )}

                  <div className="mt-8 flex flex-wrap justify-center gap-6 pt-8 border-t border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <svg
                        className="w-5 h-5 text-green-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>JPG, PNG, WebP</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <svg
                        className="w-5 h-5 text-green-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Up to 10MB</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <svg
                        className="w-5 h-5 text-green-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Free to use</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {isAnalyzing && <LoadingOverlay stage="analyzing" />}
      </div>
    </>
  );
};

export default HeroSection;
