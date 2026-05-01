const { query } = require('../db/database');
const { generateUniqueCode, isValidCode } = require('../utils/shortCodeGenerator');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

// Simple, safe URL validation - no catastrophic backtracking
const isValidUrl = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const normalizeUrl = (url) => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
};

const findByOriginalUrl = async (originalUrl) => {
  const result = await query(
    'SELECT * FROM urls WHERE original_url = $1',
    [originalUrl]
  );
  return result.rows[0] || null;
};

const findByShortCode = async (shortCode) => {
  const result = await query(
    'SELECT * FROM urls WHERE short_code = $1',
    [shortCode]
  );
  return result.rows[0] || null;
};

const shortCodeExists = async (shortCode) => {
  const result = await query(
    'SELECT 1 FROM urls WHERE short_code = $1',
    [shortCode]
  );
  return result.rows.length > 0;
};

const createUrl = async (originalUrl, logger) => {
  const normalizedUrl = normalizeUrl(originalUrl);
  
  if (!isValidUrl(normalizedUrl)) {
    const error = new Error('Invalid URL format');
    error.statusCode = 400;
    throw error;
  }
  
  const existing = await findByOriginalUrl(normalizedUrl);
  if (existing) {
    logger.info({ 
      msg: 'URL already exists, returning existing',
      shortCode: existing.short_code,
      originalUrl: normalizedUrl
    });
    return existing;
  }
  
  const shortCode = await generateUniqueCode(shortCodeExists);
  
  const result = await query(
    'INSERT INTO urls (original_url, short_code) VALUES ($1, $2) RETURNING *',
    [normalizedUrl, shortCode]
  );
  
  const newUrl = result.rows[0];
  
  logger.info({
    msg: 'Short URL created',
    shortCode: newUrl.short_code,
    originalUrl: normalizedUrl
  });
  
  return newUrl;
};

const incrementClickCount = async (shortCode) => {
  const result = await query(
    'UPDATE urls SET click_count = click_count + 1 WHERE short_code = $1 RETURNING *',
    [shortCode]
  );
  return result.rows[0] || null;
};

const getAnalytics = async (shortCode) => {
  const url = await findByShortCode(shortCode);
  
  if (!url) {
    const error = new Error('Short URL not found');
    error.statusCode = 404;
    throw error;
  }
  
  return {
    shortCode: url.short_code,
    originalUrl: url.original_url,
    clickCount: url.click_count,
    createdAt: url.created_at
  };
};

module.exports = {
  isValidUrl,
  normalizeUrl,
  findByOriginalUrl,
  findByShortCode,
  shortCodeExists,
  createUrl,
  incrementClickCount,
  getAnalytics
};
