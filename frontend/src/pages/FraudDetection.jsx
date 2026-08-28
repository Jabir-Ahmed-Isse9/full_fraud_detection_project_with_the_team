import React, { useState, useRef, useEffect } from "react";
import { ShieldCheck, Info, Sparkles } from "lucide-react";
import TransactionForm from "../components/fraud/TransactionForm";
import PredictionResult from "../components/fraud/PredictionResult";
import PredictionLoader from "../components/fraud/PredictionLoader";
import ErrorState from "../components/common/ErrorState";
import { usePrediction } from "../hooks/usePrediction";
import { MODEL_IDS } from "../utils/constants";
import CsvModelTester from "../components/fraud/CsvModelTester";

export default function FraudDetection() {
  const [selectedModel, setSelectedModel] = useState(MODEL_IDS.COMPARE_BOTH);
  const { loading, error, predictionData, runPrediction, resetPrediction } =
    usePrediction();
  const resultRef = useRef(null);

  const handleSubmit = async (formData, modelId) => {
    try {
      const res = await runPrediction(formData, modelId);
      // Smooth scroll to result
      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } catch {
      // Error handled by hook
    }
  };

  const handleReset = () => {
    resetPrediction();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Live Transaction Risk Evaluation
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Feed real or simulated PaySim parameters into the scikit-learn models. Select single inference or compare consensus across Logistic Regression and Random Forest.
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Joblib Serialized Models Active</span>
          </div>
        </div>
      </div>

      {/* Transaction Input Form */}
      <TransactionForm
        onSubmit={handleSubmit}
        loading={loading}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
      />

      <CsvModelTester />

      {/* Loading Transition */}
      {loading && (
        <div className="pt-2">
          <PredictionLoader
            selectedModelName={
              selectedModel === MODEL_IDS.COMPARE_BOTH
                ? "Both Logistic Regression & Random Forest"
                : selectedModel === MODEL_IDS.LOGISTIC_REGRESSION
                ? "Logistic Regression"
                : "Random Forest"
            }
          />
        </div>
      )}

      {/* Error Display */}
      {error && (
        <ErrorState
          title="Prediction Analysis Failed"
          message={error}
          onRetry={() => {}}
        />
      )}

      {/* Prediction Result Section */}
      {predictionData && !loading && (
        <div ref={resultRef} className="pt-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
              Inference Evaluation Result
            </h3>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">
              ● Audit Log Generated
            </span>
          </div>

          <PredictionResult
            predictionData={predictionData}
            onReset={handleReset}
          />
        </div>
      )}
    </div>
  );
}
