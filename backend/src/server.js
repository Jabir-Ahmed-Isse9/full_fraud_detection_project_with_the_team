const app = require('./app');
const { connectDatabase } = require('./config/db');
const { env, validateEnv } = require('./config/env');

async function start() {
  validateEnv();
  await connectDatabase();
  app.listen(env.port, () => console.log(`Backend API listening on port ${env.port}`));
}

start().catch((error) => {
  console.error('Failed to start backend:', error.message);
  process.exit(1);
});
