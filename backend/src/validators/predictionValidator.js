const Joi = require('joi');

const transactionTypes = ['PAYMENT', 'TRANSFER', 'CASH_OUT', 'CASH_IN', 'DEBIT'];
const modelNames = ['logistic_regression', 'random_forest'];
const finiteNumber = Joi.number().custom((value, helpers) => (
  Number.isFinite(value) ? value : helpers.error('number.base')
));

const predictionSchema = Joi.object({
  step: finiteNumber.integer().min(0).required(),
  type: Joi.string().valid(...transactionTypes).required(),
  amount: finiteNumber.min(0).required(),
  nameOrig: Joi.string().trim().min(1).max(255).required(),
  oldbalanceOrg: finiteNumber.min(0).required(),
  newbalanceOrig: finiteNumber.min(0).required(),
  nameDest: Joi.string().trim().min(1).max(255).required(),
  oldbalanceDest: finiteNumber.min(0).required(),
  newbalanceDest: finiteNumber.min(0).required(),
  isFlaggedFraud: Joi.number().valid(0, 1).required(),
  model: Joi.string().valid(...modelNames).required(),
}).unknown(false);

const historyQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  model: Joi.string().valid(...modelNames),
  prediction: Joi.number().valid(0, 1),
  riskLevel: Joi.string().valid('Low', 'Medium', 'High'),
  type: Joi.string().valid(...transactionTypes),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')),
  search: Joi.string().trim().max(255),
}).unknown(false);

module.exports = { predictionSchema, historyQuerySchema, transactionTypes, modelNames };
