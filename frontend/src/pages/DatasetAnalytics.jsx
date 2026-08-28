import React from "react";
import { BarChart3, Database, ShieldAlert, AlertCircle, Info } from "lucide-react";
import DatasetStats from "../components/analytics/DatasetStats";
import TransactionTypeChart from "../components/analytics/TransactionTypeChart";
import RiskDistributionChart from "../components/dashboard/RiskDistributionChart";
import AmountDistributionChart from "../components/analytics/AmountDistributionChart";
import FraudDistributionChart from "../components/dashboard/FraudDistributionChart";
import DashboardCard from "../components/dashboard/DashboardCard";
import Card from "../components/common/Card";
import Skeleton from "../components/common/Skeleton";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import { useDashboard } from "../hooks/useDashboard";

export default function DatasetAnalytics() {
  const { data, loading, error, refresh } = useDashboard();

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to Load Dataset Analytics"
        message={error}
        onRetry={refresh}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Overview KPI Cards */}
      <DatasetStats stats={data} />

      {data?.totalPredictions === 0 && (
        <EmptyState
          icon={Database}
          title="No prediction data available yet"
          description="Submit your first transaction to populate dataset analytics."
        />
      )}

      {/* Primary Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 1: Fraud vs Non-Fraud */}
        <DashboardCard
          title="Saved Prediction Distribution"
          subtitle="Fraud and not-fraud outcomes from the live prediction history"
        >
          <FraudDistributionChart data={data?.fraudDistribution} />
        </DashboardCard>

        {/* CHART 2: Transaction Type Distribution */}
        <DashboardCard
          title="Saved Predictions by Payment Type"
          subtitle="Frequency breakdown across transaction types"
        >
          <TransactionTypeChart data={data?.transactionTypes} />
        </DashboardCard>
      </div>

      {/* Secondary Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 3: Fraud Occurrence strictly by Type */}
        <DashboardCard
          title="Risk Classification Distribution"
          subtitle="Live risk levels derived from saved fraud probabilities"
        >
          <RiskDistributionChart data={data?.riskDistribution} />
        </DashboardCard>

        {/* CHART 4: Transaction Amount Distribution */}
        <DashboardCard
          title="Saved Transaction Amount Distribution"
          subtitle="Legitimate and fraud prediction counts by amount tier"
        >
          <AmountDistributionChart data={data?.amountDistribution} />
        </DashboardCard>
      </div>

      {/* Academic Research Insights on PaySim Structure */}
      <Card className="border-blue-200 dark:border-blue-900/40 bg-blue-50/20 dark:bg-blue-950/20">
        <div className="flex items-start gap-3.5">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            <h4 className="font-bold text-slate-900 dark:text-slate-100">
              Key Academic Insights on PaySim Feature Engineering:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 leading-relaxed">
              <li>
                <strong>Behavioral Fraud Isolation:</strong> In PaySim, fraudulent agents execute two paired steps: initiating a fraudulent <code>TRANSFER</code> to empty a victim's account, followed by immediate <code>CASH_OUT</code> to convert funds.
              </li>
              <li>
                <strong>Zero-Balance Anomalies:</strong> A key predictor is <code>newbalanceOrig == 0</code> when <code>oldbalanceOrg == amount</code> (complete balance drainage).
              </li>
              <li>
                <strong>Class Imbalance:</strong> PaySim is highly imbalanced, so precision, recall, F1, and ROC-AUC should be considered alongside accuracy when interpreting the evaluated models.
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
