import React, { memo } from 'react';
import { GaugeChart } from '@shared/ui';
import sakamotoFeliImg from '@assets/reynosa/sakamoto feli.png';
import './ShiftGaugesWidget.css';

const ShiftGaugesWidget = ({ percent = 0, real = 0, goal = 0 }) => {
  const gaugePercent = Math.min(Math.max(Number(percent) || 0, 0), 100) / 100;

  return (
    <div className="shift-gauges-container">
      <GaugeChart
        label="META"
        value={parseInt(goal, 10) || 0}
        percent={1}
        colors={['#1976D2']}
        needleColor="#94a3b8"
        valueColor="#1e293b"
      />

      <GaugeChart
        label="REAL"
        value={real}
        percent={gaugePercent}
        colors={['#EA4228', '#F5CD19', '#008040']}
        needleColor="#1e293b"
        valueColor={real >= goal && goal > 0 ? '#008040' : '#1e293b'}
      />

      <div className="shift-mascot-wrapper">
        <img
          src={sakamotoFeliImg}
          alt="Indicador de Estado"
          className="shift-mascot-img"
        />
      </div>
    </div>
  );
};

export default memo(ShiftGaugesWidget);
