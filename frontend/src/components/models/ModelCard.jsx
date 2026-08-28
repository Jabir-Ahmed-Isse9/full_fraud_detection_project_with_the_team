import React from "react";
import {
  Cpu,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Zap,
  Award,
} from "lucide-react";
import Card, { CardHeader, CardContent } from "../common/Card";
import Badge from "../common/Badge";
import { formatPercentRaw } from "../../utils/formatters";

export default function ModelCard({
  modelData,
  isBestModel = false,
  joblibFilename = "",
}) {
  if (!modelData) return null;

  const isRF = modelData.id === "random_forest";
  const metric = (value) => value === null || value === undefined ? "Not configured" : formatPercentRaw(value);

  return (
    <Card
      className={`relative overflow-hidden border transition-all duration-300 ${
        isBestModel
          ? "border-blue-300 dark:border-blue-800 shadow-md ring-1 ring-blue-500/20"
          : "border-slate-200 dark:border-slate-800"
      }`}
    >
      {/* Best Model Banner */}
      {isBestModel && (
        <div className="absolute top-0 right-0">
          <div className="bg-blue-600 text-white text-[10px] font-bold font-mono px-3 py-1 rounded-bl-lg shadow-xs flex items-center gap-1">
            <Award className="w-3 h-3" />
            TOP PERFORMER
          </div>
        </div>
      )}

      <CardHeader>
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isRF
                ? "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            {isRF ? <Sparkles className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {modelData.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {modelData.algorithm}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Core Metric Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase block">
              F1 Score
            </span>
            <span
              className={`text-base font-bold ${
                isBestModel ? "text-blue-600 dark:text-blue-400" : "text-slate-900 dark:text-slate-100"
              }`}
            >
              {metric(modelData.f1Score)}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase block">
              Precision
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-slate-100">
              {metric(modelData.precision)}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase block">
              Recall
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-slate-100">
              {metric(modelData.recall)}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase block">
              ROC-AUC
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-slate-100">
              {metric(modelData.rocAuc)}
            </span>
          </div>
        </div>

        {/* Model Description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {modelData.description}
        </p>

        {/* Strengths List */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
            Key Architectural Strengths:
          </span>
          <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
            {modelData.strengths?.map((strength, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Joblib File Metadata Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
          <div className="flex items-center gap-1.5">
            <FileCode className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] text-slate-600 dark:text-slate-400">
              {joblibFilename || `.${modelData.id}_model_for_fraud_detection.joblib`}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500" />
            <span>{modelData.inferenceLatency}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
