import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import './ConsolidatedReport.css';

// Agregamos el supervisor correspondiente a cada línea
const reportData = [
  { id: 1, name: 'Linea 1', supervisor: 'Juan Pérez', plan: 563, real: 298, pct: 52.9, delta: -265, uph: 15.6, lineStop: 45, proceso: 25, linea: 5, materiales: 5, calidad: 5 },
  { id: 2, name: 'Linea 2', supervisor: 'Carlos Gómez', plan: 45, real: 31, pct: 68.9, delta: -14, uph: 12.4, lineStop: 20, proceso: 10, linea: 3, materiales: 5, calidad: 2 },
  { id: 3, name: 'Linea 4', supervisor: 'María Rodríguez', plan: 1500, real: 1250, pct: 83.3, delta: -250, uph: 52.1, lineStop: 30, proceso: 15, linea: 3, materiales: 8, calidad: 4 },
  { id: 4, name: 'Linea 7', supervisor: 'Juan Pérez', plan: 3675, real: 3625, pct: 98.6, delta: -50, uph: 78.3, lineStop: 35, proceso: 12, linea: 10, materiales: 10, calidad: 3 },
  { id: 5, name: 'Linea 14', supervisor: 'Carlos Gómez', plan: 600, real: 644, pct: 107.3, delta: 44, uph: 28.7, lineStop: 18, proceso: 6, linea: 6, materiales: 3, calidad: 3 },
  { id: 6, name: 'Linea 16', supervisor: 'María Rodríguez', plan: 2230, real: 31, pct: 1.4, delta: -2199, uph: 1.6, lineStop: 60, proceso: 30, linea: 10, materiales: 12, calidad: 8 },
  { id: 7, name: 'Linea 30', supervisor: 'Juan Pérez', plan: 0, real: 0, pct: 0.0, delta: 0, uph: 0.0, lineStop: 0, proceso: 0, linea: 0, materiales: 0, calidad: 0 }
];

const ConsolidatedReport = () => {
  const [selectedShift, setSelectedShift] = useState('T1 - 07:00 a 15:30');
  const [selectedDate, setSelectedDate] = useState('2026-09-04');
  const [selectedSupervisor, setSelectedSupervisor] = useState('Varios');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // CORREGIDO: Inicializar con los nombres exactos de reportData
  const [selectedLines, setSelectedLines] = useState(
    reportData.map(item => item.name)
  );

  const toggleLineSelect = (lineName) => {
    if (selectedLines.includes(lineName)) {
      setSelectedLines(selectedLines.filter(item => item !== lineName));
    } else {
      setSelectedLines([...selectedLines, lineName]);
    }
  };

  // FILTRADO DE DATOS (Por Línea y por Supervisor)
  const filteredData = reportData.filter(item => {
    const matchesLine = selectedLines.includes(item.name);
    const matchesSupervisor = selectedSupervisor === 'Varios' || item.supervisor === selectedSupervisor;
    return matchesLine && matchesSupervisor;
  });

  // CÁLCULOS DE TOTALES
  const totalPlan = filteredData.reduce((acc, curr) => acc + curr.plan, 0);
  const totalReal = filteredData.reduce((acc, curr) => acc + curr.real, 0);
  const totalPct = totalPlan ? ((totalReal / totalPlan) * 100).toFixed(1) : 0;
  const totalDelta = totalReal - totalPlan;
  const avgUph = (filteredData.reduce((acc, curr) => acc + curr.uph, 0) / (filteredData.length || 1)).toFixed(1);
  const totalLineStop = filteredData.reduce((acc, curr) => acc + curr.lineStop, 0);
  const totalProceso = filteredData.reduce((acc, curr) => acc + curr.proceso, 0);
  const totalLinea = filteredData.reduce((acc, curr) => acc + curr.linea, 0);
  const totalMat = filteredData.reduce((acc, curr) => acc + curr.materiales, 0);
  const totalCalidad = filteredData.reduce((acc, curr) => acc + curr.calidad, 0);

  // EXPORTAR A EXCEL CON SUPERVISORES DINÁMICOS
  const exportToExcel = () => {
    const excelRows = filteredData.map(row => ({
      'Turno': selectedShift,
      'Fecha': selectedDate,
      'Supervisor': selectedSupervisor === 'Varios' ? row.supervisor : selectedSupervisor,
      'Línea de Producción': row.name,
      'Plan': row.plan,
      'Real': row.real,
      '% Cumplimiento': `${row.pct}%`,
      'Delta': row.delta,
      'UPH': row.uph,
      'Line Stop (min)': row.lineStop,
      'Pérdida Proceso (min)': row.proceso,
      'Pérdida Línea (min)': row.linea,
      'Pérdida Materiales (min)': row.materiales,
      'Pérdida Calidad (min)': row.calidad
    }));

    // Fila de totales
    excelRows.push({
      'Turno': selectedShift,
      'Fecha': selectedDate,
      'Supervisor': selectedSupervisor === 'Varios' ? 'VARIOS' : selectedSupervisor,
      'Línea de Producción': 'TOTAL',
      'Plan': totalPlan,
      'Real': totalReal,
      '% Cumplimiento': `${totalPct}%`,
      'Delta': totalDelta,
      'UPH': avgUph,
      'Line Stop (min)': totalLineStop,
      'Pérdida Proceso (min)': totalProceso,
      'Pérdida Línea (min)': totalLinea,
      'Pérdida Materiales (min)': totalMat,
      'Pérdida Calidad (min)': totalCalidad
    });

    const worksheet = XLSX.utils.json_to_sheet(excelRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte_Consolidado');

    XLSX.writeFile(workbook, `Reporte_Produccion_${selectedDate}_${selectedShift.split(' ')[0]}.xlsx`);
  };

  return (
    <div className="report-card-container">
      {/* CABECERA */}
      <div className="report-header-top">
        <h2 className="report-title">REPORTE DEL DÍA</h2>
        
        <button className="export-excel-btn" onClick={exportToExcel}>
          <span className="excel-icon">📊</span>
          Exportar a Excel
        </button>
      </div>

      {/* FILTROS */}
      <div className="report-filters-bar">
        <div className="filter-group">
          <label>Turno</label>
          <select 
            className="filter-select" 
            value={selectedShift} 
            onChange={(e) => setSelectedShift(e.target.value)}
          >
            <option value="T1 - 07:00 a 15:30">T1 - 07:00 a 15:30</option>
            <option value="T2 - 15:30 a 23:30">T2 - 15:30 a 23:30</option>
            <option value="T3 - 23:30 a 07:00">T3 - 23:30 a 07:00</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Fecha</label>
          <input 
            type="date" 
            className="filter-input-date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Supervisor</label>
          <select 
            className="filter-select" 
            value={selectedSupervisor} 
            onChange={(e) => setSelectedSupervisor(e.target.value)}
          >
            <option value="Varios">Varios</option>
            <option value="Juan Pérez">Juan Pérez</option>
            <option value="Carlos Gómez">Carlos Gómez</option>
            <option value="María Rodríguez">María Rodríguez</option>
          </select>
        </div>

        <div className="filter-group relative-group">
          <label>Línea de producción</label>
          <div 
            className="filter-select custom-multiselect-header"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>{selectedLines.length === reportData.length ? 'Todas las líneas' : `${selectedLines.length} seleccionadas`}</span>
            <span className="arrow-down">▼</span>
          </div>

          {isDropdownOpen && (
            <div className="multiselect-dropdown">
              {reportData.map((line) => (
                <label key={line.id} className="multiselect-item">
                  <input 
                    type="checkbox" 
                    checked={selectedLines.includes(line.name)} 
                    onChange={() => toggleLineSelect(line.name)}
                  />
                  <span>{line.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* TABLA DE REPORTE */}
      <div className="report-table-wrapper">
        <table className="report-table">
          <thead>
            <tr className="main-header-row">
              <th rowSpan="2" className="col-name">Nombre de la línea de producción</th>
              <th rowSpan="2">Plan</th>
              <th rowSpan="2">Real</th>
              <th rowSpan="2">% Cumplimiento</th>
              <th rowSpan="2">Delta</th>
              <th rowSpan="2">UPH</th>
              <th rowSpan="2">Line Stop (min)</th>
              <th colSpan="4" className="col-group-header">PÉRDIDAS (min)</th>
            </tr>
            <tr className="sub-header-row">
              <th>Proceso</th>
              <th>Línea</th>
              <th>Materiales</th>
              <th>Calidad</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr key={row.id}>
                <td className="col-name-cell">
                  <span className="line-text-name">{row.name}</span>
                </td>
                <td className="bold-num">{row.plan}</td>
                <td className="bold-num">{row.real}</td>
                <td>
                  <div className="pct-progress-cell">
                    <span>{row.pct}%</span>
                    <div className="mini-bar-bg">
                      <div 
                        className="mini-bar-fill bg-green" 
                        style={{ width: `${Math.min(row.pct, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className={row.delta < 0 ? 'text-red' : 'text-green'}>{row.delta > 0 ? `+${row.delta}` : row.delta}</td>
                <td>{row.uph}</td>
                <td>{row.lineStop}</td>
                <td>{row.proceso}</td>
                <td>{row.linea}</td>
                <td>{row.materiales}</td>
                <td>{row.calidad}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="total-row">
              <td className="col-name-cell">TOTAL</td>
              <td>{totalPlan}</td>
              <td>{totalReal}</td>
              <td>
                <div className="pct-progress-cell">
                  <span>{totalPct}%</span>
                  <div className="mini-bar-bg">
                    <div className="mini-bar-fill bg-green" style={{ width: `${Math.min(totalPct, 100)}%` }}></div>
                  </div>
                </div>
              </td>
              <td className="text-red">{totalDelta}</td>
              <td>{avgUph}</td>
              <td>{totalLineStop}</td>
              <td>{totalProceso}</td>
              <td>{totalLinea}</td>
              <td>{totalMat}</td>
              <td>{totalCalidad}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="report-footer-note">
        ● Los tiempos están expresados en minutos. UPH: Unidades por hora.
      </div>
    </div>
  );
};

export default ConsolidatedReport;