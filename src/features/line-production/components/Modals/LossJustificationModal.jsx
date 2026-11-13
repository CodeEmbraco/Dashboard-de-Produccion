import React, { useState, useEffect } from 'react';
import { BaseModal } from '@shared/ui';
import { lossCatalog } from '@shared/config/lossCatalog';
import './LineModals.css';

const LossJustificationModal = ({
  isOpen,
  onClose,
  onSave,
  onDeleteDetail,
  currentSlot,
  initialData = [],
  perdidaCalculada = 0,
  supervisor,
  lider
}) => {
  const [tempLossList, setTempLossList] = useState([]);
  const [newLossMinutos, setNewLossMinutos] = useState('');
  const [newLossMotivo, setNewLossMotivo] = useState('');
  const [newLossObs, setNewLossObs] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTempLossList(initialData);
    }
  }, [isOpen, initialData]);

  const totalJustificado = tempLossList.reduce(
    (sum, item) => sum + (parseInt(item.minutos, 10) || 0),
    0
  );
  const noJustificado = Math.max(
    0,
    (parseInt(perdidaCalculada, 10) || 0) - totalJustificado
  );

  const addLossItem = () => {
    if (!newLossMinutos) {
      alert('Debe ingresar los minutos');
      return;
    }
    const min = parseInt(newLossMinutos, 10);
    if (min <= 0) {
      alert('Favor de introducir un valor adecuado para los minutos');
      return;
    }
    if (!newLossMotivo) {
      alert('Debe seleccionar un motivo');
      return;
    }
    if (min > noJustificado) {
      alert('Los minutos justificados superan los minutos no justificados');
      return;
    }

    const newItem = {
      minutos: min,
      motivo: newLossMotivo,
      maquina: '',
      observacion: newLossObs
    };

    setTempLossList((prev) => [...prev, newItem]);
    setNewLossMinutos('');
    setNewLossMotivo('');
    setNewLossObs('');
  };

  const removeLossItem = async (index) => {
    const itemToRemove = tempLossList[index];
    if (itemToRemove?.IdDetalle) {
      const confirmed = window.confirm('¿Estás seguro que quieres eliminar este registro?');
      if (confirmed) {
        await onDeleteDetail(itemToRemove.IdDetalle);
        setTempLossList((prev) => prev.filter((_, i) => i !== index));
      }
    } else {
      setTempLossList((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleConfirm = () => {
    const nuevosDetalles = tempLossList.filter((item) => !item.IdDetalle);
    const totalMinutes = tempLossList.reduce(
      (sum, item) => sum + (Number(item.minutos) || 0),
      0
    );
    onSave(totalMinutes, nuevosDetalles, supervisor, lider);
  };

  const handleCancel = () => {
    setTempLossList([]);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleCancel}
      title={`Registro de Eventos: ${currentSlot || ''}`}
      minWidth="650px"
    >
      <div className="loss-summary-banner">
        <div className="loss-summary-item">
          <span className="loss-summary-label">PÉRDIDA CALCULADA</span>
          <div className="loss-summary-val" style={{ color: '#1976D2' }}>
            {perdidaCalculada} min
          </div>
        </div>
        <div className="loss-summary-item">
          <span className="loss-summary-label">JUSTIFICADA</span>
          <div className="loss-summary-val" style={{ color: '#008040' }}>
            {totalJustificado} min
          </div>
        </div>
        <div className="loss-summary-item">
          <span className="loss-summary-label">NO JUSTIFICADA</span>
          <div
            className="loss-summary-val"
            style={{ color: noJustificado > 0 ? '#D32F2F' : '#455A64' }}
          >
            {noJustificado} min
          </div>
        </div>
      </div>

      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        <table className="loss-list-table">
          <thead>
            <tr>
              <th style={{ width: '90px' }}>Minutos</th>
              <th>Motivo</th>
              <th>Descripción / Observación</th>
              <th style={{ width: '50px' }}></th>
            </tr>
          </thead>
          <tbody>
            {tempLossList.map((item, idx) => (
              <tr key={item.IdDetalle ?? idx}>
                <td style={{ fontWeight: 'bold', color: '#D32F2F' }}>{item.minutos} min</td>
                <td>{item.motivo}</td>
                <td>{item.observacion}</td>
                <td>
                  <button
                    type="button"
                    className="btn-delete-loss"
                    onClick={() => removeLossItem(idx)}
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
            {tempLossList.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', color: '#94a3b8' }}>
                  Sin eventos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="add-loss-form" style={{ marginTop: '15px' }}>
        <div className="form-group">
          <label>Minutos:</label>
          <input
            type="number"
            placeholder="0"
            style={{ width: '75px' }}
            value={newLossMinutos}
            onChange={(e) => setNewLossMinutos(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Motivo:</label>
          <select
            style={{ width: '160px' }}
            value={newLossMotivo}
            onChange={(e) => setNewLossMotivo(e.target.value)}
          >
            <option value="" disabled>
              --Selecciona--
            </option>
            {Object.entries(lossCatalog).map(([codigo, descripcion]) => (
              <option key={codigo} value={codigo}>
                {codigo} - {descripcion}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Descripción:</label>
          <input
            type="text"
            placeholder="Escribe la causa..."
            style={{ width: '100%' }}
            value={newLossObs}
            onChange={(e) => setNewLossObs(e.target.value)}
          />
        </div>

        <button type="button" className="btn-add-loss" onClick={addLossItem}>
          Agregar
        </button>
      </div>

      <div className="modal-actions">
        <button type="button" className="btn-modal-cancel" onClick={handleCancel}>
          Cancelar
        </button>
        <button type="button" className="btn-modal-confirm" onClick={handleConfirm}>
          Aceptar
        </button>
      </div>
    </BaseModal>
  );
};

export default LossJustificationModal;
