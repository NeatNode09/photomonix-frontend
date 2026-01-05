import React from "react";
import LoadingSpinner from "@components/LoadingSpinner";

type Stage = "analyzing" | "generating" | "processing";

interface LoadingOverlayProps {
  message?: string;
  stage?: Stage;
}

const stageMessage: Record<Stage, string> = {
  analyzing: "Analyzing your image with AI...",
  generating: "Generating enhanced images (this may take 15-20 seconds)...",
  processing: "Processing...",
};

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message,
  stage = "processing",
}) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-md w-full text-center shadow-xl shadow-black/40">
        <div className="mb-4 flex justify-center">
          <LoadingSpinner size={56} />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          {stageMessage[stage]}
        </h3>
        {message && (
          <p className="text-gray-300 text-sm leading-relaxed">{message}</p>
        )}
      </div>
    </div>
  );
};

export default LoadingOverlay;
