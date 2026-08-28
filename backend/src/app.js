const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const predictionRoutes = require('./routes/predictionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const { databaseStatus } = require('./config/db');
const mlService = require('./services/mlService');
const { env } = require('./config/env');
const { success } = require('./utils/response');
const notFound = require('./middleware/notFoundMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.clientUrl, methods: ['GET', 'POST', 'DELETE'], optionsSuccessStatus: 204 }));
app.use(express.json({ limit: '20kb' }));
app.use(mongoSanitize());
if (env.nodeEnv !== 'test') app.use(morgan('combined'));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false }));

app.get('/api/health', async (req, res) => {
  const ml = await mlService.health();
  const mongodb = databaseStatus();
  const mlStatus = ml.status === 'healthy' ? 'connected' : 'unavailable';
  return success(res, { status: mongodb === 'connected' && mlStatus === 'connected' ? 200 : 503, data: undefined, ...{
    backend: 'healthy', mongodb, mlService: mlStatus,
  } });
});
app.get('/api/ml/health', async (req, res) => {
  const ml = await mlService.health();
  return res.status(ml.status === 'healthy' ? 200 : 503).json({ success: ml.status === 'healthy', ...ml });
});
app.use('/api/predictions', predictionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use(notFound);
app.use(errorMiddleware);

module.exports = app;
