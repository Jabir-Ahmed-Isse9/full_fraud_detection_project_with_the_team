process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://localhost/test';
process.env.ML_SERVICE_URL = 'http://localhost:8000';

const request = require('supertest');
const app = require('../src/app');
const predictionService = require('../src/services/predictionService');

describe('prediction history', () => {
  beforeEach(() => jest.restoreAllMocks());

  it('returns paginated prediction history', async () => {
    jest.spyOn(predictionService, 'listPredictions').mockResolvedValue({ data: [], pagination: { page: 2, limit: 10, total: 0, totalPages: 0 } });
    const response = await request(app).get('/api/predictions?page=2&limit=10&prediction=1&riskLevel=High');
    expect(response.status).toBe(200);
    expect(response.body.pagination.page).toBe(2);
  });

  it('returns a safe 400 for an invalid ID', async () => {
    const response = await request(app).get('/api/predictions/not-a-mongodb-id');
    expect(response.status).toBe(400);
  });

  it('returns one prediction for a valid ID', async () => {
    jest.spyOn(predictionService, 'getPrediction').mockResolvedValue({ _id: '507f1f77bcf86cd799439011', prediction: 0 });
    const response = await request(app).get('/api/predictions/507f1f77bcf86cd799439011');
    expect(response.status).toBe(200);
    expect(response.body.data.prediction).toBe(0);
  });

  it('deletes a valid prediction record', async () => {
    jest.spyOn(predictionService, 'deletePrediction').mockResolvedValue();
    const response = await request(app).delete('/api/predictions/507f1f77bcf86cd799439011');
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/deleted/i);
  });
});
