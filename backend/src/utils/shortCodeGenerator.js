const BASE62_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const MIN_LENGTH = 6;
const MAX_LENGTH = 8;
const MAX_RETRIES = 3;

const getRandomChar = () => {
  const index = Math.floor(Math.random() * BASE62_CHARS.length);
  return BASE62_CHARS[index];
};

const generateCode = (length) => {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += getRandomChar();
  }
  return code;
};

const isValidCode = (code) => {
  if (!code || typeof code !== 'string') {
    return false;
  }
  
  if (code.length < MIN_LENGTH || code.length > MAX_LENGTH) {
    return false;
  }
  
  for (const char of code) {
    if (!BASE62_CHARS.includes(char)) {
      return false;
    }
  }
  
  return true;
};

const generateUniqueCode = async (checkExists) => {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const length = MIN_LENGTH + Math.floor(Math.random() * (MAX_LENGTH - MIN_LENGTH + 1));
    const code = generateCode(length);
    
    const exists = await checkExists(code);
    
    if (!exists) {
      return code;
    }
  }
  
  throw new Error('Failed to generate unique short code after maximum retries');
};

module.exports = {
  generateCode,
  isValidCode,
  generateUniqueCode,
  BASE62_CHARS,
  MIN_LENGTH,
  MAX_LENGTH,
  MAX_RETRIES
};
