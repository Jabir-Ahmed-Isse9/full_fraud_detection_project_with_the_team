import React, { useState, useEffect } from "react";
import { Download } from "lucide-react";
import PredictionFilters from "../components/history/PredictionFilters";
import PredictionTable from "../components/history/PredictionTable";
import Button from "../components/common/Button";
import Card, { CardHeader, CardContent } from "../components/common/Card";
import Skeleton from "../components/common/Skeleton";
import {
  getPredictionHistory,
  deletePrediction,
} from "../services/predictionService";

export default function PredictionHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedModel, setSelectedModel] = useState("ALL");
  const [selectedOutcome, setSelectedOutcome] = useState("ALL");
  const [error, setError] = useState(null);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const { records } = await getPredictionHistory({
        search: searchTerm,
        type: selectedType,
        model: selectedModel,
        prediction: selectedOutcome === "FRAUD" ? 1 : selectedOutcome === "LEGITIMATE" ? 0 : undefined,
      });
      setHistory(records);
    } catch (requestError) {
      setError(requestError.message || "Could not load prediction history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(loadHistory, 250);
    return () => clearTimeout(debounce);
  }, [searchTerm, selectedType, selectedModel, selectedOutcome]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this saved prediction record?")) return;
    try {
      await deletePrediction(id);
      await loadHistory();
    } catch (requestError) {
      setError(requestError.message || "Could not delete the prediction.");
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedType("ALL");
    setSelectedModel("ALL");
    setSelectedOutcome("ALL");
  };

  const handleExportCSV = () => {
    if (history.length === 0) return;
    const headers = [
      "Timestamp",
      "Type",
      "Amount",
      "Model",
      "Prediction",
      "FraudProbability",
      "Confidence",
      "RiskLevel",
      "Status",
    ];
    const rows = history.map((item) => [
      item.timestamp,
      item.type,
      item.amount,
      `"${item.model}"`,
      `"${item.prediction}"`,
      item.fraudProbability,
      item.confidence,
      item.riskLevel,
      `"${item.status}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `paysim_predictions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Audited Inference Logs ({history.length})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Timestamped record of transaction evaluations, latency, and risk classification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                icon={Download}
                onClick={handleExportCSV}
              >
                Export CSV
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Filter Controls */}
      <PredictionFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        selectedOutcome={selectedOutcome}
        onOutcomeChange={setSelectedOutcome}
        onResetFilters={handleResetFilters}
      />

      {/* Table Content */}
      {error ? (
        <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      ) : loading ? (
        <Skeleton className="h-96 rounded-xl" />
      ) : (
        <PredictionTable
          predictions={history}
          searchTerm={searchTerm}
          selectedType={selectedType}
          selectedModel={selectedModel}
          selectedOutcome={selectedOutcome}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
