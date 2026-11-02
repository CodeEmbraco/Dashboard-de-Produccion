import React from 'react';
import '../styles/Dashboard.css';

const KpiCard = ({ title, total, meta, metaAcumulada, delta, values = { t1: 0, tt: 0, t2: 0, t3: 0 }, turnos, image, colorClass }) => {
  const t3Width = Math.min(
    Math.max(
      turnos?.T3?.eficiencia ??
        (turnos?.T3?.meta
          ? ((values?.t3 ?? 0) / turnos.T3.meta) * 100
          : meta
          ? ((values?.t3 ?? 0) / (meta / 3)) * 100
          : 0),
      0
    ),
    100
  );

  const t1Width = Math.min(
    Math.max(
      turnos?.T1?.eficiencia ??
        (turnos?.T1?.meta
          ? ((values?.tt ?? values?.t1 ?? 0) / turnos.T1.meta) * 100
          : meta
          ? ((values?.tt ?? values?.t1 ?? 0) / (meta / 3)) * 100
          : 0),
      0
    ),
    100
  );

  const t2Width = Math.min(
    Math.max(
      turnos?.T2?.eficiencia ??
        (turnos?.T2?.meta
          ? ((values?.t2 ?? 0) / turnos.T2.meta) * 100
          : meta
          ? ((values?.t2 ?? 0) / (meta / 3)) * 100
          : 0),
      0
    ),
    100
  );

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
            {total} <span className="meta-val">/ {metaAcumulada}</span>
          </div>
          <div className="rate-lbl">Actual Rate (RPM)</div>
        </div>

        {/* Barras por Turnos */}
        <div className="kpi-mini-bars">
          <div className="mini-bar-row">
            <span className="bar-lbl">T3:</span>
            <div className="mini-bar-track">
              <div className="mini-bar-fill fill-status-green" style={{ width: `${t3Width}%` }}></div>
            </div>
            <span className="bar-val">{values?.t3 ?? 0}</span>
          </div>
          <div className="mini-bar-row">
            <span className="bar-lbl">T1:</span>
            <div className="mini-bar-track">
              <div className="mini-bar-fill fill-status-green" style={{ width: `${t1Width}%` }}></div>
            </div>
            <span className="bar-val">{values?.tt ?? values?.t1 ?? 0}</span>
          </div>
          <div className="mini-bar-row">
            <span className="bar-lbl">T2:</span>
            <div className="mini-bar-track">
              <div className="mini-bar-fill fill-status-green" style={{ width: `${t2Width}%` }}></div>
            </div>
            <span className="bar-val">{values?.t2 ?? 0}</span>
          </div>
        </div>
      </div>

      {/* Pie con Delta */}
      <div
        className="kpi-mini-footer"
        style={delta < 0 ? { backgroundColor: '#7f1d1d' } : {}}
      >
        Delta: {delta > 0 ? `+${delta}` : delta}
      </div>
    </div>
  );
};

export default KpiCard;