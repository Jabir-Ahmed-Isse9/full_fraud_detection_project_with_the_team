function validate(schema, source = 'body') {
  return (req, res, next) => {
    const { value, error } = schema.validate(req[source], { abortEarly: false, stripUnknown: true, convert: source === 'query' });
    if (error) {
      const validationError = new Error('Validation failed');
      validationError.statusCode = 422;
      validationError.details = error.details.map((detail) => ({ field: detail.path.join('.'), message: detail.message }));
      return next(validationError);
    }
    req[source] = value;
    return next();
  };
}

module.exports = { validate };
