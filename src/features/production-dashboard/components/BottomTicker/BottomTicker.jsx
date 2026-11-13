import React from 'react';
import KpiCard from '@shared/components/KpiCard/KpiCard';
import './BottomTicker.css';

const BottomTicker = ({ linesData = [], getTargetMeta, getStatusColor }) => {
  const renderCards = (prefix) =>
    linesData.map((item) => {
      const targetItemMeta = getTargetMeta(item);
      return (
        <div key={`${prefix}-${item.id}`} className="ticker-card-item">
          <KpiCard
            {...item}
            metaAcumulada={targetItemMeta}
            colorClass={getStatusColor(item.total, targetItemMeta)}
          />
        </div>
      );
    });

  return (
    <div className="ticker-wrapper">
      <div className="ticker-track">
        {renderCards('orig')}
        {renderCards('dup')}
      </div>
    </div>
  );
};

export default BottomTicker;
