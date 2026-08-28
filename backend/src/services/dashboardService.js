const Prediction = require('../models/Prediction');
const { env } = require('../config/env');

const modelLabels = { logistic_regression: 'Logistic Regression', random_forest: 'Random Forest' };

function countMap(rows, key) {
  return Object.fromEntries(rows.map((row) => [row._id, row.count]));
}

async function summary() {
  const [total, byPrediction, byRisk] = await Promise.all([
    Prediction.countDocuments(),
    Prediction.aggregate([{ $group: { _id: '$prediction', count: { $sum: 1 } } }]),
    Prediction.aggregate([{ $group: { _id: '$riskLevel', count: { $sum: 1 } } }]),
  ]);
  const predictions = countMap(byPrediction);
  const risks = countMap(byRisk);
  const fraud = predictions[1] || 0;
  const notFraud = predictions[0] || 0;
  const percent = (value) => total ? Number(((value / total) * 100).toFixed(2)) : 0;
  return {
    totalPredictions: total, fraud, notFraud, fraudPercentage: percent(fraud), notFraudPercentage: percent(notFraud),
    highRisk: risks.High || 0, mediumRisk: risks.Medium || 0, lowRisk: risks.Low || 0,
  };
}

async function charts() {
  const [models, predictions, risks, types, overTime, amounts] = await Promise.all([
    Prediction.aggregate([{ $group: { _id: '$modelUsed', value: { $sum: 1 } } }]),
    Prediction.aggregate([{ $group: { _id: '$predictionLabel', value: { $sum: 1 } } }]),
    Prediction.aggregate([{ $group: { _id: '$riskLevel', value: { $sum: 1 } } }]),
    Prediction.aggregate([{ $group: { _id: '$type', value: { $sum: 1 } } }]),
    Prediction.aggregate([{ $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$predictionTime' } }, value: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
    Prediction.aggregate([{ $bucket: { groupBy: '$amount', boundaries: [0, 1000, 10000, 100000, 1000000], default: '1000000+', output: { outcomes: { $push: '$prediction' } } } }]),
  ]);
  const normalize = (rows, labels) => {
    const mapped = Object.fromEntries(rows.map((row) => [row._id, row.value]));
    return labels.map(([id, name]) => ({ name, value: mapped[id] || 0 }));
  };
  return {
    predictionsByModel: normalize(models, Object.entries(modelLabels)),
    fraudVsNotFraud: normalize(predictions, [['Fraud', 'Fraud'], ['Not Fraud', 'Not Fraud']]),
    riskDistribution: normalize(risks, [['Low', 'Low'], ['Medium', 'Medium'], ['High', 'High']]),
    transactionTypeDistribution: normalize(types, ['PAYMENT', 'TRANSFER', 'CASH_OUT', 'CASH_IN', 'DEBIT'].map((type) => [type, type])),
    predictionsOverTime: overTime.map((row) => ({ date: row._id, value: row.value })),
    amountDistribution: amounts.map((row) => {
      const fraud = row.outcomes.filter((prediction) => prediction === 1).length;
      return { range: row._id === '1000000+' ? '$1M+' : `$${Number(row._id).toLocaleString()}+`, legitimate: row.outcomes.length - fraud, fraud };
    }),
  };
}

function modelMetrics() {
  return Object.entries(modelLabels).map(([key, model]) => {
    const metrics = env.modelMetrics[key];
    return { model, accuracy: metrics?.accuracy ?? null, precision: metrics?.precision ?? null, recall: metrics?.recall ?? null, f1: metrics?.f1 ?? null };
  });
}

module.exports = { summary, charts, modelMetrics };
