const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const required = ['MONGODB_URI', 'ML_SERVICE_URL'];

function validateEnv() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Missing required environment variable(s): ${missing.join(', ')}`);
}

function parseMetrics() {
  if (!process.env.MODEL_METRICS) return {};
  try {
    return JSON.parse(process.env.MODEL_METRICS);
  } catch {
    throw new Error('MODEL_METRICS must be valid JSON');
  }
}

module.exports = {
  env: {
    port: Number(process.env.PORT) || 5000,
    mongoUri: process.env.MONGODB_URI,
    mlServiceUrl: process.env.ML_SERVICE_URL,
    nodeEnv: process.env.NODE_ENV || 'development',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    modelMetrics: parseMetrics(),
  },
  validateEnv,
};
