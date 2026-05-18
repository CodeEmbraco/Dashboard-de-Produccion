import React from 'react';
import '../styles/Dashboard.css';

const KpiCard = ({ title, total, rate, delta, values, image }) => {
  const isPositive = delta >= 0;
  const themeClass = isPositive ? 'theme-green' : 'theme-yellow';

  return (
    <div className={`card ${themeClass}`}>
      <div className="card-header">
        {title} 
      </div>
      <div className="card-body">
        <div className="stats-main">
          {/* LADO IZQUIERDO: Totales y Metricas */}
          <div className="total-group">
            <p className="label-group">TOTAL DÍA</p>
            <h1 className="total-value">
              {total} <small className="rate-divider">/ {rate}</small>
            </h1>
            <p className="rate-label">Rate Actual (RPM)</p>
            <p className="delta">Delta: <strong>{isPositive ? `+${delta}` : delta}</strong></p>
          </div>

          {/* CENTRO: Imagen unificada al tamaño estándar */}
          <div className="image-container">
            {image ? (
              <img src={image} alt={title} className="unit-image" />
            ) : (
              <div className="placeholder-img">⚙️</div>
            )}
          </div>

          {/* LADO DERECHO: Barras indicadoras de turnos */}
          <div className="mini-bars">
            <div className="bar-row">
              <span>T3:</span> 
              <span className="bar"></span> 
              <span>{values.t3}</span>
            </div>
            <div className="bar-row">
              <span>TT:</span> 
              <span className="bar"></span> 
              <span>{values.tt}</span>
            </div>
            <div className="bar-row">
              <span>T2:</span> 
              <span className="bar"></span> 
              <span>{values.t2}</span>
            </div>
          </div>
        </div>

        {/* FOOTER DE LA CARD: Barra de cumplimiento */}
        <div className="card-footer">
          <div className="progress-bar-container">
            <div className="progress-bar-fill"></div>
          </div>
          <span className="status-icon">{isPositive ? '⬆️' : '⬇️'}</span>
        </div>
      </div>
    </div>
  );
};

export default KpiCard;