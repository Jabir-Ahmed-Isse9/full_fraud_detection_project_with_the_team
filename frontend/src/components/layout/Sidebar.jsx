import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShieldCheck,
  GitCompare,
  BarChart3,
  History,
  BrainCircuit,
  X,
  Server,
  Activity,
  UserCheck,
  Layers,
} from "lucide-react";
import { APP_NAME, APP_VERSION } from "../../utils/constants";
import { checkApiHealth } from "../../services/api";

const NAV_ITEMS = [
  {
    path: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    path: "/fraud-detection",
    label: "Fraud Detection",
    icon: ShieldCheck,
    badge: "Live",
  },
  {
    path: "/model-comparison",
    label: "Model Comparison",
    icon: GitCompare,
    badge: null,
  },
  {
    path: "/dataset-analytics",
    label: "Dataset Analytics",
    icon: BarChart3,
    badge: null,
  },
  {
    path: "/prediction-history",
    label: "Prediction History",
    icon: History,
    badge: null,
  },
  {
    path: "/about",
    label: "About Model",
    icon: BrainCircuit,
    badge: null,
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const [apiStatus, setApiStatus] = useState({
    connected: false,
    mode: "Checking...",
    checking: true,
  });

  useEffect(() => {
    let mounted = true;
    const refreshHealth = () => checkApiHealth().then((status) => {
      if (mounted) {
        setApiStatus({ connected: status.connected, mode: status.mode, checking: false });
      }
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

  // Close mobile drawer on route change
  useEffect(() => {
    if (isOpen && onClose) {
      onClose();
    }
  }, [location.pathname]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white block">
                {APP_NAME}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono block">
                ML Defense & Analytics
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="lg:hidden text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-1.5">
          <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
            Navigation Menu
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                id={`nav-link-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xs font-semibold"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-mono bg-blue-100 text-blue-700 dark:bg-blue-500/30 dark:text-blue-200 border border-blue-200 dark:border-blue-400/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* System & Model Status Panel */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50 space-y-3 shrink-0">
          <div className="rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-3 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  {apiStatus.connected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${apiStatus.connected ? "bg-emerald-500" : "bg-red-500"}`}></span>
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{apiStatus.connected ? "AI System Online" : "AI System Offline"}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{APP_VERSION}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/60 text-[11px]">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">API Engine</span>
                <span
                  className={`font-mono font-medium ${
                    apiStatus.connected ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {apiStatus.connected ? "Connected" : "Disconnected"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Active Models</span>
                <span className="font-mono text-blue-600 dark:text-blue-400 font-medium">LR &amp; RF (2)</span>
              </div>
            </div>
          </div>

          {/* User / Research Profile */}
          <div className="flex items-center justify-between px-1 pt-1 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <span className="font-medium text-slate-800 dark:text-slate-200 block text-xs truncate">
                  ML Researcher
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">PaySim Evaluator</span>
              </div>
            </div>
            <Activity className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
          </div>
        </div>
      </aside>
    </>
  );
}
