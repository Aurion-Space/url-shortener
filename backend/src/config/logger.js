const pino = require('pino');

const createLogger = (level = process.env.LOG_LEVEL || 'info') => {
  return pino({
    level,
    formatters: {
      level: (label) => ({ level: label })
    },
    timestamp: () => `,"time":${Date.now()}`
  });
};

module.exports = { createLogger };
