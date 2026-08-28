import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Button from "./Button";

export default function ErrorState({
  title = "Failed to load data",
  message = "An unexpected error occurred while processing your request.",
  onRetry,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/40 dark:bg-red-950/20 text-slate-800 dark:text-slate-200 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/60 text-red-600 dark:text-red-400 flex items-center justify-center mb-3">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-red-900 dark:text-red-300 mb-1">
        {title}
      </h3>
      <p className="text-xs text-red-700/80 dark:text-red-400 max-w-md mb-4 font-mono">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          icon={RefreshCw}
          onClick={onRetry}
          className="border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-100/50"
        >
          Try Again
        </Button>
      )}
    </div>
  );
}
