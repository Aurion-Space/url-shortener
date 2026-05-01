import React, { useState, useEffect } from 'react';

function UrlResult({ result, onCopy, onReset }) {
  const [copied, setCopied] = useState(false);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetch(`/api/analytics/${result.shortCode}`)
      .then(res => res.json())
      .then(data => setAnalytics(data))
      .catch(() => {});
  }, [result.shortCode]);

  const handleCopy = () => {
    onCopy(result.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const createdDate = new Date(result.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="result-card">
      <div className="result-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <span>Link Created!</span>
      </div>

      <div className="result-url">
        <a href={result.shortUrl} target="_blank" rel="noopener noreferrer">
          {result.shortUrl}
        </a>
        <button 
          className={`copy-btn ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="stats-row">
        <div className="stat-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
          </svg>
          <span>{analytics?.clickCount || 0}</span>
          <span>clicks</span>
        </div>
        <div className="stat-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>{createdDate}</span>
        </div>
      </div>

      <button className="reset-button" onClick={onReset}>
        Create Another Link
      </button>
    </div>
  );
}

export default UrlResult;
