import React from "react";

export default function Skeleton({ className = "", count = 1 }) {
  if (count === 1) {
    return (
      <div
        className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-md ${className}`}
      />
    );
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-md ${className}`}
        />
      ))}
    </div>
  );
}
