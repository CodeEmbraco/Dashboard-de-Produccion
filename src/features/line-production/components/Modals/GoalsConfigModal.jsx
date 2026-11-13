import React, { useState, useMemo, useEffect } from 'react';
import { BaseModal } from '@shared/ui';
import { horasEsperadas } from '@shared/utils/shiftUtils';
import { horaSlotFormatter } from '@shared/utils/dateUtils';
import './LineModals.css';

const GoalsConfigModal = ({ isOpen, onClose, onSave }) => {
  const [selectionType, setSelectionType] = useState('custom');
  const [turno, setTurno] = useState('1');
  const [hora, setHora] = useState('');
  const [nuevaMeta, setNuevaMeta] = useState('');
  const [confirmPhrase, setConfirmPhrase] = useState('');

  const hourOptions = useMemo(() => {
    return horasEsperadas(turno).map((h) => horaSlotFormatter(h));
  }, [turno]);

  useEffect(() => {
    if (hourOptions.length > 0 && !hourOptions.includes(hora)) {
      setHora(hourOptions[0]);
    }
  }, [hourOptions, hora]);

  useEffect(() => {
    setConfirmPhrase('');
  }, [isOpen, selectionType]);

  const isDefaultType = selectionType === 'defaultHour' || selectionType === 'defaultShift';

  const handleConfirm = () => {
    if (!nuevaMeta) {
      alert('Por favor ingresa un valor para la meta.');
      return;
    }

    if (isDefaultType && confirmPhrase.trim().toLowerCase() !== 'confirmar cambio') {
      alert(
        'Para modificar una meta default, debe escribir exactamente "confirmar cambio" en el campo de validación.'
      );
      return;
    }

    onSave({
      metaCustom: selectionType === 'custom',
      metaDefaultHora: selectionType === 'defaultHour',
      metaDefaultTurno: selectionType === 'defaultShift',
      turno,
      hora,
      nuevaMeta: parseInt(nuevaMeta, 10) || 0
    });
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Configuración de Metas"
      width="420px"
    >
      <div
        style={{
          textAlign: 'left',
          marginBottom: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={selectionType === 'custom'}
            onChange={() => setSelectionType('custom')}
          />
          Meta Custom (Fecha actual)
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={selectionType === 'defaultHour'}
            onChange={() => setSelectionType('defaultHour')}
          />
          Meta Default (Hora)
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={selectionType === 'defaultShift'}
            onChange={() => setSelectionType('defaultShift')}
          />
          Meta Default (Turno)
        </label>
      </div>

      <div
        className="add-loss-form"
        style={{ flexDirection: 'column', alignItems: 'stretch', textAlign: 'left' }}
      >
        <h4
          style={{
            margin: '0 0 8px 0',
            borderBottom: '1px solid #cbd5e1',
            paddingBottom: '5px',
            color: '#1e293b'
          }}
        >
          Ajustar metas
        </h4>

        <div className="form-group">
          <label>Turno:</label>
          <select value={turno} onChange={(e) => setTurno(e.target.value)}>
            <option value="1">1 (D)</option>
            <option value="2">2 (E)</option>
            <option value="3">3 (F)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Hora en formato (hh:mm - hh:mm):</label>
          <select
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            disabled={selectionType === 'defaultShift'}
          >
            {hourOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Nueva Meta:</label>
          <input
            type="number"
            placeholder="Ej: 150"
            value={nuevaMeta}
            onChange={(e) => setNuevaMeta(e.target.value)}
          />
        </div>

        {isDefaultType && (
          <div className="goals-warning-box">
            <p style={{ margin: '0 0 8px 0', lineHeight: '1.4' }}>
              <strong>⚠️ ADVERTENCIA:</strong> Estás editando una <strong>Meta Default</strong>. Este
              cambio afectará a todos los días de producción de forma permanente.
            </p>
            <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>
              Escribe <b>"confirmar cambio"</b> para habilitar:
            </label>
            <input
              type="text"
              placeholder="Escribe aquí..."
              value={confirmPhrase}
              onChange={(e) => setConfirmPhrase(e.target.value)}
              style={{ width: '100%', marginTop: '5px', borderColor: '#f59e0b' }}
            />
          </div>
        )}
      </div>

      <div className="modal-actions">
        <button type="button" className="btn-modal-cancel" onClick={onClose}>
          Cancelar
        </button>
        <button type="button" className="btn-modal-confirm" onClick={handleConfirm}>
          Aceptar
        </button>
      </div>
    </BaseModal>
  );
};

export default GoalsConfigModal;
