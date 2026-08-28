import React, { useState, useEffect } from "react";
import { Cpu, RefreshCw, Layers, CheckCircle2 } from "lucide-react";
import Card from "../common/Card";

export default function PredictionLoader({ selectedModelName = "Machine Learning Model" }) {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    "Vectorizing transaction numerical features & balance deltas...",
    "Executing scikit-learn pipeline (.joblib model)...",
    "Computing log-odds & calibrated class probabilities...",
    "Generating final fraud classification & risk score...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 350);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <Card className="border-blue-200 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-950/20 py-8 px-6 text-center">
      <div className="flex flex-col items-center justify-center space-y-4 max-w-md mx-auto">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center animate-pulse">
            <Cpu className="w-7 h-7" />
          </div>
          <div className="absolute -top-1 -right-1">
            <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Analyzing Transaction with {selectedModelName}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Evaluating real-time PaySim feature indicators...
          </p>
        </div>

        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-300 ease-out"
            style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
          <span className="truncate">{steps[stepIndex]}</span>
        </div>
      </div>
    </Card>
  );
}
