import React from "react";
import { Database, ShieldAlert, ShieldCheck, Percent, AlertTriangle } from "lucide-react";
import Card from "../common/Card";
import { formatNumber, formatPercentRaw } from "../../utils/formatters";

export default function DatasetStats({ stats = {} }) {
  const statItems = [
    {
      label: "Saved Predictions",
      value: formatNumber(stats.totalPredictions),
      explanation: "Persisted inference audit records",
      icon: Database,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/60",
    },
    {
      label: "Legitimate Instances",
      value: formatNumber(stats.legitimateTransactions),
      explanation: "Saved results classified as not fraud",
      icon: ShieldCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/60",
    },
    {
      label: "Fraudulent Instances",
      value: formatNumber(stats.fraudTransactions),
      explanation: "Saved results classified as fraud",
      icon: ShieldAlert,
      color: "text-red-500",
      bg: "bg-red-50 dark:bg-red-950/60",
    },
    {
      label: "Fraud Base Rate",
      value: formatPercentRaw(stats.fraudPercentage, 2),
      explanation: "Share of saved predictions",
      icon: Percent,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/60",
    },
    {
      label: "High Risk",
      value: formatNumber(stats.highRisk),
      explanation: "Fraud probability at or above 70%",
      icon: AlertTriangle,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-950/60",
    },
    {
      label: "Medium Risk",
      value: formatNumber(stats.mediumRisk),
      explanation: "Fraud probability from 40% to 69.99%",
      icon: AlertTriangle,
      color: "text-indigo-500",
      bg: "bg-indigo-50 dark:bg-indigo-950/60",
    },
    {
      label: "Low Risk",
      value: formatNumber(stats.lowRisk),
      explanation: "Fraud probability below 40%",
      icon: ShieldCheck,
      color: "text-cyan-500",
      bg: "bg-cyan-50 dark:bg-cyan-950/60",
    },
    {
      label: "Transaction Types",
      value: formatNumber(stats.transactionTypes?.filter((item) => item.count > 0).length),
      explanation: "Types represented in saved predictions",
      icon: AlertTriangle,
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-950/60",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card key={index} hover className="transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                  {item.label}
                </span>
                <div className="text-xl font-bold text-slate-900 dark:text-white font-mono tracking-tight">
                  {item.value}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                  {item.explanation}
                </p>
              </div>
              <div
                className={`w-9 h-9 rounded-lg ${item.bg} ${item.color} flex items-center justify-center shrink-0 border border-slate-200/50 dark:border-slate-800`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
