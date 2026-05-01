const request = require('supertest');

jest.mock('../../src/db/database', () => ({
  query: jest.fn(),
  initializeDatabase: jest.fn().mockResolvedValue(true),
  pool: {
    connect: jest.fn().mockResolvedValue({
      query: jest.fn(),
      release: jest.fn()
    })
  }
}));

const { query } = require('../../src/db/database');
const app = require('../../src/app');

describe('API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/health', () => {
    test('returns health status', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /api/shorten', () => {
    test('creates short URL for valid URL', async () => {
      const mockUrl = {
        id: 1,
        original_url: 'https://example.com',
        short_code: 'abc123',
        click_count: 0,
        created_at: new Date()
      };

      query.mockResolvedValueOnce({ rows: [] })
            .mockResolvedValueOnce({ rows: [mockUrl] });

      const response = await request(app)
        .post('/api/shorten')
        .send({ url: 'https://example.com' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('shortCode', 'abc123');
      expect(response.body).toHaveProperty('shortUrl');
      expect(response.body).toHaveProperty('originalUrl', 'https://example.com');
      expect(response.body).toHaveProperty('createdAt');
    });

    test('returns existing short URL for duplicate', async () => {
      const existingUrl = {
        id: 1,
        original_url: 'https://example.com',
        short_code: 'abc123',
        click_count: 5,
        created_at: new Date()
      };

      query.mockResolvedValueOnce({ rows: [existingUrl] });

      const response = await request(app)
        .post('/api/shorten')
        .send({ url: 'https://example.com' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('shortCode', 'abc123');
      expect(response.body.clickCount).toBeUndefined();
    });

    test('returns 400 for missing URL', async () => {
      const response = await request(app)
        .post('/api/shorten')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'URL is required');
    });

    test('returns 400 for invalid URL format', async () => {
      query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .post('/api/shorten')
        .send({ url: 'not-a-valid-url' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid URL format');
    });
  });

  describe('GET /api/:shortCode', () => {
    test('redirects to original URL', async () => {
      const mockUrl = {
        original_url: 'https://example.com',
        short_code: 'abc123',
        click_count: 0
      };

      query.mockResolvedValueOnce({ rows: [{ ...mockUrl, click_count: 1 }] });

      const response = await request(app)
        .get('/api/abc123');

      expect(response.status).toBe(301);
      expect(response.headers.location).toBe('https://example.com');
    });

    test('returns 404 for non-existent short code', async () => {
      query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Short URL not found');
    });
  });

  describe('GET /api/analytics/:shortCode', () => {
    test('returns analytics for existing short code', async () => {
      const mockUrl = {
        short_code: 'abc123',
        original_url: 'https://example.com',
        click_count: 42,
        created_at: new Date('2024-01-01')
      };

      query.mockResolvedValueOnce({ rows: [mockUrl] });

      const response = await request(app)
        .get('/api/analytics/abc123');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('shortCode', 'abc123');
      expect(response.body).toHaveProperty('originalUrl', 'https://example.com');
      expect(response.body).toHaveProperty('clickCount', 42);
    });

    test('returns 404 for non-existent short code', async () => {
      query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/analytics/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Short URL not found');
    });
  });
});
