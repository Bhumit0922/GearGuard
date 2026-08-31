export const validate = (schema) => (req, res, next) => {
  try {
    const parsedBody = schema.parse(req.body);
    req.body = parsedBody;
    next();
  } catch (err) {
    next(err);
  }
};

export const validateQuery = (schema) => (req, res, next) => {
  try {
    const parsedQuery = schema.parse(req.query);
    req.query = parsedQuery;
    next();
  } catch (err) {
    next(err);
  }
};
