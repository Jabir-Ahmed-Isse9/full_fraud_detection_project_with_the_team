import React, { useState, useMemo } from "react";
import {
  ArrowUpDown,
  ShieldAlert,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import Badge from "../common/Badge";
import Button from "../common/Button";
import EmptyState from "../common/EmptyState";
import PredictionStatus from "./PredictionStatus";
import {
  formatCurrency,
  formatDateTime,
  formatPercentRaw,
  getRiskClassification,
} from "../../utils/formatters";

export default function PredictionTable({
  predictions = [],
  searchTerm = "",
  selectedType = "ALL",
  selectedModel = "ALL",
  selectedOutcome = "ALL",
  onSelectTransaction,
  onDelete,
}) {
  const [sortField, setSortField] = useState("timestamp");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const filteredData = useMemo(() => {
    return predictions.filter((item) => {
      // Search
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        item.id?.toLowerCase().includes(query) ||
        item.nameOrig?.toLowerCase().includes(query) ||
        item.nameDest?.toLowerCase().includes(query) ||
        item.type?.toLowerCase().includes(query) ||
        item.model?.toLowerCase().includes(query) ||
        String(item.amount).includes(query);

      // Type Filter
      const matchesType = selectedType === "ALL" || item.type === selectedType;

      // Model Filter
      const matchesModel =
        selectedModel === "ALL" || item.modelId === selectedModel;

      // Outcome Filter
      const matchesOutcome =
        selectedOutcome === "ALL" ||
        (selectedOutcome === "FRAUD" && item.isFraud) ||
        (selectedOutcome === "LEGITIMATE" && !item.isFraud);

      return matchesSearch && matchesType && matchesModel && matchesOutcome;
    });
  }, [predictions, searchTerm, selectedType, selectedModel, selectedOutcome]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === "timestamp") {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else if (sortField === "amount" || sortField === "fraudProbability" || sortField === "confidence") {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortField, sortOrder]);

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  if (predictions.length === 0 || sortedData.length === 0) {
    return (
      <EmptyState
        title="No prediction history records found"
        description="Run fraud inference on transactions in the Fraud Detection tab to generate audit records."
      />
    );
  }

  return (
    <div className="space-y-3">
      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[11px]">
            <tr>
              <th
                onClick={() => handleSort("timestamp")}
                className="py-3.5 px-4 font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-slate-100"
              >
                <div className="flex items-center gap-1.5">
                  <span>Timestamp</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-semibold">Type</th>
              <th
                onClick={() => handleSort("amount")}
                className="py-3.5 px-4 font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-slate-100"
              >
                <div className="flex items-center gap-1.5">
                  <span>Amount</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-semibold">Model</th>
              <th className="py-3.5 px-4 font-semibold">Prediction</th>
              <th
                onClick={() => handleSort("fraudProbability")}
                className="py-3.5 px-4 font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-slate-100"
              >
                <div className="flex items-center gap-1.5">
                  <span>Fraud Prob</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-semibold">Risk Level</th>
              <th className="py-3.5 px-4 font-semibold text-right">Audit Status</th>
              {onDelete && <th className="py-3.5 px-4 font-semibold text-right">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
            {paginatedData.map((item) => {
              const risk = getRiskClassification(item.fraudProbability);
              return (
                <tr
                  key={item.id}
                  className={`transition-colors ${
                    item.isFraud
                      ? "bg-red-50/20 hover:bg-red-50/40 dark:bg-red-950/15 dark:hover:bg-red-950/25"
                      : "hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                  }`}
                >
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {formatDateTime(item.timestamp)}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 max-w-[140px] truncate">
                    {item.model}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      {item.isFraud ? (
                        <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
                      ) : (
                        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      )}
                      <span
                        className={`font-semibold ${
                          item.isFraud
                            ? "text-red-700 dark:text-red-400"
                            : "text-emerald-700 dark:text-emerald-400"
                        }`}
                      >
                        {item.isFraud ? "FRAUD" : "LEGITIMATE"}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold">
                    {formatPercentRaw(item.fraudProbability, 2)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        risk.level === "HIGH"
                          ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                          : risk.level === "MEDIUM"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      }`}
                    >
                      {item.riskLevel || risk.level}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <PredictionStatus status={item.status} isFraud={item.isFraud} />
                  </td>
                  {onDelete && (
                    <td className="py-3.5 px-4 text-right">
                      <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-700 dark:text-red-400">
                        Delete
                      </Button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 px-1 pt-1">
        <span>
          Showing {(currentPage - 1) * pageSize + 1}–
          {Math.min(currentPage * pageSize, sortedData.length)} of{" "}
          {sortedData.length} records
        </span>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          >
            <ChevronLeft className="w-3.5 h-3.5 mr-1" />
            Previous
          </Button>
          <span className="px-2 py-1">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          >
            Next
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
