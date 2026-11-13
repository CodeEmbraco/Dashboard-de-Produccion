import React from 'react';
import { CircularProgress } from '@shared/ui';
import fabricaImg from '@assets/fabrica_nidec.png';
import sakamotoFeliImg from '@assets/reynosa/sakamoto feli.png';
import placeholderImg from '@assets/placeholder.png';
import './PlantSummarySidebar.css';

const PlantSummarySidebar = ({
  linesData = [],
  currentIndex = 0,
  onSelectLine,
  totalPlanta = 0,
  metaPlanta = 0,
  getTargetMeta,
  getStatusColor
}) => {
  return (
    <aside className="sidebar-summary">
      <img src={sakamotoFeliImg} alt="Sakamoto Feli" className="zero-character" />

      <div className="sidebar-header-title">
        <h3 className="sidebar-title">RESUMEN GENERAL</h3>
        <div className="sidebar-title-underline"></div>
      </div>

      <div className="summary-list">
        <div className="summary-item total-planta-item">
          <div className="summary-item-left">
            <div className="line-icon-circle black-circle">
              <img src={fabricaImg} alt="Planta" className="sidebar-factory-icon" />
            </div>
            <div className="line-info">
              <div className="line-name">TOTAL PLANTA</div>
              <div className="line-val-group">
                <span className="line-val green-text">{totalPlanta}</span>
                <span className="line-meta"> / {metaPlanta}</span>
              </div>
            </div>
          </div>

          <CircularProgress
            percentage={metaPlanta ? (totalPlanta / metaPlanta) * 100 : 0}
            color="#008040"
          />
        </div>

        {linesData.map((item, idx) => {
          const targetItemMeta = getTargetMeta(item);
          const pct = targetItemMeta > 0 ? (item.total / targetItemMeta) * 100 : item.eficiencia;
          const isSelected = idx === currentIndex;
          const statusColor = getStatusColor(item.total, targetItemMeta);
          const colorHex =
            statusColor === 'status-green'
              ? '#008040'
              : statusColor === 'status-yellow'
                ? '#d97706'
                : '#dc2626';

          return (
            <div
              key={item.id}
              className={`summary-item ${isSelected ? 'active-green-row' : ''}`}
              onClick={() => onSelectLine(idx)}
            >
              <div className="summary-item-left">
                <div className="line-icon-circle green-icon-circle">
                  <img
                    src={item.iconImg || placeholderImg}
                    alt={item.title}
                    className="sidebar-product-icon"
                  />
                </div>
                <div className="line-info">
                  <div className="line-name">{item.title}</div>
                  <div className="line-val-group">
                    <span className="line-val green-text">{item.total}</span>
                    <span className="line-meta"> / {targetItemMeta}</span>
                  </div>
                </div>
              </div>

              <CircularProgress percentage={pct} color={colorHex} />
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default PlantSummarySidebar;
