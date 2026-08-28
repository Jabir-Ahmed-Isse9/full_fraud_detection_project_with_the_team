const Prediction = require('../models/Prediction');
const { env } = require('../config/env');

const MODEL_LABELS = {
  logistic_regression: 'Logistic Regression',
  random_forest: 'Random Forest',
};

const RISK_LEVELS = ['Low', 'Medium', 'High'];
const AMOUNT_BOUNDARIES = [0, 10000, 50000, 100000, 500000, 1000000];

function percentage(value, total) {
  return total ? Number(((value / total) * 100).toFixed(2)) : 0;
}

function amountTierLabel(id) {
  if (id === '1000000+') return '$1M+';
  const index = Number(id);
  const upper = AMOUNT_BOUNDARIES[index + 1];
  const lower = AMOUNT_BOUNDARIES[index];
  if (!Number.isFinite(lower)) return String(id);
  if (!Number.isFinite(upper)) return `$${lower.toLocaleString()}+`;
  return `$${lower.toLocaleString()}–$${(upper - 1).toLocaleString()}`;
}

function emptyFacet() {
  return {
    totals: [],
    predictions: [],
    risks: [],
    models: [],
    types: [],
    amountTiers: [],
    overTime: [],
  };
}

async function aggregateAnalytics() {
  const [facet = emptyFacet()] = await Prediction.aggregate([
    {
      $facet: {
        totals: [
          {
            $group: {
              _id: null,
              totalTransactions: { $sum: 1 },
              fraudulentEvents: { $sum: { $cond: [{ $eq: ['$prediction', 1] }, 1, 0] } },
              totalAmount: { $sum: '$amount' },
              lastUpdated: { $max: '$predictionTime' },
            },
          },
        ],
        predictions: [
          { $group: { _id: '$predictionLabel', count: { $sum: 1 } } },
        ],
        risks: [
          { $group: { _id: '$riskLevel', count: { $sum: 1 } } },
        ],
        models: [
          { $group: { _id: '$modelUsed', count: { $sum: 1 } } },
          { $sort: { count: -1, _id: 1 } },
        ],
        types: [
          {
            $group: {
              _id: '$type',
              count: { $sum: 1 },
              fraudCount: { $sum: { $cond: [{ $eq: ['$prediction', 1] }, 1, 0] } },
              totalAmount: { $sum: '$amount' },
            },
          },
          { $sort: { count: -1, _id: 1 } },
        ],
        amountTiers: [
          {
            $bucket: {
              groupBy: '$amount',
              boundaries: AMOUNT_BOUNDARIES,
              default: '1000000+',
              output: {
                count: { $sum: 1 },
                fraudCount: { $sum: { $cond: [{ $eq: ['$prediction', 1] }, 1, 0] } },
                totalAmount: { $sum: '$amount' },
              },
            },
          },
        ],
        overTime: [
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$predictionTime' } },
              count: { $sum: 1 },
              fraudCount: { $sum: { $cond: [{ $eq: ['$prediction', 1] }, 1, 0] } },
            },
          },
          { $sort: { _id: 1 } },
        ],
      },
    },
  ]);

  const totals = facet.totals?.[0] || { totalTransactions: 0, fraudulentEvents: 0, totalAmount: 0, lastUpdated: null };
  const total = totals.totalTransactions || 0;
  const fraud = totals.fraudulentEvents || 0;
  const legitimate = Math.max(total - fraud, 0);
  const predictionMap = Object.fromEntries((facet.predictions || []).map((row) => [row._id, row.count]));
  const riskMap = Object.fromEntries((facet.risks || []).map((row) => [row._id, row.count]));
  const predictionsByModel = (facet.models || []).map((row) => ({
    id: row._id,
    model: MODEL_LABELS[row._id] || row._id,
    name: MODEL_LABELS[row._id] || row._id,
    count: row.count,
    value: row.count,
    percentage: percentage(row.count, total),
  }));

  const fraudDistribution = [
    { name: 'Fraud', value: fraud, percentage: percentage(fraud, total) },
    { name: 'Not Fraud', value: legitimate, percentage: percentage(legitimate, total) },
  ];
  const riskDistribution = RISK_LEVELS.map((name) => ({
    name,
    value: riskMap[name] || 0,
    percentage: percentage(riskMap[name] || 0, total),
  }));
  const transactionTypeDistribution = (facet.types || []).map((row) => ({
    type: row._id,
    name: row._id,
    count: row.count,
    value: row.count,
    fraudCount: row.fraudCount,
    legitimateCount: row.count - row.fraudCount,
    fraudRate: percentage(row.fraudCount, row.count),
    percentage: percentage(row.count, total),
    totalAmount: Number((row.totalAmount || 0).toFixed(2)),
  }));
  const amountTierAnalysis = (facet.amountTiers || []).map((row) => ({
    range: amountTierLabel(row._id),
    count: row.count,
    fraud: row.fraudCount,
    legitimate: row.count - row.fraudCount,
    fraudCount: row.fraudCount,
    legitimateCount: row.count - row.fraudCount,
    fraudRate: percentage(row.fraudCount, row.count),
    totalAmount: Number((row.totalAmount || 0).toFixed(2)),
  }));

  return {
    totalTransactions: total,
    totalPredictions: total,
    fraudulentEvents: fraud,
    legitimateEvents: legitimate,
    fraud,
    notFraud: legitimate,
    fraudPredictionRate: percentage(fraud, total),
    fraudPercentage: percentage(fraud, total),
    notFraudPercentage: percentage(legitimate, total),
    highRiskResults: riskMap.High || 0,
    mediumRiskResults: riskMap.Medium || 0,
    lowRiskResults: riskMap.Low || 0,
    highRisk: riskMap.High || 0,
    mediumRisk: riskMap.Medium || 0,
    lowRisk: riskMap.Low || 0,
    transactionTypes: transactionTypeDistribution.length,
    totalAmount: Number((totals.totalAmount || 0).toFixed(2)),
    fraudDistribution,
    riskDistribution,
    predictionsByModel,
    transactionTypeDistribution,
    amountTierAnalysis,
    amountDistribution: amountTierAnalysis,
    predictionsOverTime: (facet.overTime || []).map((row) => ({ date: row._id, value: row.count, fraud: row.fraudCount })),
    lastUpdated: totals.lastUpdated || null,
    // Kept for clients that inspect the raw labels returned by MongoDB.
    predictionCounts: { fraud: predictionMap.Fraud || fraud, notFraud: predictionMap['Not Fraud'] || legitimate },
  };
}

function modelMetrics() {
  return Object.entries(MODEL_LABELS).map(([id, name]) => {
    const configured = env.modelMetrics[id] || {};
    return {
      id,
      model: name,
      name,
      algorithm: configured.algorithm || name,
      accuracy: configured.accuracy ?? null,
      precision: configured.precision ?? null,
      recall: configured.recall ?? null,
      f1: configured.f1 ?? null,
      rocAuc: configured.rocAuc ?? configured.roc_auc ?? null,
      latency: configured.latency ?? configured.inferenceLatency ?? null,
      status: configured.status || (Object.keys(configured).length ? 'evaluated' : 'not_configured'),
      source: configured.source || 'configured held-out evaluation',
    };
  });
}

module.exports = { aggregateAnalytics, modelMetrics, MODEL_LABELS };
