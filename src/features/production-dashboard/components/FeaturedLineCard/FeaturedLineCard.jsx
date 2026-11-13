import React from 'react';
import HourlyProductionChart from '../HourlyProductionChart/HourlyProductionChart';
import sakamotoFeliImg from '@assets/reynosa/sakamoto feli.png';
import './FeaturedLineCard.css';

const getShiftBarWidth = (shiftProd, shiftObj, lineMeta) => {
  const rawPct =
    shiftObj?.eficiencia ??
    (shiftObj?.meta
      ? (shiftProd / shiftObj.meta) * 100
      : lineMeta
        ? (shiftProd / lineMeta) * 100
        : 0);
  return Math.min(Math.max(rawPct, 0), 100);
};

const FeaturedLineCard = ({
  currentLine,
  targetCurrentMeta,
  currentDelta,
  isToday,
  hourlyData,
  isPaused,
  onTogglePause
}) => {
  const t1Prod = currentLine.values?.tt ?? currentLine.values?.t1 ?? 0;
  const t2Prod = currentLine.values?.t2 ?? 0;
  const t3Prod = currentLine.values?.t3 ?? 0;

  const shifts = [
    {
      label: 'T1:',
      code: '1 (D)',
      prod: t1Prod,
      shiftObj: currentLine.turnos?.T1,
      width: getShiftBarWidth(t1Prod, currentLine.turnos?.T1, currentLine.meta)
    },
    {
      label: 'T2:',
      code: '2 (E)',
      prod: t2Prod,
      shiftObj: currentLine.turnos?.T2,
      width: getShiftBarWidth(t2Prod, currentLine.turnos?.T2, currentLine.meta)
    },
    {
      label: 'T3:',
      code: '3 (F)',
      prod: t3Prod,
      shiftObj: currentLine.turnos?.T3,
      width: getShiftBarWidth(t3Prod, currentLine.turnos?.T3, currentLine.meta)
    }
  ];

  return (
    <main className="featured-card">
      <div className="featured-card-grid">
        {/* COLUMNA 1: Producto */}
        <div className="featured-green-sidebar">
          <h2 className="featured-product-title">{currentLine.title}</h2>
          <div className="featured-product-title-underline"></div>
          <div className="featured-img-wrapper">
            <img
              src={currentLine.image}
              alt={currentLine.title}
              className="featured-product-img"
            />
          </div>
        </div>

        {/* COLUMNA 2: Producción del Día y Gráfica Horaria */}
        <div className="featured-col-chart">
          <div className="featured-section-title">PRODUCCIÓN DEL DÍA</div>
          <div className="featured-main-value">
            <span className="val-current">{currentLine.total}</span>
            <span className="val-divider">/</span>
            <span className="val-meta">{targetCurrentMeta}</span>
          </div>

          <div className="chart-label-rpm">Actual Rate (RPM)</div>

          <HourlyProductionChart lineData={currentLine} data={hourlyData} />
        </div>

        {/* COLUMNA 3: Delta y Meta del Día */}
        <div className="featured-col-delta">
          <div className="featured-section-title">DELTA</div>
          <div
            className="featured-delta-val"
            style={{ color: currentDelta >= 0 ? '#008040' : '#dc2626' }}
          >
            {currentDelta > 0 ? `+${currentDelta}` : currentDelta}
          </div>

          <div className={currentDelta >= 0 ? 'badge-pill-green' : 'badge-pill-red'}>
            {currentDelta >= 0 ? '↗' : '↘'}{' '}
            {targetCurrentMeta > 0
              ? ((Math.abs(currentDelta) / targetCurrentMeta) * 100).toFixed(1)
              : 0}
            %{' '}
            <span className="vs-meta">
              {isToday ? 'vs Meta Acum.' : 'vs Meta Total'}
            </span>
          </div>

          <div className="featured-divider-line"></div>

          <div className="featured-section-title">META DEL DÍA</div>
          <div className="featured-meta-val">{currentLine.meta}</div>
          <div className="featured-rpm-unit">PZAS / DÍA</div>
        </div>

        {/* COLUMNA 4: Downtime, Turnos y Control de Pausa */}
        <div className="featured-col-trend downtime-col">
          <div className="downtime-top-section">
            <div className="featured-section-title">DOWNTIME</div>

            <div className="downtime-main-metric">
              <span className="downtime-number">
                {currentLine.downtime?.totalMin ??
                  currentLine.produccion?.totalDia?.perdidaNoJustificada ??
                  0}
              </span>
              <span className="downtime-unit">min</span>
            </div>

            <div
              className={`downtime-badge ${
                !currentLine.downtime?.pending && currentLine.downtime?.totalMin === 0
                  ? 'badge-success'
                  : ''
              }`}
              title={`Pérdidas del día:\n• No Justificada: ${
                currentLine.downtime?.perdidaNoJustificada ?? 0
              } min\n• Justificada: ${currentLine.downtime?.perdidaJustificada ?? 0} min`}
            >
              {currentLine.downtime?.pending
                ? '⏳ Tiempo Muerto (Pendiente)'
                : currentLine.downtime?.totalMin > 0
                  ? `⚠️ Tiempo Muerto: ${currentLine.downtime?.totalMin} min`
                  : '✓ Sin Tiempo Muerto'}
            </div>
          </div>

          <div className="featured-divider-line"></div>

          <div className="production-shift-section">
            <div className="downtime-sub-title">PRODUCCIÓN POR TURNO</div>

            <div className="featured-bars-container">
              {shifts.map((shift) => (
                <div
                  key={shift.label}
                  className="featured-bar-row"
                  title={`Turno ${shift.code}: Producción ${shift.prod} | Meta: ${
                    shift.shiftObj?.meta ?? 0
                  } | Eficiencia: ${shift.shiftObj?.eficiencia ?? 0}% | Pérdida: ${
                    shift.shiftObj?.downtime ?? 0
                  } min`}
                >
                  <span className="lbl-t">{shift.label}</span>
                  <div className="bar-track">
                    <div
                      className="bar-fill-green"
                      style={{ width: `${shift.width}%` }}
                    ></div>
                  </div>
                  <span className="val-t">{shift.prod}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="zero-mascot-wrapper">
            <img
              src={sakamotoFeliImg}
              alt="Sakamoto Feli Mascot"
              className="zero-mascot-img"
            />

            <button
              className={`pause-control-btn ${isPaused ? 'paused' : ''}`}
              onClick={onTogglePause}
              title={
                isPaused
                  ? 'Reanudar avance automático'
                  : 'Pausar avance en esta línea'
              }
            >
              {isPaused ? '▶' : '⏸'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default FeaturedLineCard;
