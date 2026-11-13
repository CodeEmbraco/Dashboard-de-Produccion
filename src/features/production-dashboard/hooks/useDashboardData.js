import { useState, useEffect, useCallback } from 'react';
import { getFormattedDate } from '@shared/utils/dateUtils';
import dashboardService from '../services/dashboardService';

export const useDashboardData = (fecha, focusedLineId, apiFunctions = dashboardService) => {
  const [dashboardData, setDashboardData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchProduction = useCallback(async (isPoll = false) => {
    if (!isPoll) setLoading(true);

    try {
      const data = await apiFunctions.getDashboardProduction(fecha);
      setDashboardData(data || []);
      setError(null);
    } catch (err) {
      console.error('Error al obtener la producción para el Dashboard: ', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [fecha, apiFunctions]);

  const fetchHourlyChart = useCallback(async (lineId) => {
    if (!lineId) return;

    try {
      const hourly = await apiFunctions.getDashboardHourlyChart(lineId, fecha);
      setHourlyData(hourly || []);
    } catch (err) {
      console.error(`Error al obtener la gráfica horaria para la línea ${lineId}: `, err);
      setHourlyData([]);
    }
  }, [fecha, apiFunctions]);

  useEffect(() => {
    const isToday = fecha === getFormattedDate();
    fetchProduction();
    if (isToday) {
      const interval = setInterval(() => fetchProduction(true), 30000);
      return () => clearInterval(interval);
    }
  }, [fetchProduction, fecha]);

  useEffect(() => {
    if (focusedLineId) {
      fetchHourlyChart(focusedLineId);
    }
  }, [focusedLineId, fetchHourlyChart]);

  const toggleShiftDB = useCallback(async (lineId, turnoId, estadoActual) => {
    setIsSaving(true);
    try {
      const nuevoEstado = !estadoActual;
      const toggleFn = apiFunctions.postShiftToggle || apiFunctions.shiftToggleStatus;
      if (toggleFn) {
        await toggleFn(fecha, turnoId, nuevoEstado, lineId);
      }
      await fetchProduction(true);
    } catch (err) {
      console.error(`Error al cambiar el estado del turno para la línea ${lineId}:`, err);
    } finally {
      setIsSaving(false);
    }
  }, [apiFunctions, fecha, fetchProduction]);

  const fetchAll = useCallback(async (isPoll = false) => {
    await Promise.all([
      fetchProduction(isPoll),
      focusedLineId ? fetchHourlyChart(focusedLineId) : Promise.resolve()
    ]);
  }, [fetchProduction, fetchHourlyChart, focusedLineId]);

  return {
    dashboardData,
    hourlyData,
    loading,
    error,
    isSaving,
    toggleShiftDB,
    fetchAll
  };
};
