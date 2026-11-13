import React from 'react';
import { Utensils } from 'lucide-react';
import { StatusDonut } from '@shared/ui';
import { getLossDescription } from '@shared/config/lossCatalog';

const ProductionRow = ({ row, onOpenModal, isMealHour, customMeta, onSetMeal }) => {
  const getRealColor = () => {
    const targetMeta = customMeta !== undefined ? Number(customMeta) : row.meta;
    if (row.real >= targetMeta && targetMeta > 0) return '#2e7d32';
    if (row.real > 0) return '#ed6c02';
    return '#d32f2f';
  };

  const realColor = getRealColor();

  return (
    <tr>
      <td
        className="row-hour-cell"
        onClick={() => onSetMeal(row.hora)}
        title="Clic para marcar hora de comida"
      >
        <div className="row-hour-content">
          {row.hora}
          {isMealHour && (
            <div className="meal-badge">
              <Utensils size={18} color="#22c55e" strokeWidth={3} />
            </div>
          )}
        </div>
      </td>

      <td>{row.meta ?? 0}</td>

      <td
        style={{
          fontWeight: 'bold',
          color: realColor,
          backgroundColor: `${realColor}20`
        }}
      >
        {row.real ?? 0}
      </td>

      <td style={{ fontSize: '0.85rem' }}>{row.modelos || '-'}</td>

      <td>
        <StatusDonut
          justificada={row.perdidaJustificada || 0}
          noJustificada={
            row.perdidaNoJustificada !== undefined
              ? row.perdidaNoJustificada
              : row.perdidaCalculada
          }
          finalizada={row.finalizada}
        />
      </td>

      <td
        style={{
          fontWeight: row.perdidaJustificada > 0 ? 'bold' : 'normal',
          color: row.perdidaJustificada > 0 ? '#f97d10' : '#64748b'
        }}
      >
        {row.perdidaJustificada || 0} min
      </td>

      <td style={{ textAlign: 'left', fontSize: '0.85rem', color: '#475569' }}>
        {row.detalles && row.detalles.length > 0 ? (
          <div className="obs-list-wrapper">
            {row.detalles.map((detalle, idx) => (
              <div key={detalle.IdDetalle ?? idx} className="obs-detail-item">
                <strong>{detalle.minutos}m:</strong> {getLossDescription(detalle.motivo)}
                <br />
                <span style={{ color: '#64748b' }}>{detalle.observacion}</span>
              </div>
            ))}
          </div>
        ) : (
          <span style={{ color: '#cbd5e1' }}>-</span>
        )}
      </td>

      <td>
        <button
          type="button"
          className="btn-row-action"
          onClick={() => onOpenModal(row.hora)}
          title="Registrar o editar pérdidas de esta hora"
        >
          ⚙️
        </button>
      </td>
    </tr>
  );
};

export default ProductionRow;
