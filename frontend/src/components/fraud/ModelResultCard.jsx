import React from "react";
import { ShieldAlert, ShieldCheck, Clock, Zap, Cpu } from "lucide-react";
import Card from "../common/Card";
import Badge from "../common/Badge";
import RiskIndicator from "./RiskIndicator";
import { formatPercentRaw, formatDateTime } from "../../utils/formatters";

export default function ModelResultCard({ result, titlePrefix = "", isWinner = false }) {
  if (!result) return null;

  const isFraud = result.isFraud || result.prediction?.includes("FRAUD");
  const fraudProb = Number(result.fraudProbability) || 0;
  const confidence = Number(result.confidence) || (isFraud ? fraudProb : 100 - fraudProb);

  return (
    <Card
      className={`relative overflow-hidden border transition-all duration-300 ${
        isFraud
          ? "border-red-300 dark:border-red-900/60 bg-red-50/20 dark:bg-red-950/20"
          : "border-emerald-300 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/20"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-blue-500" />
          <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
            {titlePrefix ? `${titlePrefix}: ${result.model}` : result.model}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {result.latency && (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <Zap className="w-3 h-3 text-amber-500" />
              {result.latency}
            </span>
          )}
          <Badge variant={isFraud ? "danger" : "success"} dot>
            {isFraud ? "FRAUD DETECTED" : "LEGITIMATE"}
          </Badge>
        </div>
      </div>

      {/* Main Outcome Display */}
      <div className="py-4 space-y-4">
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isFraud
                ? "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400"
                : "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {isFraud ? (
              <ShieldAlert className="w-6 h-6" />
            ) : (
              <ShieldCheck className="w-6 h-6" />
            )}
          </div>

          <div className="flex-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
              Classification Outcome
            </span>
            <h4
              className={`text-base sm:text-lg font-bold tracking-tight font-mono ${
                isFraud
                  ? "text-red-700 dark:text-red-400"
                  : "text-emerald-700 dark:text-emerald-400"
              }`}
            >
              {result.prediction || (isFraud ? "FRAUDULENT TRANSACTION" : "LEGITIMATE TRANSACTION")}
            </h4>
          </div>
        </div>

        {/* Risk Indicator with Progress Gauge */}
        <div className="pt-2">
          <RiskIndicator probability={fraudProb} />
        </div>

        {/* Model Metrics Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">
              Confidence
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {formatPercentRaw(confidence, 2)}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">
              Risk Category
            </span>
            <span
              className={`text-sm font-bold ${
                result.riskLevel === "HIGH"
                  ? "text-red-600 dark:text-red-400"
                  : result.riskLevel === "MEDIUM"
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {result.riskLevel || (fraudProb >= 70 ? "HIGH" : fraudProb >= 40 ? "MEDIUM" : "LOW")}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 uppercase block">
              Inference Time
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-400 truncate block">
              {result.predictionTime ? formatDateTime(result.predictionTime) : "Real-time"}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
