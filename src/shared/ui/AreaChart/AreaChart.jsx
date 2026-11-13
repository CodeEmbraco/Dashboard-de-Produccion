import React, { useMemo } from 'react';
import './AreaChart.css';

/**
 * Calcula una escala agradable para el eje Y basada en el valor máximo.
 * Retorna niceMax y los 5 pasos correspondientes a las líneas de la cuadrícula.
 */
export const getNiceYAxisSteps = (maxVal) => {
  let niceMax = 100;

  if (maxVal && maxVal > 0) {
    const raw = maxVal * 1.15;
    if (raw <= 20) niceMax = 20;
    else if (raw <= 40) niceMax = 40;
    else if (raw <= 80) niceMax = 80;
    else if (raw <= 100) niceMax = 100;
    else if (raw <= 150) niceMax = 150;
    else if (raw <= 200) niceMax = 200;
    else if (raw <= 300) niceMax = 300;
    else if (raw <= 400) niceMax = 400;
    else if (raw <= 600) niceMax = 600;
    else if (raw <= 800) niceMax = 800;
    else if (raw <= 1200) niceMax = 1200;
    else if (raw <= 1600) niceMax = 1600;
    else if (raw <= 2000) niceMax = 2000;
    else niceMax = Math.ceil(raw / 400) * 400;
  }

  const step = niceMax / 4;
  return {
    niceMax,
    steps: [
      Math.round(niceMax),
      Math.round(niceMax - step),
      Math.round(niceMax - step * 2),
      Math.round(niceMax - step * 3),
      0
    ]
  };
};

/**
 * Componente puramente visual de gráfico de área en SVG.
 * Agnóstico al dominio: recibe una serie de puntos { id, label, value, tooltip } y etiquetas X opcionales.
 */
const AreaChart = ({
  series = [],
  xAxisLabels = [],
  strokeColor = '#008040'
}) => {
  const { points, ySteps } = useMemo(() => {
    const maxVal = Math.max(...series.map((item) => Number(item.value) || 0), 0);
    const { niceMax, steps } = getNiceYAxisSteps(maxVal);

    const svgWidth = 300;
    const baseY = 110;
    const usableHeight = 100;
    const totalPoints = series.length;

    const mappedPoints = series.map((pt, index) => {
      const x = totalPoints > 1 ? (index / (totalPoints - 1)) * svgWidth : svgWidth / 2;
      const ratio = niceMax > 0 ? (Number(pt.value) || 0) / niceMax : 0;
      const y = baseY - Math.min(usableHeight, Math.max(0, ratio * usableHeight));

      return {
        ...pt,
        x: Number(x.toFixed(1)),
        y: Number(y.toFixed(1))
      };
    });

    return {
      points: mappedPoints,
      ySteps: steps
    };
  }, [series]);

  const polylinePoints = useMemo(() => {
    if (!points || points.length === 0) return '0,110 300,110';
    return points.map((p) => `${p.x},${p.y}`).join(' ');
  }, [points]);

  const polygonPoints = useMemo(() => {
    if (!points || points.length === 0) return '0,110 300,110 300,110 0,110';
    const coords = points.map((p) => `${p.x},${p.y}`).join(' ');
    return `0,110 ${coords} 300,110 0,110`;
  }, [points]);

  return (
    <div className="custom-chart-container">
      <div className="chart-y-axis">
        {ySteps.map((stepVal, idx) => (
          <span key={idx}>{stepVal}</span>
        ))}
      </div>

      <div className="chart-svg-wrapper">
        <svg viewBox="0 0 300 120" preserveAspectRatio="none" className="chart-svg">
          <defs>
            <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.28" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.02" />
            </linearGradient>
          </defs>

          <line x1="0" y1="10" x2="300" y2="10" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="0" y1="35" x2="300" y2="35" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="0" y1="60" x2="300" y2="60" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="0" y1="85" x2="300" y2="85" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="0" y1="110" x2="300" y2="110" stroke="#e2e8f0" strokeWidth="1" />

          <polygon
            points={polygonPoints}
            fill="url(#greenGradient)"
            style={{ transition: 'all 0.4s ease-out' }}
          />

          <polyline
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={polylinePoints}
            style={{ transition: 'all 0.4s ease-out' }}
          />

          {points.map((marker, i) => (
            <circle
              key={`${marker.id ?? i}`}
              cx={marker.x}
              cy={marker.y}
              r="2.5"
              fill={strokeColor}
              stroke="#ffffff"
              strokeWidth="1"
              className="chart-data-point"
              style={{ transition: 'all 0.3s ease-out', cursor: 'pointer' }}
            >
              {marker.tooltip && <title>{marker.tooltip}</title>}
            </circle>
          ))}
        </svg>

        {xAxisLabels.length > 0 && (
          <div className="chart-x-axis">
            {xAxisLabels.map((lbl, idx) => (
              <span key={idx}>{lbl}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AreaChart;
