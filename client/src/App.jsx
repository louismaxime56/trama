import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import DeploymentPage from './pages/DeploymentPage';
import './App.css';

export default function App() {
  const [page, setPage] = useState('home');
  const [activeDeploymentId, setActiveDeploymentId] = useState(null);

  const handleViewDeployment = (id) => {
    setActiveDeploymentId(id);
    setPage('deployment');
  };

  return (
    <div className="app-container">
      {page === 'home' && <HomePage onNavigate={setPage} />}
      {page === 'dashboard' && <DashboardPage onNavigate={setPage} onViewDeployment={handleViewDeployment} />}
      {page === 'deployment' && <DeploymentPage id={activeDeploymentId} onNavigate={setPage} />}
    </div>
  );
}
