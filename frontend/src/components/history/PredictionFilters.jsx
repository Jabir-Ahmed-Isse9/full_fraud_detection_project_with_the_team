import React from "react";
import { Search, Filter, RotateCcw } from "lucide-react";
import Button from "../common/Button";
import { TRANSACTION_TYPES } from "../../utils/constants";

export default function PredictionFilters({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedModel,
  onModelChange,
  selectedOutcome,
  onOutcomeChange,
  onResetFilters,
}) {
  return (
    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search input */}
        <div className="relative lg:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search origin or destination account..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Transaction Type Filter */}
        <div>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full py-2 px-3 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Types</option>
            {TRANSACTION_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Prediction Outcome Filter */}
        <div>
          <select
            value={selectedOutcome}
            onChange={(e) => onOutcomeChange(e.target.value)}
            className="w-full py-2 px-3 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Outcomes</option>
            <option value="FRAUD">Fraudulent Only</option>
            <option value="LEGITIMATE">Legitimate Only</option>
          </select>
        </div>

        {/* Model Filter & Reset */}
        <div className="flex items-center gap-2">
          <select
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value)}
            className="w-full py-2 px-3 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Models</option>
            <option value="random_forest">Random Forest</option>
            <option value="logistic_regression">Logistic Regression</option>
          </select>

          <Button
            variant="ghost"
            size="icon"
            onClick={onResetFilters}
            title="Reset Filters"
            className="shrink-0 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
