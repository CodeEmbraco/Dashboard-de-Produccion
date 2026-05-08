import React from 'react';
import '../styles/Dashboard.css';

const KpiCard = ({ title, total, rate, delta, values, image }) => {
  const isPositive = delta >= 0;
  
  // Cambiamos la lógica para usar el color amarillo en lugar de rojo
  const themeClass = isPositive ? 'theme-green' : 'theme-yellow';

  // Determinamos si es una de las tarjetas que requiere la imagen en tamaño grande
  const imageClass = (title === 'ELECTRONICS' || title === 'ECM FAN') 
    ? 'large-unit-image' 
    : 'unit-image';

  return (
    <div className={`card ${themeClass}`}>
      <div className="card-header">
        {title} 
      </div>
      <div className="card-body">
        <div className="stats-main">
          {/* LADO IZQUIERDO: Totales */}
          <div className="total-group">
            <p className="label-group">TOTAL DÍA</p>
            <h1 className="total-value">
              {total} <small>/ {rate}</small>
            </h1>
            <p className="rate-label">Rate Actual (RPM)</p>
            <p className="delta">Delta: <strong>{isPositive ? `+${delta}` : delta}</strong></p>
          </div>

          {/* CENTRO: Imagen dinámica con tamaño ajustado */}
          <div className="image-container">
            {image ? (
              <img src={image} alt={title} className={imageClass} />
            ) : (
              <div className="placeholder-img">⚙️</div>
            )}
          </div>

          {/* LADO DERECHO: Barras de turnos */}
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