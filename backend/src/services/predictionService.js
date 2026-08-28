const mongoose = require('mongoose');
const Prediction = require('../models/Prediction');
const mlService = require('./mlService');

function riskLevel(probability) {
  if (probability >= 0.7) return 'High';
  if (probability >= 0.4) return 'Medium';
  return 'Low';
}

async function createPrediction(input) {
  const { model, ...transaction } = input;
  const startedAt = Date.now();
  const result = await mlService.predict(model, transaction);
  const probability = Number(result.probability);
  const prediction = Number(result.prediction);

  if (![0, 1].includes(prediction) || !Number.isFinite(probability) || probability < 0 || probability > 1) {
    const error = new Error('Machine learning service returned an invalid prediction response');
    error.statusCode = 502;
    throw error;
  }

  const document = await Prediction.create({
    ...transaction,
    prediction,
    predictionLabel: prediction === 1 ? 'Fraud' : 'Not Fraud',
    probability,
    riskLevel: riskLevel(probability),
    modelUsed: result.model || model,
    predictionTime: new Date(),
    processingTime: Date.now() - startedAt,
  });
  return document;
}

function historyFilter(query) {
  const filter = {};
  if (query.model) filter.modelUsed = query.model;
  if (query.prediction !== undefined) filter.prediction = query.prediction;
  if (query.riskLevel) filter.riskLevel = query.riskLevel;
  if (query.type) filter.type = query.type;
  if (query.startDate || query.endDate) {
    filter.predictionTime = {};
    if (query.startDate) filter.predictionTime.$gte = new Date(query.startDate);
    if (query.endDate) {
      const end = new Date(query.endDate);
      end.setUTCHours(23, 59, 59, 999);
      filter.predictionTime.$lte = end;
    }
  }
  if (query.search) {
    const escaped = query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [{ nameOrig: { $regex: escaped, $options: 'i' } }, { nameDest: { $regex: escaped, $options: 'i' } }];
  }
  return filter;
}

async function listPredictions(query) {
  const page = query.page || 1;
  const limit = query.limit || 20;
  const filter = historyFilter(query);
  const [data, total] = await Promise.all([
    Prediction.find(filter).sort({ predictionTime: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Prediction.countDocuments(filter),
  ]);
  return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

async function getPrediction(id) {
  if (!mongoose.isValidObjectId(id)) {
    const error = new Error('Invalid prediction ID');
    error.statusCode = 400;
    throw error;
  }
  const prediction = await Prediction.findById(id).lean();
  if (!prediction) {
    const error = new Error('Prediction not found');
    error.statusCode = 404;
    throw error;
  }
  return prediction;
}

async function deletePrediction(id) {
  if (!mongoose.isValidObjectId(id)) {
    const error = new Error('Invalid prediction ID');
    error.statusCode = 400;
    throw error;
  }
  const prediction = await Prediction.findByIdAndDelete(id);
  if (!prediction) {
    const error = new Error('Prediction not found');
    error.statusCode = 404;
    throw error;
  }
}

module.exports = { createPrediction, listPredictions, getPrediction, deletePrediction };
