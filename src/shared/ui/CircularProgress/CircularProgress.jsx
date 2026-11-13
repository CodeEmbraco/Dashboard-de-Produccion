import React from 'react';
import './CircularProgress.css';

const CircularProgress = ({ percentage, color = '#008040' }) => {
  const radius = 20;
  const strokeWidth = 3.5;
  const circumference = 2 * Math.PI * radius;

  const validPct = isNaN(percentage) || percentage === null ? 0 : Math.min(percentage, 100);
  const strokeDashoffset = circumference - (validPct / 100) * circumference;

  return (
    <div className="circular-progress-wrapper">
      <svg width="48" height="48" viewBox="0 0 48 48">
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
        />

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

      <span className="circular-progress-text">
        {percentage === null || isNaN(percentage) ? '-' : `${percentage.toFixed(1)}%`}
      </span>
    </div>
  );
};

export default CircularProgress;
