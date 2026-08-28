import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import FraudDetection from "./pages/FraudDetection";
import ModelComparison from "./pages/ModelComparison";
import DatasetAnalytics from "./pages/DatasetAnalytics";
import PredictionHistory from "./pages/PredictionHistory";
import AboutModel from "./pages/AboutModel";

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/fraud-detection" element={<FraudDetection />} />
          <Route path="/model-comparison" element={<ModelComparison />} />
          <Route path="/dataset-analytics" element={<DatasetAnalytics />} />
          <Route path="/prediction-history" element={<PredictionHistory />} />
          <Route path="/about" element={<AboutModel />} />
          {/* Fallback to Dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
