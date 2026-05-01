import React from 'react';

const StatsPanel = ({ shortCode, clickCount, createdAt, originalUrl }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="stats-panel">
      <div className="stats-row">
        <span>Clicks</span>
        <span>{clickCount.toLocaleString()}</span>
      </div>
      <div className="stats-row" style={{ marginTop: '0.5rem' }}>
        <span>Created</span>
        <span>{formatDate(createdAt)}</span>
      </div>
      <div className="stats-row" style={{ marginTop: '0.5rem' }}>
        <span>Short Code</span>
        <span style={{ fontFamily: 'monospace' }}>{shortCode}</span>
      </div>
    </div>
  );
};

export default StatsPanel;
