import React from "react";
import Card from "../common/Card";

export default function StatCard({
  icon: Icon,
  iconColor = "text-blue-600 dark:text-blue-400",
  iconBg = "bg-blue-50 dark:bg-blue-950/60",
  value,
  label,
  explanation,
  trend,
  trendPositive = true,
  id,
}) {
  return (
    <Card
      id={id}
      hover
      className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1.5 flex-1 min-w-0 pr-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              {value}
            </h3>
            {trend && (
              <span
                className={`text-xs font-medium px-1.5 py-0.5 rounded font-mono ${
                  trendPositive
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                    : "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300"
                }`}
              >
                {trend}
              </span>
            )}
          </div>
          {explanation && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
              {explanation}
            </p>
          )}
        </div>

        {Icon && (
          <div
            className={`w-11 h-11 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0 border border-slate-200/50 dark:border-slate-800 transition-transform group-hover:scale-110 duration-200`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Subtle bottom indicator line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent group-hover:via-blue-500/50 transition-all duration-300" />
    </Card>
  );
}
