const analyticsService = require('./analyticsService');

async function summary() {
  const analytics = await analyticsService.aggregateAnalytics();
  return {
    totalPredictions: analytics.totalTransactions,
    fraud: analytics.fraudulentEvents,
    notFraud: analytics.legitimateEvents,
    fraudPercentage: analytics.fraudPredictionRate,
    notFraudPercentage: analytics.notFraudPercentage,
    highRisk: analytics.highRiskResults,
    mediumRisk: analytics.mediumRiskResults,
    lowRisk: analytics.lowRiskResults,
    lastUpdated: analytics.lastUpdated,
  };
}

async function charts() {
  const analytics = await analyticsService.aggregateAnalytics();
  return {
    predictionsByModel: analytics.predictionsByModel,
    fraudVsNotFraud: analytics.fraudDistribution,
    riskDistribution: analytics.riskDistribution,
    transactionTypeDistribution: analytics.transactionTypeDistribution.map((row) => ({
      name: row.type,
      value: row.count,
      count: row.count,
      fraudCount: row.fraudCount,
      legitimateCount: row.legitimateCount,
      fraudRate: row.fraudRate,
      percentage: row.percentage,
      totalAmount: row.totalAmount,
    })),
    predictionsOverTime: analytics.predictionsOverTime,
    amountDistribution: analytics.amountTierAnalysis,
    amountTierAnalysis: analytics.amountTierAnalysis,
  };
}

async function dashboard() {
  const [analytics, models] = await Promise.all([
    analyticsService.aggregateAnalytics(),
    Promise.resolve(modelMetrics()),
  ]);
  return { ...analytics, models, modelPerformance: models };
}

function modelMetrics() {
  return analyticsService.modelMetrics();
}

module.exports = { summary, charts, dashboard, modelMetrics };
