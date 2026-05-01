const {
  isValidUrl,
  normalizeUrl
} = require('../../src/services/urlService');

jest.mock('../../src/db/database', () => ({
  query: jest.fn(),
  initializeDatabase: jest.fn()
}));

const { query } = require('../../src/db/database');

describe('urlService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isValidUrl', () => {
    test('returns true for valid HTTP URLs', () => {
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com/path')).toBe(true);
      expect(isValidUrl('http://example.com/path/to/page')).toBe(true);
      expect(isValidUrl('http://example.com?query=value')).toBe(true);
      expect(isValidUrl('http://subdomain.example.com')).toBe(true);
    });

    test('returns true for valid HTTPS URLs', () => {
      expect(isValidUrl('https://google.com')).toBe(true);
      expect(isValidUrl('https://github.com/user/repo')).toBe(true);
    });

    test('returns false for invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('ftp://example.com')).toBe(false);
      expect(isValidUrl('')).toBe(false);
    });

    test('returns false for null or undefined', () => {
      expect(isValidUrl(null)).toBe(false);
      expect(isValidUrl(undefined)).toBe(false);
    });

    test('returns false for non-string inputs', () => {
      expect(isValidUrl(123)).toBe(false);
      expect(isValidUrl({})).toBe(false);
      expect(isValidUrl([])).toBe(false);
    });
  });

  describe('normalizeUrl', () => {
    test('adds https:// to URLs without protocol', () => {
      expect(normalizeUrl('example.com')).toBe('https://example.com');
      expect(normalizeUrl('google.com/search')).toBe('https://google.com/search');
    });

    test('preserves existing HTTP protocol', () => {
      expect(normalizeUrl('http://example.com')).toBe('http://example.com');
    });

    test('preserves existing HTTPS protocol', () => {
      expect(normalizeUrl('https://example.com')).toBe('https://example.com');
    });
  });

  describe('createUrl', () => {
    const { createUrl, findByOriginalUrl } = require('../../src/services/urlService');
    
    test('creates new URL when not exists', async () => {
      const mockLogger = { info: jest.fn() };
      const urlData = {
        id: 1,
        original_url: 'https://example.com',
        short_code: 'abc123',
        click_count: 0,
        created_at: new Date()
      };

      findByOriginalUrl.mockResolvedValueOnce(null);
      query.mockResolvedValueOnce({ rows: [urlData] });

      const result = await createUrl('example.com', mockLogger);

      expect(result.short_code).toBe('abc123');
      expect(result.original_url).toBe('https://example.com');
    });

    test('returns existing URL when duplicate', async () => {
      const mockLogger = { info: jest.fn() };
      const existingUrl = {
        id: 1,
        original_url: 'https://example.com',
        short_code: 'abc123',
        click_count: 5,
        created_at: new Date()
      };

      findByOriginalUrl.mockResolvedValueOnce(existingUrl);

      const result = await createUrl('example.com', mockLogger);

      expect(result.short_code).toBe('abc123');
      expect(result.click_count).toBe(5);
    });

    test('throws error for invalid URL', async () => {
      const mockLogger = { info: jest.fn() };
      
      await expect(createUrl('not-a-valid-url', mockLogger)).rejects.toThrow('Invalid URL format');
    });
  });

  describe('getAnalytics', () => {
    const { getAnalytics, findByShortCode } = require('../../src/services/urlService');

    test('returns analytics for existing short code', async () => {
      const mockUrl = {
        short_code: 'abc123',
        original_url: 'https://example.com',
        click_count: 42,
        created_at: new Date('2024-01-01')
      };

      findByShortCode.mockResolvedValueOnce(mockUrl);

      const result = await getAnalytics('abc123');

      expect(result.shortCode).toBe('abc123');
      expect(result.originalUrl).toBe('https://example.com');
      expect(result.clickCount).toBe(42);
    });

    test('throws error for non-existent short code', async () => {
      findByShortCode.mockResolvedValueOnce(null);

      await expect(getAnalytics('nonexistent')).rejects.toThrow('Short URL not found');
    });
  });
});
