import React from "react";
import { ShieldCheck, AlertTriangle, AlertOctagon } from "lucide-react";
import { getRiskClassification, formatPercentRaw } from "../../utils/formatters";

export default function RiskIndicator({ probability = 0, showGauge = true, size = "md" }) {
  const probNum = Math.min(Math.max(Number(probability) || 0, 0), 100);
  const risk = getRiskClassification(probNum);

  const getIcon = () => {
    if (risk.level === "HIGH") {
      return <AlertOctagon className="w-5 h-5 text-red-500" />;
    }
    if (risk.level === "MEDIUM") {
      return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    }
    return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getIcon()}
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
              Risk Level
            </span>
            <span
              className={`text-sm sm:text-base font-bold font-mono tracking-tight ${
                risk.level === "HIGH"
                  ? "text-red-600 dark:text-red-400"
                  : risk.level === "MEDIUM"
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {risk.label}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
            Fraud Probability
          </span>
          <span className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-white">
            {formatPercentRaw(probNum, 2)}
          </span>
        </div>
      </div>

      {showGauge && (
        <div className="space-y-1.5">
          {/* Segmented Progress Bar */}
          <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 flex border border-slate-200 dark:border-slate-700/60">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${risk.barColor}`}
              style={{ width: `${Math.max(probNum, 3)}%` }}
            />
          </div>

          {/* Scale Legend */}
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              Low (0–39%)
            </span>
            <span className="text-amber-600 dark:text-amber-400 font-medium">
              Med (40–69%)
            </span>
            <span className="text-red-600 dark:text-red-400 font-medium">
              High (70–100%)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
