import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './NavigationMenu.css';

const NavigationMenu = ({ activeTab, setActiveTab, focusedLineId = 'linea14' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isOnDashboardRoute = location.pathname.toLowerCase().startsWith('/dashboard');

  const handleGoDashboard = () => {
    setIsOpen(false);
    if (isOnDashboardRoute && setActiveTab) {
      setActiveTab('dashboard');
    } else {
      navigate('/Dashboard', { state: { activeTab: 'dashboard' } });
    }
  };

  const handleGoConsolidated = () => {
    setIsOpen(false);
    if (isOnDashboardRoute && setActiveTab) {
      setActiveTab('consolidated');
    } else {
      navigate('/Dashboard', { state: { activeTab: 'consolidated' } });
    }
  };

  const handleGoHourlyTable = () => {
    setIsOpen(false);
    navigate(`/Produccion/${focusedLineId || 'linea14'}`);
  };

  return (
    <div className="nav-menu-container">
      <button
        type="button"
        className={`nav-hamburger-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="hamburger-icon">☰</span>
      </button>

      {isOpen && (
        <div className="nav-dropdown-card">
          <button
            type="button"
            className={`nav-option-btn ${activeTab === 'dashboard' ? 'selected' : ''}`}
            onClick={handleGoDashboard}
          >
            <span className="nav-btn-icon">📊</span>
            Dashboard Visual
          </button>

          <button
            type="button"
            className={`nav-option-btn ${activeTab === 'consolidated' ? 'selected' : ''}`}
            onClick={handleGoConsolidated}
          >
            <span className="nav-btn-icon">📄</span>
            Reporte Consolidado
          </button>

          <button
            type="button"
            className={`nav-option-btn ${activeTab === 'hourly' ? 'selected' : ''}`}
            onClick={handleGoHourlyTable}
          >
            <span className="nav-btn-icon">⏱️</span>
            Tabla Hora por Hora
          </button>
        </div>
      )}
    </div>
  );
};

export default NavigationMenu;
