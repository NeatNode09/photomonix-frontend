import React from "react";
import type { Toast as ToastType } from "@hooks/useToast";

interface ToastProps extends ToastType {
  onClose: () => void;
}

const bgByType: Record<ToastType["type"], string> = {
  success: "bg-green-600",
  error: "bg-red-600",
  info: "bg-blue-600",
  warning: "bg-amber-500",
};

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg text-white ${bgByType[type]}`}
      role="alert"
    >
      <div className="flex-1 text-sm leading-snug">{message}</div>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="text-white/80 hover:text-white"
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;
