import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  Sun,
  Moon,
  Shield,
  Activity,
  Zap,
  Info,
  ExternalLink,
} from "lucide-react";
import Button from "../common/Button";
import Modal from "../common/Modal";
import Badge from "../common/Badge";
import { checkApiHealth } from "../../services/api";

const PAGE_TITLES = {
  "/": {
    title: "Fraud Detection Intelligence",
    subtitle: "Machine Learning–Based Financial Transaction Risk Analysis",
  },
  "/fraud-detection": {
    title: "Test a Transaction",
    subtitle: "Real-time inference using trained Logistic Regression & Random Forest models",
  },
  "/model-comparison": {
    title: "Model Performance Evaluation",
    subtitle: "Comparative evaluation of trained fraud detection models on PaySim",
  },
  "/dataset-analytics": {
    title: "Dataset Analytics",
    subtitle: "Statistical distributions and class imbalance dynamics of PaySim",
  },
  "/prediction-history": {
    title: "Prediction History",
    subtitle: "Audited log of inference runs and risk classification outcomes",
  },
  "/about": {
    title: "About the Fraud Detection System",
    subtitle: "Machine learning architecture, preprocessing pipelines, and algorithms",
  },
};

export default function Header({ onMenuClick, darkMode, setDarkMode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [apiInfo, setApiInfo] = useState({ connected: false, mode: "Checking...", baseUrl: null });
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const currentInfo = PAGE_TITLES[location.pathname] || {
    title: "PaySim Fraud Intelligence",
    subtitle: "Financial Machine Learning Platform",
  };

  useEffect(() => {
    let mounted = true;
    const refreshHealth = () => checkApiHealth().then((res) => {
      if (mounted) setApiInfo(res);
    });
    refreshHealth();
    const interval = window.setInterval(refreshHealth, 30000);
    window.addEventListener("prediction-data-changed", refreshHealth);
    return () => {
      mounted = false;
      window.clearInterval(interval);
      window.removeEventListener("prediction-data-changed", refreshHealth);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            id="mobile-sidebar-toggle"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="truncate">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 truncate">
              {currentInfo.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block truncate">
              {currentInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right: API Status, Quick Test, Theme Toggle, System Info */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Test Shortcut Button */}
          {location.pathname !== "/fraud-detection" && (
            <Button
              variant="accent"
              size="sm"
              icon={Zap}
              onClick={() => navigate("/fraud-detection")}
              className="hidden md:inline-flex"
            >
              Test Transaction
            </Button>
          )}

          {/* API Connectivity Badge */}
          <div
            onClick={() => setIsInfoModalOpen(true)}
            className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs font-mono text-slate-700 dark:text-slate-300 cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-all"
            title="Click for System & API Diagnostics"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                apiInfo.connected ? "bg-emerald-500 animate-pulse" : "bg-blue-500"
              }`}
            />
            <span className="text-[11px] font-medium">
              {apiInfo.connected ? "API Connected" : "API Disconnected"}
            </span>
          </div>

          {/* Background Theme Switcher Button (One-click toggle between Dark and White background) */}
          <button
            type="button"
            id="bg-theme-toggle-btn"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Switch to White Background" : "Switch to Dark Background"}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition-all shadow-2xs hover:shadow-xs cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700"
          >
            {darkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-slate-200">White Background</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-slate-800">Dark Background</span>
              </>
            )}
          </button>

          {/* Info Modal Trigger */}
          <button
            type="button"
            id="system-info-btn"
            onClick={() => setIsInfoModalOpen(true)}
            aria-label="System details"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* System & Architecture Diagnostics Modal */}
      <Modal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        title="PaySim Machine Learning Diagnostics"
        subtitle="Conference & Research Project Specifications"
      >
        <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                Backend Connection Status:
              </span>
              <Badge variant={apiInfo.connected ? "success" : "danger"} dot>
                {apiInfo.connected ? "Python API Connected" : "API Disconnected"}
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {apiInfo.connected
                ? `Connected to live API at ${apiInfo.baseUrl}. Real-time joblib model execution active.`
                : `The backend could not be reached at ${apiInfo.baseUrl || "the configured API URL"}. Start the Express API and ML service, then retry.`}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-100 mb-1">
                <Shield className="w-4 h-4 text-blue-500" />
                <span>Active Models</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-400 text-[11px]">
                <li>Logistic Regression (.joblib)</li>
                <li>Random Forest (.joblib)</li>
              </ul>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-100 mb-1">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span>Dataset Baseline</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-400 text-[11px]">
                <li>PaySim saved prediction history</li>
                <li>Live MongoDB analytics</li>
              </ul>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsInfoModalOpen(false)}
            >
              Close Diagnostics
            </Button>
          </div>
        </div>
      </Modal>
    </header>
  );
}
