import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useProduction } from '@shared/components/ProductionProvider/ProductionContext';
import { useAdmin } from '@shared/hooks/useAdmin';
import { resolveLineConfig } from '@shared/config/lineConfig';
import { LoadingScreen, StatusToast } from '@shared/ui';
import AdminAccessButton from '@shared/components/AdminGuard/AdminAccessButton';
import AdminTimer from '@shared/components/AdminGuard/AdminTimer';
import { LinePageLayout } from '@layouts';

import lineProductionService from '../services/lineProductionService';
import { useProductionData } from '../hooks/useProductionData';
import { useLocalLineConfig } from '../hooks/useLocalLineConfig';
import { useLineMetadata } from '../hooks/useLineMetadata';

import LineControlPanel from './LineControlPanel/LineControlPanel';
import ShiftGaugesWidget from './ShiftGaugesWidget/ShiftGaugesWidget';
import DailyDeltaCard from './DailyDeltaCard/DailyDeltaCard';
import ProductionTable from './HourlyTable/ProductionTable';
import LossJustificationModal from './Modals/LossJustificationModal';
import GoalsConfigModal from './Modals/GoalsConfigModal';
import UserManualModal from './Modals/UserManualModal';

import './LineProductionView.css';

const LineProductionView = ({ lineConfigKey: propLineKey }) => {
  const params = useParams();
  const rawLineKey = propLineKey || params.lineId || params.lineid || 'linea14';

  const { selectedDate, selectedShift, setSelectedDate, setSelectedShift } = useProduction();
  const lineConfig = useMemo(() => resolveLineConfig(rawLineKey), [rawLineKey]);

  const { config, setMealHour } = useLocalLineConfig(lineConfig?.id);
  const dynamicConfig = useLineMetadata(lineConfig?.id, lineConfig?.name);

  const apiConfig = useMemo(
    () => ({
      getDailyProduction: (date) =>
        lineProductionService.getDailyProduction(lineConfig.id, date),
      syncParentLoss: (date, hour, mins, idSup, idLider) =>
        lineProductionService.syncParentLoss(lineConfig.id, date, hour, mins, idSup, idLider),
      addLossDetail: (lossId, detail) =>
        lineProductionService.addLossDetail(lossId, detail),
      deleteLossDetail: (detailId) =>
        lineProductionService.deleteLossDetail(detailId),
      getShiftsStatus: (date) =>
        lineProductionService.getShiftsStatus(lineConfig.id, date),
      postShiftToggle: (date, shift, shiftStatus) =>
        lineProductionService.shiftToggleStatus(lineConfig.id, date, shift, shiftStatus)
    }),
    [lineConfig?.id]
  );

  const {
    tableItems,
    totalDia,
    metaDiaDB,
    eficienciaDia,
    totalTurno,
    metaTurnoDB,
    eficienciaTurno,
    totalDelta,
    shiftsStatus,
    loading,
    error,
    toggleShiftDB,
    isSaving,
    deleteLossRealTime,
    saveLossRealTime,
    fetchAll
  } = useProductionData(
    lineConfig?.id,
    selectedDate,
    selectedShift,
    lineConfig?.defaultMeta,
    apiConfig
  );

  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isLossModalOpen, setIsLossModalOpen] = useState(false);
  const [isGoalsModalOpen, setIsGoalsModalOpen] = useState(false);
  const { isAdmin, handleUnlock, handleExpire, adminWarning, showWarning } = useAdmin();
  const [currentLossSlot, setCurrentLossSlot] = useState(null);
  const [supervisor, setSupervisor] = useState('0');
  const [lider, setLider] = useState('0');

  const handleSaveFromModal = (totalMins, detailsArray) => {
    if (!supervisor || supervisor === '0') {
      alert('⚠️ Error: Selecciona un Supervisor en el panel superior antes de guardar.');
      return;
    }
    if (!lider || lider === '0') {
      alert('⚠️ Error: Selecciona un Team Leader en el panel superior antes de guardar.');
      return;
    }
    if (!detailsArray || detailsArray.length === 0) {
      alert('⚠️ Error: Debes agregar al menos un motivo de pérdida.');
      return;
    }

    saveLossRealTime(currentLossSlot, totalMins, detailsArray, supervisor, lider);
    setIsLossModalOpen(false);
  };

  const handleSaveGoals = async (data) => {
    try {
      if (data.metaCustom) {
        await lineProductionService.updateCustomGoal(
          lineConfig.id,
          selectedDate,
          data.turno,
          data.hora,
          data.nuevaMeta,
          'Admin'
        );
      } else if (data.metaDefaultHora) {
        await lineProductionService.updateDefaultGoalTimeSlot(
          lineConfig.id,
          data.hora,
          data.nuevaMeta
        );
      } else if (data.metaDefaultTurno) {
        await lineProductionService.updateDefaultGoalShift(
          lineConfig.id,
          data.turno,
          data.nuevaMeta
        );
      }
      alert('¡Meta actualizada con éxito!');
      fetchAll();
    } catch {
      alert('Error al intentar actualizar la meta.');
    }
  };

  if (loading && tableItems.length === 0 && !error) {
    return <LoadingScreen message="Cargando información de producción..." />;
  }

  const activeRow = tableItems.find((i) => i.hora === currentLossSlot);

  return (
    <LinePageLayout
      lineTitle={dynamicConfig.name || lineConfig?.name}
      currentLineId={lineConfig?.id}
    >
      {loading && (
        <StatusToast
          variant="loading"
          message="Sincronizando datos..."
          showSpinner={true}
        />
      )}

      {error && (
        <StatusToast
          variant="error"
          message="⚠️ Conexión inestable. Mostrando datos locales."
        />
      )}

      {adminWarning && (
        <StatusToast variant="warning" message={`⚠️ ${adminWarning}`} />
      )}

      {isSaving && (
        <StatusToast
          variant="saving"
          message="Guardando información..."
          showSpinner={true}
        />
      )}

      {isAdmin && <AdminTimer onExpire={handleExpire} />}

      <div className="top-panel-container">
        <LineControlPanel
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          selectedShift={selectedShift}
          onShiftChange={setSelectedShift}
          supervisor={supervisor}
          onSupervisorChange={setSupervisor}
          supervisors={dynamicConfig.supervisors}
          lider={lider}
          onLiderChange={setLider}
          leaders={dynamicConfig.leaders}
          currentLineId={lineConfig.id}
        />

        <ShiftGaugesWidget
          percent={eficienciaTurno}
          goal={metaTurnoDB}
          real={totalTurno}
        />

        <div className="delta-and-manual-col">
          <DailyDeltaCard
            total={totalDia}
            accGoal={metaDiaDB}
            totalTurno={totalDelta}
            eficiencia={eficienciaDia}
            activeShifts={shiftsStatus}
            onToggleShift={toggleShiftDB}
            isAdmin={isAdmin}
            onAccessDenied={showWarning}
          />
          <button
            type="button"
            onClick={() => setIsManualOpen(true)}
            className="btn-manual"
          >
            Manual de Uso
          </button>
        </div>
      </div>

      <ProductionTable
        items={tableItems}
        onOpenModal={(slot) => {
          setCurrentLossSlot(slot);
          setIsLossModalOpen(true);
        }}
        caption="INFORMACIÓN DE PRODUCCIÓN"
        localConfig={config}
        onSetMeal={setMealHour}
      />

      <div className="div-btn-guardar">
        <AdminAccessButton isAdmin={isAdmin} onUnlock={handleUnlock} />
        <button
          type="button"
          className="btn-cambiar-meta"
          onClick={() =>
            isAdmin
              ? setIsGoalsModalOpen(true)
              : showWarning('Acceso Restringido: Desbloquee con el escudo.')
          }
          style={{ opacity: isAdmin ? 1 : 0.6 }}
        >
          Ajustar Meta
        </button>
      </div>

      <UserManualModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
      />

      <LossJustificationModal
        isOpen={isLossModalOpen}
        onClose={() => setIsLossModalOpen(false)}
        onSave={handleSaveFromModal}
        onDeleteDetail={deleteLossRealTime}
        currentSlot={currentLossSlot}
        initialData={activeRow?.detalles || []}
        perdidaCalculada={activeRow?.perdidaCalculada || 0}
        supervisor={supervisor}
        lider={lider}
      />

      <GoalsConfigModal
        isOpen={isGoalsModalOpen}
        onClose={() => setIsGoalsModalOpen(false)}
        onSave={handleSaveGoals}
      />
    </LinePageLayout>
  );
};

export const TablaGenericRouter = () => {
  const { lineId, lineid } = useParams();
  return <LineProductionView lineConfigKey={lineId || lineid} />;
};

export default LineProductionView;
