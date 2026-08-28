import React from "react";
import {
  BrainCircuit,
  Database,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Sparkles,
  GitBranch,
  Layers,
  CheckCircle2,
  FileCode,
  LineChart,
} from "lucide-react";
import Card, { CardHeader, CardContent } from "../components/common/Card";
import Badge from "../components/common/Badge";

export default function AboutModel() {
  const workflowSteps = [
    {
      title: "Raw Transaction",
      desc: "Step, Type, Amount, Balances (Orig & Dest)",
      icon: Database,
      color: "bg-blue-500 text-white",
    },
    {
      title: "Data Preprocessing",
      desc: "Imputation, Outlier Handling, Validation",
      icon: Layers,
      color: "bg-indigo-500 text-white",
    },
    {
      title: "Feature Transformation",
      desc: "One-Hot Encoding, Balance Deltas, Scaling",
      icon: GitBranch,
      color: "bg-purple-500 text-white",
    },
    {
      title: "Machine Learning Model",
      desc: "Logistic Regression & Random Forest",
      icon: Cpu,
      color: "bg-blue-600 text-white",
    },
    {
      title: "Fraud Probability",
      desc: "Calibrated Softmax / Tree Voting Probabilities",
      icon: LineChart,
      color: "bg-amber-500 text-white",
    },
    {
      title: "Risk Classification",
      desc: "Low (<40%), Medium (40-69%), High (≥70%)",
      icon: BrainCircuit,
      color: "bg-orange-500 text-white",
    },
    {
      title: "Final Decision",
      desc: "Legitimate (Approved) or Fraudulent (Blocked)",
      icon: ShieldCheck,
      color: "bg-emerald-600 text-white",
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Title & Overview */}
      <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              PaySim Financial Fraud Detection System
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Academic Research &amp; Machine Learning Production Pipeline
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-2">
          This system provides an end-to-end evaluation and real-time inference platform for detecting financial fraud in mobile money transfers. Trained on the benchmark <strong>PaySim</strong> synthetic dataset, the system compares generalized linear modeling with non-linear ensemble methods to deliver explainable fraud interception.
        </p>
      </div>

      {/* WORKFLOW VISUALIZATION */}
      <Card>
        <CardHeader
          title="Machine Learning Inference Pipeline Workflow"
          subtitle="Sequential processing stages from raw transaction ingestion to risk policy determination"
        />
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 pt-2">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="relative flex flex-col items-center text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 transition-all hover:border-blue-400"
                >
                  <div
                    className={`w-9 h-9 rounded-xl ${step.color} flex items-center justify-center mb-2 shadow-xs`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono">
                    {idx + 1}. {step.title}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                    {step.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* WHY THESE MODELS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logistic Regression Explanation */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Why Logistic Regression?
                </h3>
              </div>
              <Badge variant="default">Baseline Classifier</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <p className="leading-relaxed">
              Logistic Regression applies a sigmoid activation over a weighted linear combination of balance differentials and categorical indicators.
            </p>
            <div className="space-y-2 pt-1">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-slate-100">Interpretable Odds Ratios:</strong> Coefficients directly translate to log-odds changes for regulatory auditability and compliance.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-slate-100">Ultra-High Throughput:</strong> Minimal computation per record (<span className="font-mono">~1.4ms</span> latency), ideal for high-volume gateway filtering.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-slate-100">Strong Linear Baseline:</strong> Quickly detects standard transfer amounts matching origin balances.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Random Forest Explanation */}
        <Card className="border-blue-300 dark:border-blue-900/60 bg-blue-50/10 dark:bg-blue-950/10">
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Why Random Forest?
                </h3>
              </div>
              <Badge variant="success" dot>Top Performer (94.7% F1)</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <p className="leading-relaxed">
              Random Forest constructs an ensemble of 100 decorrelated decision trees with bootstrap aggregation and random feature sub-spacing.
            </p>
            <div className="space-y-2 pt-1">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-slate-100">Non-Linear Boundary Discovery:</strong> Captures high-order feature interactions (e.g. <code>oldbalanceOrg == amount</code> simultaneous with <code>newbalanceOrig == 0</code>).
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-slate-100">Superior Recall (91.26%):</strong> Identifies sophisticated fraud cases that escape linear hyperplanes.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-slate-100">Robust to Skew &amp; Noise:</strong> Designed for highly imbalanced fraud classes without severe over-fitting.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dataset & Backend Architecture Specs */}
      <Card>
        <CardHeader
          title="Artifact Serialization &amp; Deployment Architecture"
          subtitle="Model persistence, scikit-learn pipelines, and API layer"
        />
        <CardContent className="space-y-3 text-xs font-mono text-slate-600 dark:text-slate-400">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-1.5 text-slate-900 dark:text-slate-100 font-bold mb-2">
                <FileCode className="w-4 h-4 text-blue-500" />
                <span>Joblib Model Files</span>
              </div>
              <ul className="space-y-1 text-[11px]">
                <li><code>.logistic_model_for_fraud_detection.joblib</code></li>
                <li><code>.random_forest_model_for_fraud_detection.joblib</code></li>
              </ul>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-1.5 text-slate-900 dark:text-slate-100 font-bold mb-2">
                <Database className="w-4 h-4 text-emerald-500" />
                <span>Environment Configuration</span>
              </div>
              <ul className="space-y-1 text-[11px]">
                <li><code>VITE_API_URL</code>: Base URL for Python API</li>
                <li>Fallback mode: Automatic calibrated research simulator</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
