import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import ImageEnhancer from "@components/ImageEnhancer";
import Navbar from "@components/layout/Navbar";
import type { Route } from "../+types/root";
import type { SuggestionServiceResponse } from "~/types/photomonix";
import { isValidImageFile } from "@utils/imageUtils";
import {
  callWithRetry,
  getEnhancementSuggestionsQueued,
} from "@services/photomonixApi";
import LoadingOverlay from "@components/LoadingOverlay";

export function meta({}: Route.MetaArgs) {
  return [
    {
      title: "AI Enhancement - Photomonix",
    },
    {
      name: "description",
      content:
        "Upload, analyze, and enhance your product images with AI-powered suggestions.",
    },
  ];
}

const Edit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as {
    imageFile?: File;
    suggestions?: SuggestionServiceResponse;
  } | null;
  const imageFile = state?.imageFile ?? null;
  const suggestions = state?.suggestions ?? null;

  const [activeFile, setActiveFile] = useState<File | null>(imageFile);
  const [activeSuggestions, setActiveSuggestions] =
    useState<SuggestionServiceResponse | null>(suggestions);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!activeFile) {
      navigate("/", { replace: true });
    }
  }, [activeFile, navigate]);

  const handleAlternateImageFile = useCallback(async (file: File) => {
    const { isValid, error } = isValidImageFile(file);
    if (!isValid) {
      alert(error ?? "Invalid image file");
      return;
    }
    try {
      setIsAnalyzing(true);
      setActiveFile(file);
      const nextSuggestions = await callWithRetry(() =>
        getEnhancementSuggestionsQueued(file)
      );
      setActiveSuggestions(nextSuggestions);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to analyze image");
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const handleFileChange = useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >(
    async (e) => {
      const file = e.target.files?.[0];
      if (file) {
        await handleAlternateImageFile(file);
        e.currentTarget.value = "";
      }
    },
    [handleAlternateImageFile]
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-950 to-black">
      <Navbar />
      <div className="pt-20 px-4 pb-10">
        <div className="max-w-7xl mx-auto">
          {activeFile && activeSuggestions ? (
            <ImageEnhancer
              imageFile={activeFile}
              suggestions={activeSuggestions}
            />
          ) : null}

          {/* Upload another image (at the end) */}
          <div className="mt-8 flex justify-center">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              id="edit-upload"
              onChange={handleFileChange}
              disabled={isAnalyzing}
            />
            <label
              htmlFor="edit-upload"
              className="px-8 py-3 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 inline-block"
            >
              {isAnalyzing ? "Analyzing..." : "Choose Image"}
            </label>
          </div>
        </div>
      </div>
      {isAnalyzing && <LoadingOverlay stage="analyzing" />}
    </div>
  );
};

export default Edit;
