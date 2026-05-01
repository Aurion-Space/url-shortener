const express = require('express');
const urlService = require('../services/urlService');
const { isValidCode } = require('../utils/shortCodeGenerator');

const router = express.Router();

const createUrlShortener = (logger) => {
  router.post('/shorten', async (req, res, next) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ error: 'URL is required' });
      }
      
      const urlData = await urlService.createUrl(url, logger);
      
      const shortUrl = `${process.env.API_BASE_URL || 'http://localhost:3001'}/${urlData.short_code}`;
      
      res.status(201).json({
        shortCode: urlData.short_code,
        shortUrl: shortUrl,
        originalUrl: urlData.original_url,
        createdAt: urlData.created_at
      });
    } catch (error) {
      next(error);
    }
  });
  
  router.get('/:shortCode', async (req, res, next) => {
    try {
      const { shortCode } = req.params;
      
      if (!isValidCode(shortCode)) {
        return res.status(400).json({ error: 'Invalid short code format' });
      }
      
      const urlData = await urlService.incrementClickCount(shortCode);
      
      if (!urlData) {
        return res.status(404).json({ error: 'Short URL not found' });
      }
      
      logger.info({
        msg: 'Redirecting to original URL',
        shortCode: shortCode,
        originalUrl: urlData.original_url,
        request_id: req.requestId
      });
      
      res.redirect(301, urlData.original_url);
    } catch (error) {
      next(error);
    }
  });
  
  router.get('/analytics/:shortCode', async (req, res, next) => {
    try {
      const { shortCode } = req.params;
      
      if (!isValidCode(shortCode)) {
        return res.status(400).json({ error: 'Invalid short code format' });
      }
      
      const analytics = await urlService.getAnalytics(shortCode);
      
      res.json(analytics);
    } catch (error) {
      next(error);
    }
  });
  
  return router;
};

module.exports = { createUrlShortener };
