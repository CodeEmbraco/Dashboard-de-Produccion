import { useState, useEffect, useCallback } from 'react';
import { getFormattedDate } from '@shared/utils/dateUtils';
import { construirEsqueletoTabla } from '../utils/tableBuilder';

export const useProductionData = (linea, fecha, turno, metaPorHora, apiFunctions) => {
  const [data, setData] = useState({
    tableItems: [],
    totalDia: 0,
    metaDiaDB: 0,
    eficienciaDia: 0,
    totalDelta: [],
    shiftsStatus: [],
    totalTurno: 0,
    metaTurnoDB: 0,
    eficienciaTurno: 0,
    loading: true,
    error: null
  });
  const [isSaving, setIsSaving] = useState(false);

  const syncOfflineQueue = useCallback(async () => {
    const queueKey = `offline_queue_${linea}`;
    const queue = JSON.parse(localStorage.getItem(queueKey)) || [];
    if (queue.length === 0) return;

    setIsSaving(true);
    try {
      for (const item of queue) {
        const padre = await apiFunctions.syncParentLoss(
          item.fecha,
          item.hora,
          item.minutosCalculados,
          item.idSupervisor,
          item.idLider
        );
        for (const detalle of item.detallesNuevos) {
          await apiFunctions.addLossDetail(padre.data.IdPerdida, detalle);
        }
      }
      localStorage.removeItem(queueKey);
    } catch {
      console.warn('La red sigue inestable, se reintentará en el próximo ciclo');
    } finally {
      setIsSaving(false);
    }
  }, [linea, apiFunctions]);

  const fetchAll = useCallback(async (isPoll = false) => {
    if (!isPoll) setData((prev) => ({ ...prev, loading: true }));
    if (!turno || turno === '0') return;

    try {
      const [megaData, shiftsStatus] = await Promise.all([
        apiFunctions.getDailyProduction(fecha),
        apiFunctions.getShiftsStatus(fecha)
      ]);

      const { totalDia = {}, turnos = {}, porHora = [] } = megaData?.produccion || {};

      // Soporte directo para llaves T1/T2/T3 o D/E/F enviadas por el backend
      const shiftMap = {
        '1': turnos.T1 || turnos.D,
        '2': turnos.T2 || turnos.E,
        '3': turnos.T3 || turnos.F
      };
      const currentShiftData = shiftMap[String(turno)] || {
        produccion: 0,
        meta: 0,
        metaEfectiva: 0,
        eficiencia: 0
      };

      const t1Data = turnos.T1 || turnos.D || { produccion: 0, meta: 0 };
      const t2Data = turnos.T2 || turnos.E || { produccion: 0, meta: 0 };
      const t3Data = turnos.T3 || turnos.F || { produccion: 0, meta: 0 };

      const tableItems = construirEsqueletoTabla(fecha, turno, porHora);

      const totalDelta = [
        { turno: 1, contador: t1Data.produccion, MetaEfectivaTurno: t1Data.metaEfectiva ?? t1Data.meta },
        { turno: 2, contador: t2Data.produccion, MetaEfectivaTurno: t2Data.metaEfectiva ?? t2Data.meta },
        { turno: 3, contador: t3Data.produccion, MetaEfectivaTurno: t3Data.metaEfectiva ?? t3Data.meta }
      ];

      setData((prev) => ({
        ...prev,
        tableItems,
        totalDia: totalDia.produccion ?? 0,
        metaDiaDB: totalDia.metaEfectiva ?? totalDia.meta ?? 0,
        eficienciaDia: totalDia.eficiencia ?? 0,
        totalTurno: currentShiftData.produccion ?? 0,
        metaTurnoDB: currentShiftData.metaEfectiva ?? currentShiftData.meta ?? 0,
        eficienciaTurno: currentShiftData.eficiencia ?? 0,
        totalDelta,
        shiftsStatus: shiftsStatus || [],
        loading: false,
        error: null
      }));

      await syncOfflineQueue();
    } catch (error) {
      console.error('Error fetching data:', error);
      setData((prev) => ({ ...prev, error, loading: false }));
    }
  }, [fecha, turno, apiFunctions, syncOfflineQueue]);

  const saveLossRealTime = async (hora, minutosCalculados, detallesNuevos, idSupervisor, idLider) => {
    setIsSaving(true);
    try {
      const padre = await apiFunctions.syncParentLoss(
        fecha,
        hora,
        minutosCalculados,
        idSupervisor,
        idLider
      );
      for (const detalle of detallesNuevos) {
        await apiFunctions.addLossDetail(padre.data.IdPerdida, detalle);
      }
      await fetchAll(true);
    } catch {
      console.warn('Fallo de red detectado, guardando localmente');

      const queueKey = `offline_queue_${linea}`;
      const queue = JSON.parse(localStorage.getItem(queueKey)) || [];
      queue.push({ hora, minutosCalculados, detallesNuevos, fecha, turno, idSupervisor, idLider });
      localStorage.setItem(queueKey, JSON.stringify(queue));
    } finally {
      setIsSaving(false);
    }
  };

  const deleteLossRealTime = async (idDetalle) => {
    setIsSaving(true);
    try {
      await apiFunctions.deleteLossDetail(idDetalle);
      await fetchAll(true);
    } catch (error) {
      console.error('Error al borrar detalle', error);
      alert('Sin conexión! No se pudo borrar el registro');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleShiftDB = useCallback(
    async (turnoId, estadoActual) => {
      try {
        const nuevoEstado = !estadoActual;
        await apiFunctions.postShiftToggle(fecha, turnoId, nuevoEstado);
        fetchAll(true);
      } catch (err) {
        console.error('Error al cambiar el estado del turno en el Hook:', err);
      }
    },
    [apiFunctions, fecha, fetchAll]
  );

  useEffect(() => {
    const isToday = fecha === getFormattedDate();
    fetchAll();
    if (isToday && turno !== '0') {
      const interval = setInterval(() => fetchAll(true), 30000);
      return () => clearInterval(interval);
    }
  }, [fetchAll, fecha, turno]);

  return {
    ...data,
    isSaving,
    toggleShiftDB,
    fetchAll,
    saveLossRealTime,
    deleteLossRealTime
  };
};
