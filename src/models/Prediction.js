const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  step: { type: Number, required: true, min: 0 },
  type: { type: String, required: true, enum: ['PAYMENT', 'TRANSFER', 'CASH_OUT', 'CASH_IN', 'DEBIT'], index: true },
  amount: { type: Number, required: true, min: 0 },
  nameOrig: { type: String, required: true, index: true },
  oldbalanceOrg: { type: Number, required: true, min: 0 },
  newbalanceOrig: { type: Number, required: true, min: 0 },
  nameDest: { type: String, required: true, index: true },
  oldbalanceDest: { type: Number, required: true, min: 0 },
  newbalanceDest: { type: Number, required: true, min: 0 },
  isFlaggedFraud: { type: Number, required: true, enum: [0, 1] },
  prediction: { type: Number, required: true, enum: [0, 1], index: true },
  predictionLabel: { type: String, required: true, enum: ['Fraud', 'Not Fraud'] },
  probability: { type: Number, required: true, min: 0, max: 1 },
  riskLevel: { type: String, required: true, enum: ['Low', 'Medium', 'High'], index: true },
  modelUsed: { type: String, required: true, enum: ['logistic_regression', 'random_forest'], index: true },
  predictionTime: { type: Date, required: true, default: Date.now, index: true },
  processingTime: { type: Number, required: true, min: 0 },
}, { collection: 'predictions', versionKey: false });

module.exports = mongoose.model('Prediction', predictionSchema);
