import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DeploymentPage.css';

export default function DeploymentPage({ id, onNavigate }) {
  const [deployment, setDeployment] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const deploymentId = id || window.deploymentId;

  useEffect(() => {
    if (!deploymentId) return;
    const fetchData = async () => {
      try {
        const depRes = await axios.get(`/api/deployments/${deploymentId}`);
        setDeployment(depRes.data);
        const logsRes = await axios.get(`/api/deployments/${deploymentId}/logs`);
        setLogs(logsRes.data.logs);
        setLoading(false);
      } catch (err) {
        setError('Failed to load deployment');
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [deploymentId]);

  if (loading) {
    return (
      <div className="deployment-page">
        <div className="loading-center">
          <div className="spinner" />
          <p>Loading deployment...</p>
        </div>
      </div>
    );
  }

  if (error || !deployment) {
    return (
      <div className="deployment-page">
        <div className="error-container">
          <p>{error || 'Deployment not found'}</p>
          <button onClick={() => onNavigate('dashboard')}>← Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const isLive = deployment.status === 'Live';
  const isFailed = deployment.status === 'Failed';

  return (
    <div className="deployment-page">
      <div className="deployment-header slide-down">
        <button className="back-btn" onClick={() => onNavigate('dashboard')}>← Back</button>
        <h1>{deployment.siteName}</h1>
      </div>

      <div className="deployment-container">
        <div className="status-section slide-up">
          <h2>Status</h2>
          <div className={`status-display ${deployment.status.toLowerCase().replace(' ', '-')}`}>
            <div className={`status-icon ${isLive ? 'checkmark-anim' : ''} ${isFailed ? 'error' : ''}`}>
              {isLive && '✓'}
              {isFailed && '✕'}
              {!isLive && !isFailed && <span className="spinner" />}
            </div>
            <div className="status-text">
              <p className="status-value">{deployment.status}</p>
              <p className="status-label">
                {isLive && 'Your website is live!'}
                {isFailed && deployment.errorMessage}
                {!isLive && !isFailed && 'Deploying your website...'}
              </p>
            </div>
          </div>

          {isLive && (
            <div className="url-box">
              <code>{deployment.publicUrl}</code>
              <div className="url-actions">
                <button className="url-btn open-btn" onClick={() => window.open(deployment.publicUrl, '_blank')}>Open Website</button>
                <button className="url-btn copy-btn" onClick={() => {
                  navigator.clipboard.writeText(deployment.publicUrl);
                  alert('URL copied!');
                }}>Copy URL</button>
              </div>
            </div>
          )}
        </div>

        <div className="logs-section slide-up" style={{ animationDelay: '0.1s' }}>
          <h2>Deployment Timeline</h2>
          <div className="logs-container">
            {logs.length === 0 ? (
              <p className="no-logs">No logs yet...</p>
            ) : (
              <div className="timeline">
                {logs.map((log, index) => (
                  <div key={index} className="timeline-item" style={{ animationDelay: `${index * 0.05}s` }}>
                    <div className={`timeline-marker ${log.level}`} />
                    <div className="timeline-content">
                      <p className="log-message">{log.message}</p>
                      <p className="log-time">{new Date(log.createdAt).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
