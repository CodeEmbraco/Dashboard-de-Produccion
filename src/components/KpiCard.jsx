import React from 'react';
import '../styles/Dashboard.css';

const KpiCard = ({ title, total, meta, delta, values, image, colorClass }) => {
  return (
    <div className="kpi-mini-card" style={{ borderBottomColor: colorClass === 'status-green' ? '#008040' : colorClass === 'status-yellow' ? '#f59e0b' : '#dc2626' }}>
      <div className="kpi-mini-header">{title}</div>
      
      <div className="kpi-mini-body">
        {/* Imagen del Producto */}
        <div className="mini-img-container">
          <img src={image} alt={title} className="kpi-mini-img" />
        </div>

        {/* Métricas Principales */}
        <div className="kpi-mini-vals">
          <div className={`main-val ${colorClass}`}>
            {total} <span className="meta-val">/ {meta}</span>
          </div>
          <div className="rate-lbl">Actual Rate (RPM)</div>
        </div>

        {/* Barras por Turnos */}
        <div className="kpi-mini-bars">
          <div className="mini-bar-row">
            <span className="bar-lbl">T3:</span>
            <div className="mini-bar-track">
              <div className="mini-bar-fill fill-status-green" style={{ width: `${meta ? Math.min((values.t3 / (meta / 3)) * 100, 100) : 0}%` }}></div>
            </div>
            <span className="bar-val">{values.t3}</span>
          </div>
          <div className="mini-bar-row">
            <span className="bar-lbl">T1:</span>
            <div className="mini-bar-track">
              <div className="mini-bar-fill fill-status-green" style={{ width: `${meta ? Math.min((values.tt / (meta / 3)) * 100, 100) : 0}%` }}></div>
            </div>
            <span className="bar-val">{values.tt}</span>
          </div>
          <div className="mini-bar-row">
            <span className="bar-lbl">T2:</span>
            <div className="mini-bar-track">
              <div className="mini-bar-fill fill-status-green" style={{ width: `${meta ? Math.min((values.t2 / (meta / 3)) * 100, 100) : 0}%` }}></div>
            </div>
            <span className="bar-val">{values.t2}</span>
          </div>
        </div>
      </div>

      {/* Pie con Delta */}
      <div className="kpi-mini-footer">
        Delta: {delta > 0 ? `+${delta}` : delta}
      </div>
    </div>
  );
};

export default KpiCard;