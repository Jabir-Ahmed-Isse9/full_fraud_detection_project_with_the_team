import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ size = "md", className = "" }) {
  const sizeMap = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  return (
    <Loader2
      className={`animate-spin text-current ${sizeMap[size] || sizeMap.md} ${className}`}
      aria-label="Loading"
    />
  );
}
