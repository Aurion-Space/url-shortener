const { v4: uuidv4 } = require('uuid');

const requestLogger = (logger) => {
  return (req, res, next) => {
    const requestId = uuidv4();
    const startTime = Date.now();
    
    req.requestId = requestId;
    
    res.on('finish', () => {
      const latency = Date.now() - startTime;
      const logData = {
        request_id: requestId,
        method: req.method,
        route: req.originalUrl,
        statusCode: res.statusCode,
        latency_ms: latency,
        userAgent: req.get('user-agent'),
        referer: req.get('referer')
      };
      
      if (res.statusCode >= 400) {
        logger.warn(logData);
      } else {
        logger.info(logData);
      }
    });
    
    next();
  };
};

module.exports = { requestLogger };
