import { fetchApi } from "./api";

const MODEL_DETAILS = {
  logistic_regression: { name: "LogisticRegression", algorithm: "LogisticRegression", description: "The saved scikit-learn LogisticRegression pipeline." },
  random_forest: { name: "RandomForestClassifier", algorithm: "RandomForestClassifier", description: "The saved scikit-learn RandomForestClassifier pipeline." },
};

function normaliseTransaction(formData) {
  return {
    step: Number.parseInt(formData.step, 10),
    type: String(formData.type).toUpperCase(),
    amount: Number(formData.amount),
    nameOrig: String(formData.nameOrig).trim(),
    oldbalanceOrg: Number(formData.oldbalanceOrg),
    newbalanceOrig: Number(formData.newbalanceOrig),
    nameDest: String(formData.nameDest).trim(),
    oldbalanceDest: Number(formData.oldbalanceDest),
    newbalanceDest: Number(formData.newbalanceDest),
    isFlaggedFraud: formData.isFlaggedFraud === "Yes" || formData.isFlaggedFraud === 1 || formData.isFlaggedFraud === "1" ? 1 : 0,
  };
}

function unwrap(response) {
  return response?.data ?? response;
}

function notifyPredictionDataChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("prediction-data-changed"));
  }
}

function normalisePrediction(record) {
  const isFraud = Number(record.prediction) === 1;
  const probability = Number(record.probability ?? 0);
  const fraudProbability = record.probabilityPercentage ?? Number((probability * 100).toFixed(2));
  return {
    id: record.predictionId || record._id,
    timestamp: record.predictionTime,
    predictionTime: record.predictionTime,
    type: record.type,
    amount: Number(record.amount),
    nameOrig: record.nameOrig,
    nameDest: record.nameDest,
    model: MODEL_DETAILS[record.modelUsed]?.name || record.modelUsed,
    modelId: record.modelUsed,
    prediction: isFraud ? "FRAUDULENT TRANSACTION" : "LEGITIMATE TRANSACTION",
    isFraud,
    fraudProbability,
    confidence: record.confidence ?? (isFraud ? fraudProbability : Number((100 - fraudProbability).toFixed(2))),
    riskLevel: String(record.riskLevel || "Low").toUpperCase(),
    status: isFraud ? "Flagged & Blocked" : "Approved",
    latency: record.processingTime === undefined ? undefined : `${record.processingTime}ms`,
  };
}

export async function predictTransaction(transactionData, modelName = "random_forest") {
  const response = await fetchApi("/predictions", {
    method: "POST",
    body: JSON.stringify({ ...normaliseTransaction(transactionData), model: modelName }),
  });
  notifyPredictionDataChanged();
  return { isComparison: false, result: normalisePrediction(unwrap(response)) };
}

export async function compareModels(transactionData) {
  const [logistic, randomForest] = await Promise.all([
    predictTransaction(transactionData, "logistic_regression"),
    predictTransaction(transactionData, "random_forest"),
  ]);
  const agreement = logistic.result.isFraud === randomForest.result.isFraud;
  return {
    isComparison: true,
    logisticRegression: logistic.result,
    randomForest: randomForest.result,
    agreement,
    agreementMessage: agreement
      ? "Both saved model pipelines returned the same classification."
      : "The models returned different classifications; review this transaction manually.",
  };
}

function metricValue(value) {
  if (value === null || value === undefined || value === "") return null;
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return Number((Math.abs(numeric) <= 1 ? numeric * 100 : numeric).toFixed(2));
}

function normaliseMetrics(rows) {
  const models = {};
  const list = Array.isArray(rows) ? rows : Object.values(rows || {});
  for (const row of list) {
    const id = row.id || (row.model === "Random Forest" ? "random_forest" : "logistic_regression");
    models[id] = {
      id,
      ...MODEL_DETAILS[id],
      name: row.name || row.model || MODEL_DETAILS[id]?.name,
      algorithm: row.algorithm || MODEL_DETAILS[id]?.algorithm,
      accuracy: metricValue(row.accuracy), precision: metricValue(row.precision),
      recall: metricValue(row.recall), f1Score: metricValue(row.f1),
      rocAuc: metricValue(row.rocAuc ?? row.roc_auc),
      inferenceLatency: row.latency ?? row.inferenceLatency ?? "Not measured",
      status: row.status || "not_configured",
      source: row.source || "configured held-out evaluation",
      strengths: ["Loaded from the configured Joblib pipeline", "Metrics are from held-out evaluation results"],
    };
  }
  const comparison = [["Accuracy", "accuracy"], ["Precision", "precision"], ["Recall", "recall"], ["F1 Score", "f1Score"]]
    .map(([metric, key]) => ({ metric, logistic: models.logistic_regression?.[key] ?? null, randomForest: models.random_forest?.[key] ?? null }));
  return { models, comparison };
}

export async function getDashboardStatistics() {
  const [summaryResponse, chartsResponse] = await Promise.all([
    fetchApi("/dashboard/summary"),
    fetchApi("/dashboard/charts"),
  ]);
  const dashboard = { ...unwrap(summaryResponse), ...unwrap(chartsResponse) };
  const total = Number(dashboard.totalTransactions ?? dashboard.totalPredictions ?? 0);
  const fraud = Number(dashboard.fraudulentEvents ?? dashboard.fraud ?? 0);
  const legitimate = Number(dashboard.legitimateEvents ?? dashboard.notFraud ?? 0);
  const metrics = normaliseMetrics(dashboard.models || dashboard.modelPerformance || []);
  return {
    totalPredictions: total, totalTransactions: total,
    fraudTransactions: fraud, fraudulentEvents: fraud,
    legitimateTransactions: legitimate, legitimateEvents: legitimate,
    fraudPercentage: Number(dashboard.fraudPredictionRate ?? dashboard.fraudPercentage ?? 0),
    notFraudPercentage: Number(dashboard.notFraudPercentage ?? 0),
    highRisk: Number(dashboard.highRiskResults ?? dashboard.highRisk ?? 0),
    mediumRisk: Number(dashboard.mediumRiskResults ?? dashboard.mediumRisk ?? 0),
    lowRisk: Number(dashboard.lowRiskResults ?? dashboard.lowRisk ?? 0),
    fraudDistribution: dashboard.fraudDistribution || dashboard.fraudVsNotFraud || [],
    transactionTypes: (dashboard.transactionTypeDistribution || []).map((row) => ({
      ...row,
      type: row.type || row.name,
      count: Number(row.count ?? row.value ?? 0),
    })),
    riskDistribution: dashboard.riskDistribution || [],
    predictionsOverTime: dashboard.predictionsOverTime || [],
    amountDistribution: dashboard.amountTierAnalysis || dashboard.amountDistribution || [],
    lastUpdated: dashboard.lastUpdated || null,
    modelComparison: metrics.comparison, models: metrics.models,
  };
}

export async function getModelMetrics() {
  return normaliseMetrics(unwrap(await fetchApi("/dashboard/models")));
}

export async function getPredictionHistory(filters = {}) {
  const query = new URLSearchParams({ page: "1", limit: "100" });
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "ALL") query.set(key, value);
  });
  const response = await fetchApi(`/predictions?${query.toString()}`);
  // History uses the standard API envelope with `data` as an array, unlike
  // prediction and dashboard endpoints whose `data` value is an object.
  const records = Array.isArray(response?.data) ? response.data : (response?.data?.data || []);
  return { records: records.map(normalisePrediction), pagination: response?.pagination || response?.data?.pagination };
}

export async function deletePrediction(id) {
  await fetchApi(`/predictions/${id}`, { method: "DELETE" });
  notifyPredictionDataChanged();
}
