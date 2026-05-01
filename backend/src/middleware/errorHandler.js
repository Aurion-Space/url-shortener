const errorHandler = (logger) => {
  return (err, req, res, next) => {
    const errorData = {
      request_id: req.requestId || 'unknown',
      msg: 'Error occurred',
      error: err.message,
      stack: err.stack,
      method: req.method,
      route: req.originalUrl,
      statusCode: err.statusCode || 500
    };

    logger.error(errorData);

    res.status(err.statusCode || 500).json({
      error: err.message || 'Internal Server Error',
      requestId: req.requestId
    });
  };
};

module.exports = { errorHandler };
