import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import ImageEnhancer from "@components/ImageEnhancer";
import type { Route } from "../+types/root";

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
    suggestions?: string[];
  } | null;
  const imageFile = state?.imageFile;
  const suggestions = state?.suggestions;

  useEffect(() => {
    if (!imageFile) {
      navigate("/", { replace: true });
    }
  }, [imageFile, navigate]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-950 to-black">
      <div className="pt-20 px-4 pb-10">
        <div className="max-w-7xl mx-auto">
          {imageFile && suggestions ? (
            <ImageEnhancer imageFile={imageFile} suggestions={suggestions} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Edit;
