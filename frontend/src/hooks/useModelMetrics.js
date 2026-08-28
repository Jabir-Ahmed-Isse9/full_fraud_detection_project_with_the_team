/**
 * Hook to manage model evaluation metrics and comparison data
 */

import { useState, useEffect, useCallback } from "react";
import { getModelMetrics } from "../services/predictionService";

export function useModelMetrics() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getModelMetrics();
      setMetrics(data);
    } catch (err) {
      setError(err.message || "Failed to load model evaluation metrics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    loading,
    error,
    refresh: fetchMetrics,
  };
}
