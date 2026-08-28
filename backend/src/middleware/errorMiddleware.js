const { failure } = require('../utils/response');

function errorMiddleware(err, req, res, next) { // eslint-disable-line no-unused-vars
  const status = err.statusCode || err.status || 500;
  if (status >= 500) console.error(err);
  return failure(res, {
    status,
    message: err.message || 'Internal server error',
    ...(err.details && { errors: err.details }),
  });
}

module.exports = errorMiddleware;
