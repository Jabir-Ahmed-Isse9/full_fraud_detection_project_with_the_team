import React from "react";
import { Info } from "lucide-react";
import Badge from "../common/Badge";
import { formatPercentRaw } from "../../utils/formatters";

export default function ModelComparisonTable({ models = {} }) {
  const lr = models.logistic_regression || { name: "Logistic Regression", algorithm: "Not configured" };
  const rf = models.random_forest || { name: "Random Forest", algorithm: "Not configured" };
  const metric = (value) => value === null || value === undefined ? "Not configured" : formatPercentRaw(value);

  return (
    <div className="space-y-4">
      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3.5 px-4 font-semibold">Model &amp; Architecture</th>
              <th className="py-3.5 px-4 font-semibold">Accuracy</th>
              <th className="py-3.5 px-4 font-semibold">Precision</th>
              <th className="py-3.5 px-4 font-semibold">Recall</th>
              <th className="py-3.5 px-4 font-semibold">F1 Score</th>
              <th className="py-3.5 px-4 font-semibold">ROC-AUC</th>
              <th className="py-3.5 px-4 font-semibold">Latency</th>
              <th className="py-3.5 px-4 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
            {/* Logistic Regression */}
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
              <td className="py-4 px-4">
                <div className="font-sans font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  {lr.name}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xs font-mono">
                  {lr.algorithm}
                </div>
              </td>
              <td className="py-4 px-4 font-bold">{metric(lr.accuracy)}</td>
              <td className="py-4 px-4 text-blue-600 dark:text-blue-400 font-bold">
                {metric(lr.precision)}
              </td>
              <td className="py-4 px-4 text-amber-600 dark:text-amber-400 font-bold">
                {metric(lr.recall)}
              </td>
              <td className="py-4 px-4 font-bold">{metric(lr.f1Score)}</td>
              <td className="py-4 px-4">{metric(lr.rocAuc)}</td>
              <td className="py-4 px-4 text-slate-500">{lr.inferenceLatency}</td>
              <td className="py-4 px-4 text-right">
                <Badge variant={lr.status === "evaluated" ? "success" : "warning"}>
                  {lr.status || "not_configured"}
                </Badge>
              </td>
            </tr>

            <tr className="bg-blue-50/30 dark:bg-blue-950/20 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-colors">
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  <span className="font-sans font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {rf.name}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xs font-mono">
                  {rf.algorithm}
                </div>
              </td>
              <td className="py-4 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                {metric(rf.accuracy)}
              </td>
              <td className="py-4 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                {metric(rf.precision)}
              </td>
              <td className="py-4 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                {metric(rf.recall)}
              </td>
              <td className="py-4 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                {metric(rf.f1Score)}
              </td>
              <td className="py-4 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                {metric(rf.rocAuc)}
              </td>
              <td className="py-4 px-4 text-slate-500">{rf.inferenceLatency}</td>
              <td className="py-4 px-4 text-right">
                <Badge variant={rf.status === "evaluated" ? "success" : "warning"}>
                  {rf.status || "not_configured"}
                </Badge>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Academic / Research Interpretation Notice */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            Methodological Note on Class Imbalance &amp; Evaluation Integrity:
          </p>
          <p className="leading-relaxed">
            "Accuracy can be misleading for highly imbalanced fraud datasets. Precision, recall, F1 score, and ROC-AUC provide a more meaningful assessment of fraud detection performance."
          </p>
        </div>
      </div>
    </div>
  );
}
