const dashboardService = require('../services/dashboardService');
const { success } = require('../utils/response');

async function summary(req, res, next) { try { return success(res, { data: await dashboardService.summary() }); } catch (error) { return next(error); } }
async function charts(req, res, next) { try { return success(res, { data: await dashboardService.charts() }); } catch (error) { return next(error); } }
function models(req, res) { return success(res, { data: dashboardService.modelMetrics() }); }

module.exports = { summary, charts, models };
