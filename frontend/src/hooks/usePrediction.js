/**
 * Hook to manage transaction submission, model evaluation, and prediction results state
 */

import { useState } from "react";
import { predictTransaction, compareModels } from "../services/predictionService";
import { MODEL_IDS } from "../utils/constants";

export function usePrediction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [predictionData, setPredictionData] = useState(null);

  const runPrediction = async (formData, selectedModelId) => {
    setLoading(true);
    setError(null);
    try {
      let result;
      if (selectedModelId === MODEL_IDS.COMPARE_BOTH) {
        result = await compareModels(formData);
      } else {
        result = await predictTransaction(formData, selectedModelId);
      }
      setPredictionData(result);
      return result;
    } catch (err) {
      setError(err.message || "Failed to analyze transaction.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPrediction = () => {
    setPredictionData(null);
    setError(null);
  };

  return {
    loading,
    error,
    predictionData,
    runPrediction,
    resetPrediction,
  };
}
