import React from "react";

interface DownloadProgressProps {
  current: number;
  total: number;
}

const DownloadProgress: React.FC<DownloadProgressProps> = ({
  current,
  total,
}) => {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="fixed bottom-6 right-6 bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-xl shadow-black/40 z-50 min-w-[280px] animate-in slide-in-from-bottom">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-green-400 animate-pulse"
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
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-white">
            Downloading Images
          </h4>
          <p className="text-xs text-gray-400">
            {current} of {total} completed
          </p>
        </div>
      </div>

      <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
        <div
          className="bg-linear-to-r from-green-500 to-emerald-500 h-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` } as React.CSSProperties}
        />
      </div>

      <p className="text-xs text-gray-500 mt-2 text-right">{percentage}%</p>
    </div>
  );
};

export default DownloadProgress;
