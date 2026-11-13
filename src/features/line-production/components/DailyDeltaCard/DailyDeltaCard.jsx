import React from 'react';
import './DailyDeltaCard.css';

const DailyDeltaCard = ({
  total = 0,
  accGoal = 0,
  totalTurno = [],
  eficiencia = 0,
  activeShifts = [],
  onToggleShift,
  isAdmin,
  onAccessDenied
}) => {
  const deltaValue = total - accGoal;
  const deltaSign = deltaValue >= 0 ? '+' : '';

  const hasActiveShifts =
    activeShifts.length === 0 || activeShifts.some((s) => s.Activo || s.ACTIVO);

  const deltaColor =
    !hasActiveShifts || accGoal === 0
      ? '#008040'
      : eficiencia >= 100
        ? '#008040'
        : eficiencia >= 90
          ? '#eab308'
          : '#dc2626';

  const displayValue = Math.min(Math.max(Number(eficiencia) || 0, 0), 100);

  const shifts = [
    { id: '1', label: 'T1', value: totalTurno[0]?.contador ?? 0 },
    { id: '2', label: 'T2', value: totalTurno[1]?.contador ?? 0 },
    { id: '3', label: 'T3', value: totalTurno[2]?.contador ?? 0 }
  ];

  return (
    <div className="daily-delta-card" style={{ border: `3px solid ${deltaColor}` }}>
      <div className="daily-delta-title">TOTAL DÍA</div>

      <div className="daily-delta-body">
        <div style={{ flex: 1 }}>
          <div className="daily-delta-main-val" style={{ color: deltaColor }}>
            {total}{' '}
            <span className="daily-delta-goal-span">/ {parseInt(accGoal, 10) || 0}</span>
          </div>
          <div
            className="daily-delta-pill"
            style={{
              color: deltaColor,
              backgroundColor: `${deltaColor}25`
            }}
          >
            Delta: {deltaSign}
            {parseInt(deltaValue, 10) || 0}
          </div>
        </div>

        <div className="daily-delta-divider"></div>

        <div className="daily-delta-shifts">
          {shifts.map((s) => {
            const statusDB = activeShifts.find(
              (shift) => String(shift.Turno) === String(s.id)
            );
            const isActive = statusDB ? Boolean(statusDB.Activo) : true;

            return (
              <div
                key={s.id}
                className="daily-delta-shift-row"
                onClick={() =>
                  isAdmin
                    ? onToggleShift(s.id, isActive)
                    : onAccessDenied('Acceso Protegido: Introduzca credenciales válidas.')
                }
                style={{
                  cursor: isAdmin ? 'pointer' : 'not-allowed',
                  opacity: isActive ? 1 : 0.4,
                  textDecoration: isActive ? 'none' : 'line-through'
                }}
                title={
                  !isAdmin
                    ? 'Acceso Restringido'
                    : isActive
                      ? 'Turno activo (Click para desactivar)'
                      : 'Turno inactivo (Click para activar)'
                }
              >
                <span style={{ fontWeight: 'bold', color: isActive ? '#475569' : '#94a3b8' }}>
                  <span style={{ marginRight: '5px', color: isActive ? '#008040' : '#94a3b8' }}>
                    ●
                  </span>
                  {s.label}:
                </span>
                <strong style={{ marginLeft: '10px', color: '#1e293b' }}>{s.value}</strong>
              </div>
            );
          })}
        </div>
      </div>

      <div className="daily-delta-progress-track">
        <div
          className="daily-delta-progress-fill"
          style={{ width: `${displayValue}%`, backgroundColor: deltaColor }}
        ></div>
      </div>
    </div>
  );
};

export default DailyDeltaCard;
