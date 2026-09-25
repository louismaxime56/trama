import React, { useState, useRef } from 'react';
import axios from 'axios';
import './UploadZone.css';

export default function UploadZone({ setUploading, onNavigate }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type.includes('enter') || e.type.includes('over'));
  };

  const validateAndUpload = async (file) => {
    setError(null);

    if (!file.name.toLowerCase().endsWith('.zip')) {
      setError('Please upload a ZIP file.');
      return;
    }

    const maxSize = 524288000; // 500MB
    if (file.size > maxSize) {
      setError('ZIP file is too large. Maximum size is 500MB.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      setProgress(0);

      const response = await axios.post('/api/deployments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded / e.total) * 100));
        },
      });

      // Navigate to deployment page
      onNavigate('deployment');
      // Pass deployment ID
      window.deploymentId = response.data.id;
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) validateAndUpload(file);
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) validateAndUpload(file);
  };

  return (
    <div className="upload-zone-wrapper">
      <div
        className={`upload-zone slide-up ${dragActive ? 'active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{ animationDelay: '0.25s' }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".zip"
          onChange={handleChange}
          hidden
          disabled={progress > 0}
        />

        <div className="upload-content">
          {progress === 0 ? (
            <>
              <div className="upload-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M2 12h20M7 7l5-5 5 5M7 17l5 5 5-5" />
                </svg>
              </div>
              <h2>Drop your website ZIP here</h2>
              <p>or</p>
              <button
                type="button"
                className="upload-btn"
                onClick={() => inputRef.current?.click()}
              >
                Select ZIP File
              </button>
              <p className="upload-hint">Max 500MB • .zip format</p>
            </>
          ) : (
            <>
              <div className="progress-spinner spinner" />
              <h2>Uploading... {progress}%</h2>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </>
          )}
        </div>
      </div>
      {error && <div className="upload-error slide-down">{error}</div>}
    </div>
  );
}
