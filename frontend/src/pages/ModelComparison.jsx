import React from "react";
import { GitCompare, Award, FileText, CheckCircle } from "lucide-react";
import ModelComparisonTable from "../components/models/ModelComparisonTable";
import ModelPerformanceChart from "../components/models/ModelPerformanceChart";
import ModelCard from "../components/models/ModelCard";
import DashboardCard from "../components/dashboard/DashboardCard";
import Skeleton from "../components/common/Skeleton";
import ErrorState from "../components/common/ErrorState";
import { useModelMetrics } from "../hooks/useModelMetrics";

export default function ModelComparison() {
  const { metrics, loading, error, refresh } = useModelMetrics();

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to Load Model Evaluation Metrics"
        message={error}
        onRetry={refresh}
      />
    );
  }

  const lrData = metrics?.models?.logistic_regression;
  const rfData = metrics?.models?.random_forest;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Comparative Evaluation Table */}
      <DashboardCard
        title="Comparative Evaluation Matrix"
        subtitle="Empirical benchmark performance across test split on PaySim dataset"
      >
        <ModelComparisonTable models={metrics?.models} />
      </DashboardCard>

      {/* Visual Chart Comparison */}
      <DashboardCard
        title="Multi-Metric Benchmark Chart"
        subtitle="Side-by-side grouped evaluation of key machine-learning performance metrics"
      >
        <ModelPerformanceChart data={metrics?.comparison} />
      </DashboardCard>

      {/* Detailed Individual Model Architecture Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
            Model Architecture &amp; Artifact Details
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Serialized Scikit-Learn .joblib
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Logistic Regression Card */}
          <ModelCard
            modelData={lrData}
            isBestModel={false}
            joblibFilename=".logistic_model_for_fraud_detection.joblib"
          />

          {/* Random Forest Card */}
          <ModelCard
            modelData={rfData}
            isBestModel={false}
            joblibFilename=".random_forest_model_for_fraud_detection.joblib"
          />
        </div>
      </div>
    </div>
  );
}
