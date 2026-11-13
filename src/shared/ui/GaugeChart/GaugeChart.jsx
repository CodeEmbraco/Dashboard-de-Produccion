import React from 'react';
import './GaugeChart.css';

/**
 * Medidor semicircular en SVG nativo (sin dependencias de terceros).
 * Soporta 1 nivel sólido (ej. META) o 3 niveles semáforo (ej. REAL).
 */
const polarToCartesian = (cx, cy, r, angleInDegrees) => {
  const angleInRadians = ((angleInDegrees - 180) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians)
  };
};

const describeArc = (cx, cy, r, startAngle, endAngle) => {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return ['M', start.x, start.y, 'A', r, r, 0, largeArcFlag, 1, end.x, end.y].join(' ');
};

const GaugeChart = ({
  label,
  value = 0,
  percent = 1,
  colors = ['#1976D2'],
  needleColor = '#334155',
  valueColor = '#1e293b'
}) => {
  const clampedPercent = Math.min(Math.max(Number(percent) || 0, 0), 1);
  const cx = 100;
  const cy = 92;
  const radius = 70;
  const strokeWidth = 20;

  const segments = colors.length;
  const gapDeg = segments > 1 ? 3 : 0;
  const totalGap = gapDeg * (segments - 1);
  const segSpan = (180 - totalGap) / segments;

  // Ángulo de la aguja de -90° (izquierda, 0%) a +90° (derecha, 100%)
  const needleRotation = -90 + clampedPercent * 180;

  return (
    <div className="ui-gauge-card">
      {label && <div className="ui-gauge-label">{label}</div>}
      <div className="ui-gauge-svg-wrapper">
        <svg viewBox="0 0 200 110" className="ui-gauge-svg">
          {colors.map((color, idx) => {
            const startAngle = idx * (segSpan + gapDeg);
            const endAngle = startAngle + segSpan;
            return (
              <path
                key={idx}
                d={describeArc(cx, cy, radius, startAngle, endAngle)}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="butt"
              />
            );
          })}

          {/* Aguja indicadora */}
          <g
            transform={`translate(${cx}, ${cy}) rotate(${needleRotation})`}
            style={{ transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            <polygon points="-4,0 0,-58 4,0" fill={needleColor} />
            <circle cx="0" cy="0" r="7" fill={needleColor} />
          </g>
        </svg>

        <div className="ui-gauge-value" style={{ color: valueColor }}>
          {value}
        </div>
      </div>
    </div>
  );
};

export default GaugeChart;
