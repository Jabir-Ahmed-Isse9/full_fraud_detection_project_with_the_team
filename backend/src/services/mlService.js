const axios = require('axios');
const { env } = require('../config/env');

const client = axios.create({ baseURL: env.mlServiceUrl, timeout: 10000 });

async function predict(model, transaction) {
  try {
    const response = await client.post('/predict', { model, transaction });
    return response.data;
  } catch (error) {
    const unavailable = !error.response || error.code === 'ECONNABORTED' || error.response.status >= 500;
    const wrapped = new Error(unavailable
      ? 'Machine learning prediction service is currently unavailable'
      : error.response.data?.detail || 'Machine learning prediction failed');
    wrapped.statusCode = unavailable ? 503 : 502;
    throw wrapped;
  }
}

async function health() {
  try {
    const response = await client.get('/health');
    return response.data;
  } catch {
    return { status: 'unavailable', models: {} };
  }
}

module.exports = { predict, health };
