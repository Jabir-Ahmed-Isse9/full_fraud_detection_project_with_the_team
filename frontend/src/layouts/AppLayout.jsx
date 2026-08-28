import React, { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

export default function AppLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const stored = localStorage.getItem("paysim_theme");
      if (stored) return stored === "dark";
      return true; // Default to dark background as preferred by user
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add("dark");
        document.body.classList.add("dark");
        document.body.style.backgroundColor = "#020617"; // Slate 950
        localStorage.setItem("paysim_theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        document.body.classList.remove("dark");
        document.body.style.backgroundColor = "#ffffff"; // Pure white
        localStorage.setItem("paysim_theme", "light");
      }
    } catch (e) {
      console.warn("Theme sync error", e);
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors duration-200 flex">
      {/* Permanent Desktop & Responsive Drawer Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 bg-white dark:bg-slate-950 transition-colors duration-200">
        <Header
          onMenuClick={() => setIsSidebarOpen(true)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto bg-white dark:bg-slate-950 transition-colors duration-200">
          {children}
        </main>

        {/* Academic Presentation Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 py-4 px-6 text-center text-xs text-slate-500 dark:text-slate-400 font-mono transition-colors duration-200">
          <span>PaySim Fraud Detection Intelligence Platform</span>
          <span className="mx-2">•</span>
          <span>Logistic Regression &amp; Random Forest Classifiers</span>
          <span className="mx-2 hidden sm:inline">•</span>
          <span className="hidden sm:inline">Research &amp; Conference Demonstration</span>
        </footer>
      </div>
    </div>
  );
}
