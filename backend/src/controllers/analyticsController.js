const analyticsService = require('../services/analyticsService');
const dashboardService = require('../services/dashboardService');
const { success } = require('../utils/response');

async function dashboard(req, res, next) {
  try { return success(res, { data: await dashboardService.dashboard() }); } catch (error) { return next(error); }
}

async function dataset(req, res, next) {
  try { return success(res, { data: await analyticsService.aggregateAnalytics() }); } catch (error) { return next(error); }
}

async function risk(req, res, next) {
  try {
    const data = await analyticsService.aggregateAnalytics();
    return success(res, { data: { riskDistribution: data.riskDistribution, totalTransactions: data.totalTransactions } });
  } catch (error) { return next(error); }
}

async function transactionTypes(req, res, next) {
  try {
    const data = await analyticsService.aggregateAnalytics();
    return success(res, { data: data.transactionTypeDistribution });
  } catch (error) { return next(error); }
}

async function amountTiers(req, res, next) {
  try {
    const data = await analyticsService.aggregateAnalytics();
    return success(res, { data: data.amountTierAnalysis });
  } catch (error) { return next(error); }
}

module.exports = { dashboard, dataset, risk, transactionTypes, amountTiers };
