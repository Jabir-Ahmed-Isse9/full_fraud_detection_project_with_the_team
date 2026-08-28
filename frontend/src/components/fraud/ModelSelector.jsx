import React from "react";
import { Sparkles, GitCompare, Cpu } from "lucide-react";
import { MODEL_IDS } from "../../utils/constants";

export default function ModelSelector({ selectedModel, onSelectModel, disabled = false }) {
  const options = [
    {
      id: MODEL_IDS.LOGISTIC_REGRESSION,
      name: "LogisticRegression",
      badge: "Saved Joblib Pipeline",
      icon: Cpu,
      description: "The saved scikit-learn LogisticRegression pipeline.",
    },
    {
      id: MODEL_IDS.RANDOM_FOREST,
      name: "RandomForestClassifier",
      badge: "Saved Joblib Pipeline",
      icon: Sparkles,
      description: "The saved scikit-learn RandomForestClassifier pipeline.",
    },
    {
      id: MODEL_IDS.COMPARE_BOTH,
      name: "Compare Both Models",
      badge: "Dual Analysis",
      icon: GitCompare,
      isPrimary: true,
      description: "Simultaneously evaluate with both classifiers & check model consensus.",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
          Prediction Model
        </label>
        <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
          Select classifier or benchmark consensus
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {options.map((option) => {
          const isSelected = selectedModel === option.id;
          const Icon = option.icon;

          return (
            <div
              key={option.id}
              id={`model-option-${option.id}`}
              onClick={() => !disabled && onSelectModel(option.id)}
              className={`relative flex flex-col justify-between p-3.5 rounded-xl border transition-all duration-200 cursor-pointer select-none ${
                isSelected
                  ? option.isPrimary
                    ? "border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-blue-500/20 shadow-xs"
                    : "border-slate-800 dark:border-slate-200 bg-slate-50 dark:bg-slate-800/80 ring-2 ring-slate-400/20 shadow-xs"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                      {option.name}
                    </span>
                  </div>
                  {option.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isSelected
                          ? "bg-blue-200 text-blue-900 dark:bg-blue-900 dark:text-blue-200 font-bold"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {option.badge}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {option.description}
                </p>
              </div>

              {/* Radio indicator */}
              <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center gap-2 text-[11px] font-mono">
                <div
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    isSelected
                      ? "border-blue-600 bg-blue-600 dark:border-blue-400 dark:bg-blue-400"
                      : "border-slate-300 dark:border-slate-600 bg-transparent"
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-slate-900" />}
                </div>
                <span className={isSelected ? "text-blue-700 dark:text-blue-300 font-semibold" : "text-slate-500"}>
                  {isSelected ? "Selected" : "Click to select"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
