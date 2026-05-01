import React, { useState } from 'react';
import { validateUrl } from '../services/api';

function UrlShortenerForm({ onSubmit, loading, error }) {
  const [url, setUrl] = useState('');
  const [inputError, setInputError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setInputError('');

    if (!url.trim()) {
      setInputError('Please enter a URL');
      return;
    }

    let processedUrl = url.trim();
    if (!processedUrl.match(/^https?:\/\//i)) {
      processedUrl = 'https://' + processedUrl;
    }

    if (!validateUrl(processedUrl)) {
      setInputError('Please enter a valid URL');
      return;
    }

    onSubmit(processedUrl);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setInputError('');
    } catch (err) {
      // Clipboard access denied
    }
  };

  return (
    <form className="url-form" onSubmit={handleSubmit}>
      <div className="input-wrapper">
        <span className="input-icon" onClick={handlePaste} style={{ cursor: 'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          </svg>
        </span>
        <input
          type="text"
          className={`url-input ${inputError ? 'error' : ''}`}
          placeholder="Paste your long URL here..."
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setInputError('');
          }}
          disabled={loading}
        />
      </div>

      {(inputError || error) && (
        <p className="error-message">{inputError || error}</p>
      )}

      <button 
        type="submit" 
        className="shorten-btn"
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            <span>Creating...</span>
          </>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <span>Shorten URL</span>
          </>
        )}
      </button>
    </form>
  );
}

export default UrlShortenerForm;
