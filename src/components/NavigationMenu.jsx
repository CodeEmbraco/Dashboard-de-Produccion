import React, { useState } from 'react';
import '../components/NavigationMenu.css';

const NavigationMenu = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="nav-menu-container">
      {/* Botón Flotante con Ícono de Hamburguesa */}
      <button 
        className={`nav-hamburger-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="hamburger-icon">☰</span>
      </button>

      {/* Menú Desplegable */}
      {isOpen && (
        <div className="nav-dropdown-card">
          <button 
            className={`nav-option-btn ${activeTab === 'dashboard' ? 'selected' : ''}`}
            onClick={() => {
              setActiveTab('dashboard');
              setIsOpen(false);
            }}
          >
            <span className="nav-btn-icon">📊</span>
            Dashboard Visual
          </button>

          <button 
            className={`nav-option-btn ${activeTab === 'consolidated' ? 'selected' : ''}`}
            onClick={() => {
              setActiveTab('consolidated');
              setIsOpen(false);
            }}
          >
            <span className="nav-btn-icon">📄</span>
            Reporte Consolidado
          </button>
        </div>
      )}
    </div>
  );
};

export default NavigationMenu;