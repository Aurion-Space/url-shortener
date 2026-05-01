const {
  generateCode,
  isValidCode,
  generateUniqueCode,
  BASE62_CHARS,
  MIN_LENGTH,
  MAX_LENGTH,
  MAX_RETRIES
} = require('../../src/utils/shortCodeGenerator');

describe('shortCodeGenerator', () => {
  describe('generateCode', () => {
    test('generates code with specified length', () => {
      const code = generateCode(6);
      expect(code.length).toBe(6);
    });

    test('generates code within length bounds', () => {
      for (let len = MIN_LENGTH; len <= MAX_LENGTH; len++) {
        const code = generateCode(len);
        expect(code.length).toBe(len);
        expect(code.length).toBeGreaterThanOrEqual(MIN_LENGTH);
        expect(code.length).toBeLessThanOrEqual(MAX_LENGTH);
      }
    });

    test('generates code using only valid characters', () => {
      const code = generateCode(8);
      for (const char of code) {
        expect(BASE62_CHARS.includes(char)).toBe(true);
      }
    });

    test('generates different codes on subsequent calls', () => {
      const codes = new Set();
      for (let i = 0; i < 100; i++) {
        codes.add(generateCode(6));
      }
      expect(codes.size).toBeGreaterThan(90);
    });
  });

  describe('isValidCode', () => {
    test('returns true for valid codes', () => {
      expect(isValidCode('abc123')).toBe(true);
      expect(isValidCode('ABCDEF')).toBe(true);
      expect(isValidCode('abcdef')).toBe(true);
      expect(isValidCode('012345')).toBe(true);
      expect(isValidCode('AbCdEf123456')).toBe(true);
    });

    test('returns false for codes with invalid characters', () => {
      expect(isValidCode('abc-123')).toBe(false);
      expect(isValidCode('abc_123')).toBe(false);
      expect(isValidCode('abc 123')).toBe(false);
      expect(isValidCode('abc@123')).toBe(false);
    });

    test('returns false for codes with invalid length', () => {
      expect(isValidCode('abc')).toBe(false);
      expect(isValidCode('ab')).toBe(false);
      expect(isValidCode('abcde')).toBe(false);
      expect(isValidCode('abcdefghijk')).toBe(false);
    });

    test('returns false for non-string inputs', () => {
      expect(isValidCode(null)).toBe(false);
      expect(isValidCode(undefined)).toBe(false);
      expect(isValidCode(123456)).toBe(false);
      expect(isValidCode('')).toBe(false);
      expect(isValidCode({})).toBe(false);
    });
  });

  describe('generateUniqueCode', () => {
    test('generates a unique code when no collisions', async () => {
      const checkExists = jest.fn().mockResolvedValue(false);
      const code = await generateUniqueCode(checkExists);
      
      expect(code).toBeDefined();
      expect(code.length).toBeGreaterThanOrEqual(MIN_LENGTH);
      expect(code.length).toBeLessThanOrEqual(MAX_LENGTH);
      expect(checkExists).toHaveBeenCalled();
    });

    test('retries on collision', async () => {
      const checkExists = jest.fn()
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);
      
      const code = await generateUniqueCode(checkExists);
      
      expect(code).toBeDefined();
      expect(checkExists).toHaveBeenCalledTimes(3);
    });

    test('throws error after max retries', async () => {
      const checkExists = jest.fn().mockResolvedValue(true);
      
      await expect(generateUniqueCode(checkExists)).rejects.toThrow(
        'Failed to generate unique short code after maximum retries'
      );
      expect(checkExists).toHaveBeenCalledTimes(MAX_RETRIES);
    });
  });
});
