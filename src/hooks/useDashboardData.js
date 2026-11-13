import { useState, useEffect, useCallback } from 'react';
import { getFormattedDate } from '@utils/dateUtils';

export const useDashboardData = (fecha, focusedLineId, apiFunctions) => {
    const [dashboardData, setDashboardData] = useState([]);
    const [hourlyData, setHourlyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // 1. Obtiene la producción general de todas las líneas (al montar, cambiar fecha o polling cada 30s)
    const fetchProduction = useCallback(async (isPoll = false) => {
        if (!isPoll) setLoading(true);

        try {
            const data = await apiFunctions.getDashboardProduction(fecha);
            setDashboardData(data || []);
            setError(null);
        } catch (err) {
            console.error("Error al obtener la producción para el Dashboard: ", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [fecha, apiFunctions]);

    // 2. Obtiene la producción por hora de la línea en foco (cada vez que cambia focusedLineId o fecha)
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

    // Polling de producción general (cada 30s si es la fecha de hoy)
    useEffect(() => {
        const isToday = fecha === getFormattedDate();
        fetchProduction();
        if (isToday) {
            const interval = setInterval(() => fetchProduction(true), 30000);
            return () => clearInterval(interval);
        }
    }, [fetchProduction, fecha]);

    // Actualiza la gráfica horaria al cambiar la línea en foco o la fecha
    useEffect(() => {
        if (focusedLineId) {
            fetchHourlyChart(focusedLineId);
        }
    }, [focusedLineId, fetchHourlyChart]);

    // Acción para conmutar estado de turno
    const toggleShiftDB = useCallback(async (lineId, turnoId, estadoActual) => {
        setIsSaving(true);
        try {
            const nuevoEstado = !estadoActual;
            await apiFunctions.postShiftToggle(fecha, turnoId, nuevoEstado, lineId);
            await fetchProduction(true);
        } catch (err) {
            console.error(`Error al cambiar el estado del turno para la línea ${lineId},`, err);
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
