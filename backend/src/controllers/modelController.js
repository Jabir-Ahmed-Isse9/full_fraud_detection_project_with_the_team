const dashboardService = require('../services/dashboardService');
const { success } = require('../utils/response');

function performance(req, res) {
  return success(res, { data: dashboardService.modelMetrics() });
}

module.exports = { performance };
