process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://localhost/test';
process.env.ML_SERVICE_URL = 'http://localhost:8000';

const request = require('supertest');
const app = require('../src/app');
const dashboardService = require('../src/services/dashboardService');

describe('dashboard APIs', () => {
  beforeEach(() => jest.restoreAllMocks());

  it('returns summary statistics', async () => {
    jest.spyOn(dashboardService, 'summary').mockResolvedValue({ totalPredictions: 1, fraud: 1, notFraud: 0, fraudPercentage: 100, notFraudPercentage: 0, highRisk: 1, mediumRisk: 0, lowRisk: 0 });
    const response = await request(app).get('/api/dashboard/summary');
    expect(response.status).toBe(200);
    expect(response.body.data.totalPredictions).toBe(1);
  });

  it('returns chart data and configured model metrics', async () => {
    jest.spyOn(dashboardService, 'charts').mockResolvedValue({ predictionsByModel: [], fraudVsNotFraud: [], riskDistribution: [], transactionTypeDistribution: [], predictionsOverTime: [] });
    expect((await request(app).get('/api/dashboard/charts')).status).toBe(200);
    expect((await request(app).get('/api/dashboard/models')).body.data).toHaveLength(2);
  });
});
