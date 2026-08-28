const predictionService = require('../services/predictionService');
const { success } = require('../utils/response');

async function create(req, res, next) {
  try {
    const prediction = await predictionService.createPrediction(req.body);
    return success(res, { status: 201, message: 'Transaction prediction completed successfully', data: {
      predictionId: prediction._id, prediction: prediction.prediction, predictionLabel: prediction.predictionLabel,
      probability: prediction.probability, probabilityPercentage: Number((prediction.probability * 100).toFixed(2)),
      riskLevel: prediction.riskLevel, modelUsed: prediction.modelUsed, predictionTime: prediction.predictionTime,
    } });
  } catch (error) { return next(error); }
}

async function list(req, res, next) {
  try { const result = await predictionService.listPredictions(req.query); return success(res, { data: result.data, pagination: result.pagination }); } catch (error) { return next(error); }
}
async function getOne(req, res, next) { try { return success(res, { data: await predictionService.getPrediction(req.params.id) }); } catch (error) { return next(error); } }
async function remove(req, res, next) { try { await predictionService.deletePrediction(req.params.id); return success(res, { message: 'Prediction deleted successfully' }); } catch (error) { return next(error); } }

module.exports = { create, list, getOne, remove };
