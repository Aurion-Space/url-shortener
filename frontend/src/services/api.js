// Simple, safe URL validation
export const validateUrl = (url) => {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return false;
  }
  
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export const shortenUrl = async (url) => {
  const response = await fetch(`/api/shorten`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const text = await response.text();
    try {
      const error = JSON.parse(text);
      throw new Error(error.error || 'Failed to shorten URL');
    } catch {
      throw new Error(text || 'Failed to shorten URL');
    }
  }

  return response.json();
};

export const getAnalytics = async (shortCode) => {
  const response = await fetch(`/api/analytics/${shortCode}`);
  
  if (!response.ok) {
    const text = await response.text();
    try {
      const error = JSON.parse(text);
      throw new Error(error.error || 'Failed to get analytics');
    } catch {
      throw new Error(text || 'Failed to get analytics');
    }
  }

  return response.json();
};
