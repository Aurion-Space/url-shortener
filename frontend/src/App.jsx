import React, { useState, useEffect } from 'react';
import { useUrlShortener } from './hooks/useUrlShortener';
import UrlShortenerForm from './components/UrlShortenerForm';
import UrlResult from './components/UrlResult';
import './App.css';

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      {type === 'success' ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      )}
      <span>{message}</span>
    </div>
  );
}

function App() {
  const { result, loading, error, shorten, reset } = useUrlShortener();
  const [toast, setToast] = useState(null);

  const handleSubmit = (url) => {
    shorten(url);
  };

  const handleReset = () => {
    reset();
    setToast(null);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setToast({ message: 'Copied to clipboard!', type: 'success' });
    }).catch(() => {
      setToast({ message: 'Failed to copy', type: 'error' });
    });
  };

  return (
    <div className="app-container">
      <div className="main-card">
        <div className="header">
          <h1>Shorten. Share. Track.</h1>
          <p>Create short, memorable links in seconds</p>
        </div>

        <UrlShortenerForm
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />

        {result && (
          <UrlResult 
            result={result} 
            onCopy={handleCopy} 
            onReset={handleReset}
          />
        )}
      </div>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <footer className="footer">
        <div className="footer-content">
          <span>🔗</span>
          <span>URL Shortener</span>
          <span>•</span>
          <span>2026</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
