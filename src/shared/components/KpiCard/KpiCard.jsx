import React from 'react';
import './KpiCard.css';

const calculateShiftBarWidth = (shiftProd, shiftObj, dailyMeta) => {
  const rawPct =
    shiftObj?.eficiencia ??
    (shiftObj?.meta
      ? (shiftProd / shiftObj.meta) * 100
      : dailyMeta
        ? (shiftProd / (dailyMeta / 3)) * 100
        : 0);
  return Math.min(Math.max(rawPct, 0), 100);
};

const KpiCard = ({
  title,
  total,
  meta,
  metaAcumulada,
  delta,
  values = { t1: 0, tt: 0, t2: 0, t3: 0 },
  turnos,
  image,
  colorClass
}) => {
  const t1Val = values?.tt ?? values?.t1 ?? 0;
  const t2Val = values?.t2 ?? 0;
  const t3Val = values?.t3 ?? 0;

  const t1Width = calculateShiftBarWidth(t1Val, turnos?.T1, meta);
  const t2Width = calculateShiftBarWidth(t2Val, turnos?.T2, meta);
  const t3Width = calculateShiftBarWidth(t3Val, turnos?.T3, meta);

  const borderColor =
    colorClass === 'status-green'
      ? '#008040'
      : colorClass === 'status-yellow'
        ? '#f59e0b'
        : '#dc2626';

  return (
    <div className="kpi-mini-card" style={{ borderBottomColor: borderColor }}>
      <div className="kpi-mini-header">{title}</div>

      <div className="kpi-mini-body">
        <div className="mini-img-container">
          <img src={image} alt={title} className="kpi-mini-img" />
        </div>

        <div className="kpi-mini-vals">
          <div className={`main-val ${colorClass}`}>
            {total} <span className="meta-val">/ {metaAcumulada}</span>
          </div>
          <div className="rate-lbl">Actual Rate (RPM)</div>
        </div>

        <div className="kpi-mini-bars">
          <div className="mini-bar-row">
            <span className="bar-lbl">T1:</span>
            <div className="mini-bar-track">
              <div className="mini-bar-fill fill-status-green" style={{ width: `${t1Width}%` }}></div>
            </div>
            <span className="bar-val">{t1Val}</span>
          </div>
          <div className="mini-bar-row">
            <span className="bar-lbl">T2:</span>
            <div className="mini-bar-track">
              <div className="mini-bar-fill fill-status-green" style={{ width: `${t2Width}%` }}></div>
            </div>
            <span className="bar-val">{t2Val}</span>
          </div>
          <div className="mini-bar-row">
            <span className="bar-lbl">T3:</span>
            <div className="mini-bar-track">
              <div className="mini-bar-fill fill-status-green" style={{ width: `${t3Width}%` }}></div>
            </div>
            <span className="bar-val">{t3Val}</span>
          </div>
        </div>
      </div>

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
