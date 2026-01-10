import React from "react";
import LoadingSpinner from "@components/LoadingSpinner";

type Stage = "analyzing" | "generating" | "processing";

interface LoadingOverlayProps {
  message?: string;
  stage?: Stage;
  progress?: number; // 0-100
}

const stageMessage: Record<Stage, string> = {
  analyzing: "Analyzing your image with AI...",
  generating: "Generating enhanced images (this may take 30-60 seconds)...",
  processing: "Processing...",
};

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message,
  stage = "processing",
  progress = 0,
}) => {
  const showProgress = progress > 0 && stage === "generating";

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
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            {message}
          </p>
        )}
        {showProgress && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Progress</span>
              <span className="text-sm font-medium text-blue-400">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-linear-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {progress < 30
                ? "Starting generation..."
                : progress < 70
                  ? "Processing with AI..."
                  : progress < 95
                    ? "Finalizing image..."
                    : "Almost done..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingOverlay;
