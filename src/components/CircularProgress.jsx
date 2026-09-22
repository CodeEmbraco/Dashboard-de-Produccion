import React from 'react';

const CircularProgress = ({ percentage, color = '#008040' }) => {
  const radius = 20; // Radio más amplio para un círculo más grande
  const strokeWidth = 3.5;
  const circumference = 2 * Math.PI * radius;

  // Si no hay meta o el valor no es válido
  const validPct = isNaN(percentage) || percentage === null ? 0 : Math.min(percentage, 100);
  const strokeDashoffset = circumference - (validPct / 100) * circumference;

  return (
    <div className="circular-progress-wrapper">
      <svg width="48" height="48" viewBox="0 0 48 48">
        {/* Pista base en gris claro */}
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
        />

        {/* Arco de avance dinámico */}
        {validPct > 0 && (
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 24 24)"
            style={{ transition: 'stroke-dashoffset 0.6s ease-in-out' }}
          />
        )}
      </svg>

      {/* Porcentaje perfectamente centrado sin empalmarse */}
      <span className="circular-progress-text">
        {percentage === null || isNaN(percentage) ? '-' : `${percentage.toFixed(1)}%`}
      </span>
    </div>
  );
};

export default CircularProgress;