import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Utensils, Shield } from 'lucide-react';
import { BaseModal } from '@shared/ui';
import './LineModals.css';

const MANUAL_STEPS = [
  {
    title: 'Overview de la Tabla de Productividad',
    content: (
      <p>
        La tabla de productividad muestra el desglose hora por hora de la producción de la línea de
        Reynosa seleccionada, integrando indicadores de cumplimiento en tiempo real y captura de
        pérdidas.
      </p>
    )
  },
  {
    title: 'Panel de Selectores',
    content: (
      <>
        <p>
          • <strong>Fecha y Turno</strong>: Seleccione la fecha y el turno (1, 2 o 3) a consultar.
        </p>
        <p>
          • <strong>Supervisor y Team Leader</strong>: Debe seleccionar ambos responsables antes de
          guardar cualquier justificación de pérdidas.
        </p>
        <p>
          • <strong>Línea</strong>: Permite cambiar rápidamente entre las líneas de producción de
          Reynosa.
        </p>
      </>
    )
  },
  {
    title: 'Indicadores de Turno y Delta del Día',
    content: (
      <>
        <p>
          • <strong>META y REAL</strong>: Medidores del avance del turno seleccionado provistos
          directamente por el backend.
        </p>
        <p>
          • <strong>TOTAL DÍA (Delta)</strong>: Muestra la diferencia acumulada del día y el
          desglose por turnos T1, T2 y T3.
        </p>
      </>
    )
  },
  {
    title: 'Tabla Hora por Hora y Hora de Comida',
    content: (
      <>
        <p>
          Muestra para cada hora del turno el <strong>Plan</strong>, <strong>Real</strong>,{' '}
          <strong>Modelo</strong> y el anillo de estado de pérdidas.
        </p>
        <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          • Haga clic sobre una celda de <strong>Hora</strong> para marcar o desmarcar la hora de
          comida <Utensils size={18} color="#22c55e" />.
        </p>
        <p>
          • Haga clic en el botón <strong>⚙️</strong> en la columna de Acciones para justificar
          minutos de paro.
        </p>
      </>
    )
  },
  {
    title: 'Permisos de Administrador y Ajuste de Metas',
    content: (
      <>
        <p>
          Haga clic en el escudo <Shield size={18} color="#008040" /> en la parte inferior izquierda
          e ingrese sus credenciales para habilitar por 120 segundos:
        </p>
        <p>• Activación / desactivación de turnos en la tarjeta de Delta.</p>
        <p>• Configuración de Metas Custom o Default mediante el botón Ajustar Meta.</p>
      </>
    )
  }
];

const UserManualModal = ({ isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const step = MANUAL_STEPS[currentIndex];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={step.title}
      width="680px"
      showCloseIcon={true}
      closeOnOverlayClick={true}
    >
      <span className="manual-step-badge">
        Página {currentIndex + 1} de {MANUAL_STEPS.length}
      </span>

      <div className="manual-carousel-grid">
        <button
          type="button"
          className="manual-nav-arrow"
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
        >
          <ChevronLeft size={40} />
        </button>

        <div className="manual-step-card">{step.content}</div>

        <button
          type="button"
          className="manual-nav-arrow"
          onClick={() =>
            setCurrentIndex((prev) => Math.min(MANUAL_STEPS.length - 1, prev + 1))
          }
          disabled={currentIndex === MANUAL_STEPS.length - 1}
        >
          <ChevronRight size={40} />
        </button>
      </div>

      <div className="manual-dots">
        {MANUAL_STEPS.map((_, idx) => (
          <span
            key={idx}
            className={`manual-dot ${idx === currentIndex ? 'active' : ''}`}
          />
        ))}
      </div>
    </BaseModal>
  );
};

export default UserManualModal;
