/**
 * Hook to manage executive dashboard metrics and chart series data
 */

import { useState, useEffect, useCallback } from "react";
import { getDashboardStatistics } from "../services/predictionService";

export function useDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const stats = await getDashboardStatistics();
      setData(stats);
    } catch (err) {
      setError(err.message || "Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const onPredictionDataChanged = () => fetchStats();
    window.addEventListener("prediction-data-changed", onPredictionDataChanged);
    const interval = window.setInterval(fetchStats, 60000);
    return () => {
      window.removeEventListener("prediction-data-changed", onPredictionDataChanged);
      window.clearInterval(interval);
    };
  }, [fetchStats]);

  return {
    data,
    loading,
    error,
    refresh: fetchStats,
  };
}
