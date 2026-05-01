import { useState, useCallback } from 'react';
import { shortenUrl as apiShortenUrl, getAnalytics as apiGetAnalytics, validateUrl } from '../services/api';

export const useUrlShortener = () => {
  const [result, setResult] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const shorten = useCallback(async (url) => {
    setLoading(true);
    setError(null);
    
    if (!validateUrl(url)) {
      setError('Please enter a valid URL');
      setLoading(false);
      return;
    }

    try {
      const data = await apiShortenUrl(url);
      setResult(data);
      
      apiGetAnalytics(data.shortCode)
        .then(setAnalytics)
        .catch(() => {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setAnalytics(null);
    setError(null);
  }, []);

  return { result, analytics, loading, error, shorten, reset };
};
