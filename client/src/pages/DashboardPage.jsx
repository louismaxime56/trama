import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DashboardPage.css';

export default function DashboardPage({ onNavigate, onViewDeployment }) {
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDeployments();
    const interval = setInterval(fetchDeployments, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchDeployments = async () => {
    try {
      const response = await axios.get('/api/deployments');
      setDeployments(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load deployments');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this deployment?')) return;
    try {
      await axios.delete(`/api/deployments/${id}`);
      setDeployments(deployments.filter(d => d.id !== id));
    } catch (err) {
      alert('Failed to delete deployment');
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header slide-down">
        <h1>My Websites</h1>
        <button className="back-btn" onClick={() => onNavigate('home')}>
          ← Upload New
        </button>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner" />
          <p>Loading deployments...</p>
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : deployments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h2>No websites yet</h2>
          <p>Upload your first website ZIP to get started.</p>
          <button className="upload-new-btn" onClick={() => onNavigate('home')}>
            Upload Website
          </button>
        </div>
      ) : (
        <div className="deployments-grid">
          {deployments.map((deployment, index) => (
            <div key={deployment.id} className="deployment-card slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="card-header">
                <h3>{deployment.siteName}</h3>
                <span className={`status-badge ${deployment.status.toLowerCase().replace(' ', '-')}`}>
                  {deployment.status === 'Live' && '✓'} {deployment.status}
                </span>
              </div>
              <div className="card-url">
                <code>{deployment.publicUrl}</code>
                <button className="copy-btn" onClick={() => {
                  navigator.clipboard.writeText(deployment.publicUrl);
                  alert('URL copied!');
                }} title="Copy URL">📋</button>
              </div>
              <div className="card-meta">
                <small>{new Date(deployment.createdAt).toLocaleDateString()}</small>
              </div>
              <div className="card-actions">
                {deployment.status === 'Live' && (
                  <a href={deployment.publicUrl} target="_blank" rel="noopener noreferrer" className="action-link">Open</a>
                )}
                <button className="action-btn logs-btn" onClick={() => onViewDeployment(deployment.id)}>Logs</button>
                <button className="action-btn delete-btn" onClick={() => handleDelete(deployment.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
