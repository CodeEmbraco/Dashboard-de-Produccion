import React, { useState, useMemo } from 'react';
import { defaultReportData } from '../constants/mockReportData';
import { exportReportToExcel } from '../utils/exportReportToExcel';
import ReportFiltersBar from './ReportFiltersBar';
import ReportTable from './ReportTable';
import './ConsolidatedReport.css';

const ConsolidatedReportView = () => {
  const [selectedShift, setSelectedShift] = useState('T1 - 07:00 a 15:30');
  const [selectedDate, setSelectedDate] = useState('2026-09-04');
  const [selectedSupervisor, setSelectedSupervisor] = useState('Varios');
  const [selectedLines, setSelectedLines] = useState(() =>
    defaultReportData.map((item) => item.name)
  );

  const lineOptions = useMemo(
    () =>
      defaultReportData.map((line) => ({
        id: line.id,
        value: line.name,
        label: line.name
      })),
    []
  );

  const toggleLineSelect = (lineName) => {
    setSelectedLines((prev) =>
      prev.includes(lineName)
        ? prev.filter((item) => item !== lineName)
        : [...prev, lineName]
    );
  };

  const filteredData = useMemo(
    () =>
      defaultReportData.filter((item) => {
        const matchesLine = selectedLines.includes(item.name);
        const matchesSupervisor =
          selectedSupervisor === 'Varios' || item.supervisor === selectedSupervisor;
        return matchesLine && matchesSupervisor;
      }),
    [selectedLines, selectedSupervisor]
  );

  const totals = useMemo(() => {
    const totalPlan = filteredData.reduce((acc, curr) => acc + curr.plan, 0);
    const totalReal = filteredData.reduce((acc, curr) => acc + curr.real, 0);
    const totalPct = totalPlan ? ((totalReal / totalPlan) * 100).toFixed(1) : 0;
    const totalDelta = totalReal - totalPlan;
    const avgUph = (
      filteredData.reduce((acc, curr) => acc + curr.uph, 0) /
      (filteredData.length || 1)
    ).toFixed(1);
    const totalLineStop = filteredData.reduce((acc, curr) => acc + curr.lineStop, 0);
    const totalProceso = filteredData.reduce((acc, curr) => acc + curr.proceso, 0);
    const totalLinea = filteredData.reduce((acc, curr) => acc + curr.linea, 0);
    const totalMat = filteredData.reduce((acc, curr) => acc + curr.materiales, 0);
    const totalCalidad = filteredData.reduce((acc, curr) => acc + curr.calidad, 0);

    return {
      totalPlan,
      totalReal,
      totalPct,
      totalDelta,
      avgUph,
      totalLineStop,
      totalProceso,
      totalLinea,
      totalMat,
      totalCalidad
    };
  }, [filteredData]);

  const handleExportExcel = () => {
    exportReportToExcel({
      filteredData,
      totals,
      selectedShift,
      selectedDate,
      selectedSupervisor
    });
  };

  return (
    <div className="report-card-container">
      <div className="report-header-top">
        <h2 className="report-title">REPORTE DEL DÍA</h2>

        <button className="export-excel-btn" onClick={handleExportExcel}>
          <span className="excel-icon">📊</span>
          Exportar a Excel
        </button>
      </div>

      <ReportFiltersBar
        selectedShift={selectedShift}
        onShiftChange={setSelectedShift}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        selectedSupervisor={selectedSupervisor}
        onSupervisorChange={setSelectedSupervisor}
        lineOptions={lineOptions}
        selectedLines={selectedLines}
        onToggleLineSelect={toggleLineSelect}
      />

      <ReportTable filteredData={filteredData} totals={totals} />

      <div className="report-footer-note">
        ● Los tiempos están expresados en minutos. UPH: Unidades por hora.
      </div>
    </div>
  );
};

export default ConsolidatedReportView;
