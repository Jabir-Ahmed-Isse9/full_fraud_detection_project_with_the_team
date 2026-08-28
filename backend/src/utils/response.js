function success(res, { status = 200, message, data, ...extra } = {}) {
  return res.status(status).json({ success: true, ...(message && { message }), ...(data !== undefined && { data }), ...extra });
}

function failure(res, { status = 500, message, errors } = {}) {
  return res.status(status).json({ success: false, message: message || 'Internal server error', ...(errors && { errors }) });
}

module.exports = { success, failure };
