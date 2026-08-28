import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Database,
  ShieldAlert,
  ShieldCheck,
  Percent,
  Award,
  Zap,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
} from "lucide-react";
import StatCard from "../components/dashboard/StatCard";
import DashboardCard from "../components/dashboard/DashboardCard";
import FraudDistributionChart from "../components/dashboard/FraudDistributionChart";
import TransactionTypeChart from "../components/dashboard/TransactionTypeChart";
import ModelComparisonChart from "../components/dashboard/ModelComparisonChart";
import RiskDistributionChart from "../components/dashboard/RiskDistributionChart";
import TransactionAmountChart from "../components/dashboard/TransactionAmountChart";
import Button from "../components/common/Button";
import Skeleton from "../components/common/Skeleton";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import { useDashboard } from "../hooks/useDashboard";
import { formatDateTime, formatNumber, formatPercentRaw } from "../utils/formatters";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data, loading, error, refresh } = useDashboard();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} className="h-28 rounded-xl" />
          ))}
        </div>
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
        title="Failed to Load Dashboard Intelligence"
        message={error}
        onRetry={refresh}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Executive KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
        {/* KPI 1: Total Transactions */}
        <StatCard
          id="stat-total-transactions"
          label="Total Transactions"
          value={formatNumber(data?.totalPredictions)}
          explanation="Saved inference audit records"
          icon={Database}
          iconColor="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-50 dark:bg-blue-950/60"
        />

        {/* KPI 2: Fraudulent Transactions */}
        <StatCard
          id="stat-fraud-transactions"
          label="Fraudulent Events"
          value={formatNumber(data?.fraudTransactions)}
          explanation="Predictions classified as fraud"
          icon={ShieldAlert}
          iconColor="text-red-600 dark:text-red-400"
          iconBg="bg-red-50 dark:bg-red-950/60"
        />

        {/* KPI 3: Legitimate Transactions */}
        <StatCard
          id="stat-legit-transactions"
          label="Legitimate Events"
          value={formatNumber(data?.legitimateTransactions)}
          explanation="Predictions classified as not fraud"
          icon={ShieldCheck}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-950/60"
        />

        {/* KPI 4: Fraud Detection Rate */}
        <StatCard
          id="stat-detection-rate"
          label="Fraud Prediction Rate"
          value={formatPercentRaw(data?.fraudPercentage)}
          explanation="Share of saved predictions"
          icon={Percent}
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-50 dark:bg-amber-950/60"
        />

        {/* KPI 5: Best Model */}
        <StatCard
          id="stat-best-model"
          label="High Risk Results"
          value={formatNumber(data?.highRisk)}
          explanation="Fraud probability at or above 70%"
          icon={Award}
          iconColor="text-purple-600 dark:text-purple-400"
          iconBg="bg-purple-50 dark:bg-purple-950/60"
        />

        {/* KPI 6: Medium Risk Results */}
        <StatCard
          id="stat-medium-risk"
          label="Medium Risk Results"
          value={formatNumber(data?.mediumRisk)}
          explanation="Fraud probability from 40% to 69.99%"
          icon={Activity}
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-50 dark:bg-amber-950/60"
        />

        {/* KPI 7: Low Risk Results */}
        <StatCard
          id="stat-total-predictions"
          label="Low Risk Results"
          value={formatNumber(data?.lowRisk)}
          explanation="Fraud probability below 40%"
          icon={Activity}
          iconColor="text-indigo-600 dark:text-indigo-400"
          iconBg="bg-indigo-50 dark:bg-indigo-950/60"
        />
      </div>

      {data?.totalPredictions === 0 && (
        <EmptyState
          icon={Database}
          title="No prediction data available yet"
          description="Submit your first transaction to populate the dashboard."
          actionLabel="Submit a transaction"
          onAction={() => navigate("/fraud-detection")}
        />
      )}

      {/* Primary Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CHART 1: Transaction Class Distribution */}
        <DashboardCard
          title="Transaction Class Distribution"
          subtitle="Fraud versus not-fraud results in saved predictions"
        >
          <FraudDistributionChart data={data?.fraudDistribution} />
        </DashboardCard>

        {/* CHART 2: Fraud Distribution by Transaction Type */}
        <DashboardCard
          title="Volume by Transaction Type"
          subtitle="Distribution across transaction types in saved predictions"
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dataset-analytics")}
              className="text-xs text-blue-600 dark:text-blue-400 p-0 hover:bg-transparent"
            >
              Details &rarr;
            </Button>
          }
        >
          <TransactionTypeChart data={data?.transactionTypes} />
        </DashboardCard>

        {/* CHART 3: Risk Classification Breakdown */}
        <DashboardCard
          title="Predicted Risk Distribution"
          subtitle="Saved transactions segmented by model fraud probability"
        >
          <RiskDistributionChart data={data?.riskDistribution} />
        </DashboardCard>
      </div>

      {/* Model Performance & Transaction Amount Analysis Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CHART 4: Model Performance Comparison */}
        <DashboardCard
          className="lg:col-span-2"
          title="Model Performance Comparison"
          subtitle="Configured held-out evaluation metrics for the saved models"
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/model-comparison")}
            >
              Full Comparison &rarr;
            </Button>
          }
        >
          <ModelComparisonChart data={data?.modelComparison} />
        </DashboardCard>

        {/* CHART 5: Transaction Amount Analysis */}
        <DashboardCard
          title="Amount Tier Analysis"
          subtitle="Volume of transactions categorized by amount bracket"
        >
          <TransactionAmountChart data={data?.amountDistribution} />
        </DashboardCard>
      </div>

      {/* CHART 6: Fraud Detection Summary & Conference Flow Banner */}
      <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono border border-blue-400/20">
              <Layers className="w-3.5 h-3.5" />
              <span>Machine Learning Research Demonstration Flow</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              Ready to Test Live Financial Transactions?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Evaluate real-time fraud probability using trained Logistic Regression and Random Forest models with dual-model consensus verification.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate("/model-comparison")}
              className="border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
            >
              View Model Metrics
            </Button>
            <Button
              variant="accent"
              size="md"
              icon={Zap}
              onClick={() => navigate("/fraud-detection")}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30"
            >
              Launch Live Prediction
            </Button>
          </div>
        </div>
      </div>

      <p className="text-right text-xs text-slate-500 dark:text-slate-400 font-mono">
        Last updated: {formatDateTime(data?.lastUpdated)}
      </p>
    </div>
  );
}
