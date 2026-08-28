process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://localhost/test';
process.env.ML_SERVICE_URL = 'http://localhost:8000';

const request = require('supertest');
const app = require('../src/app');
const mlService = require('../src/services/mlService');
const Prediction = require('../src/models/Prediction');

const validTransaction = {
  step: 1, type: 'TRANSFER', amount: 181, nameOrig: 'C1305486145', oldbalanceOrg: 181,
  newbalanceOrig: 0, nameDest: 'C553264065', oldbalanceDest: 0, newbalanceDest: 0,
  isFlaggedFraud: 0, model: 'random_forest',
};

describe('POST /api/predictions', () => {
  beforeEach(() => jest.restoreAllMocks());

  it('rejects an invalid transaction type', async () => {
    const response = await request(app).post('/api/predictions').send({ ...validTransaction, type: 'INVALID' });
    expect(response.status).toBe(422);
    expect(response.body.success).toBe(false);
  });

  it('rejects an unsupported model name', async () => {
    const response = await request(app).post('/api/predictions').send({ ...validTransaction, model: 'made_up_model' });
    expect(response.status).toBe(422);
  });

  it('rejects missing required fields and isFraud input', async () => {
    const response = await request(app).post('/api/predictions').send({ ...validTransaction, amount: undefined, isFraud: 1 });
    expect(response.status).toBe(422);
  });

  it('persists and returns a valid ML prediction', async () => {
    jest.spyOn(mlService, 'predict').mockResolvedValue({ prediction: 1, probability: 0.91, model: 'random_forest' });
    jest.spyOn(Prediction, 'create').mockResolvedValue({ _id: '507f1f77bcf86cd799439011', prediction: 1, predictionLabel: 'Fraud', probability: 0.91, riskLevel: 'High', modelUsed: 'random_forest', predictionTime: new Date() });
    const response = await request(app).post('/api/predictions').send(validTransaction);
    expect(response.status).toBe(201);
    expect(response.body.data.predictionLabel).toBe('Fraud');
    expect(response.body.data.riskLevel).toBe('High');
  });

  it('reports an unavailable ML service', async () => {
    jest.spyOn(mlService, 'predict').mockRejectedValue(Object.assign(new Error('Machine learning prediction service is currently unavailable'), { statusCode: 503 }));
    const response = await request(app).post('/api/predictions').send(validTransaction);
    expect(response.status).toBe(503);
    expect(response.body.message).toMatch(/unavailable/i);
  });
});
