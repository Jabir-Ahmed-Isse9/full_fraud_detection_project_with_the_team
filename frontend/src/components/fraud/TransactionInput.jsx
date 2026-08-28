import React from "react";

export default function TransactionInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  required = false,
  prefix,
  suffix,
  helperText,
  disabled = false,
  min,
  max,
  step,
  id,
}) {
  const inputId = id || `input-${name}`;

  return (
    <div className="space-y-1.5 text-left">
      <div className="flex items-center justify-between">
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-slate-700 dark:text-slate-200 tracking-tight"
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {helperText && (
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {helperText}
          </span>
        )}
      </div>

      <div className="relative rounded-lg shadow-2xs">
        {prefix && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 font-mono text-xs">
            {prefix}
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type={type}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className={`block w-full rounded-lg border text-xs sm:text-sm font-mono transition-colors focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
            prefix ? "pl-7 sm:pl-8" : "pl-3"
          } ${suffix ? "pr-8 sm:pr-9" : "pr-3"} py-2 sm:py-2.5 ${
            error
              ? "border-red-400 dark:border-red-700 bg-red-50/20 text-red-900 dark:text-red-200 focus:border-red-500"
              : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-blue-500"
          } disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed`}
        />

        {suffix && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 font-mono text-xs">
            {suffix}
          </div>
        )}
      </div>

      {error && (
        <p className="text-[11px] text-red-600 dark:text-red-400 font-medium animate-in fade-in">
          {error}
        </p>
      )}
    </div>
  );
}
