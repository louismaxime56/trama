import React, { useState } from 'react';
import UploadZone from '../components/UploadZone';
import './HomePage.css';

export default function HomePage({ onNavigate }) {
  const [uploading, setUploading] = useState(false);

  return (
    <div className="home-page">
      <div className="home-content fade-in">
        <div className="home-header">
          <h1 className="slide-up" style={{ animationDelay: '0.1s' }}>Put your website online.</h1>
          <p className="subtitle slide-up" style={{ animationDelay: '0.2s' }}>
            Upload your ZIP file and Trama handles the rest.
          </p>
        </div>

        <UploadZone setUploading={setUploading} onNavigate={onNavigate} />

        <div className="steps">
          <div className="step slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="step-number">1</div>
            <h3>Upload</h3>
            <p>Drop your website ZIP file here.</p>
          </div>
          <div className="step slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="step-number">2</div>
            <h3>Deploy</h3>
            <p>Trama automatically detects and builds it.</p>
          </div>
          <div className="step slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="step-number">3</div>
            <h3>Share</h3>
            <p>Get your instant Trama URL.</p>
          </div>
        </div>

        <button className="dashboard-btn slide-up" style={{ animationDelay: '0.6s' }} onClick={() => onNavigate('dashboard')}>
          View Dashboard
        </button>
      </div>
    </div>
  );
}
