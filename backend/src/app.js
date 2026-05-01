require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const pino = require('pino');
const { requestLogger } = require('./middleware/requestLogger');
const { errorHandler } = require('./middleware/errorHandler');
const { createUrlShortener } = require('./routes/urlRoutes');
const { initializeDatabase } = require('./db/database');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(requestLogger(logger));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const urlRoutes = createUrlShortener(logger);
app.use('/api', urlRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler(logger));

const PORT = process.env.PORT || 3001;

initializeDatabase()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      logger.info({ msg: 'Server started', port: PORT });
    });
  })
  .catch((error) => {
    logger.error({ msg: 'Failed to initialize database', error: error.message });
    process.exit(1);
  });

module.exports = app;
