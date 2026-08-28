import React from "react";
import { CheckCircle, AlertTriangle, RefreshCw, GitCompare } from "lucide-react";
import Card from "../common/Card";
import Button from "../common/Button";
import ModelResultCard from "./ModelResultCard";

export default function PredictionResult({
  predictionData,
  onReset,
  className = "",
  id = "prediction-result-view",
}) {
  if (!predictionData) return null;

  const { isComparison, result, logisticRegression, randomForest, agreement, agreementMessage } =
    predictionData;

  return (
    <div id={id} className={`space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 ${className}`}>
      {/* If Comparison Mode: Show Dual Cards and Agreement Banner */}
      {isComparison ? (
        <div className="space-y-4">
          {/* Agreement Banner */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all ${
              agreement
                ? "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200"
                : "bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200"
            }`}
          >
            <div
              className={`p-2 rounded-lg shrink-0 ${
                agreement
                  ? "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300"
                  : "bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300"
              }`}
            >
              {agreement ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-bold tracking-tight">
                  {agreement ? "✓ Both Models Agree" : "⚠ Model Disagreement Detected"}
                </h4>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/70 dark:bg-slate-900/70 border border-current">
                  Dual Inference
                </span>
              </div>
              <p className="text-xs mt-1 text-slate-700 dark:text-slate-300">
                {agreementMessage ||
                  (agreement
                    ? "Logistic Regression and Random Forest reached identical risk classification."
                    : "The models produced different predictions. This transaction may require additional review.")}
              </p>
            </div>
          </div>

          {/* Dual Result Cards Side-by-Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ModelResultCard
              titlePrefix="Baseline Classifier"
              result={logisticRegression}
            />
            <ModelResultCard
              titlePrefix="Ensemble Classifier"
              result={randomForest}
              isWinner
            />
          </div>
        </div>
      ) : (
        /* Single Model Result Card */
        <ModelResultCard result={result} />
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          Prediction successfully audited and saved to history log.
        </span>
        {onReset && (
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={onReset}
          >
            Test Another Transaction
          </Button>
        )}
      </div>
    </div>
  );
}
