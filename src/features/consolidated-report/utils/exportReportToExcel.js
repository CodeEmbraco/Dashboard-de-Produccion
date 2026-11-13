import * as XLSX from 'xlsx';

export const exportReportToExcel = ({
  filteredData,
  totals,
  selectedShift,
  selectedDate,
  selectedSupervisor
}) => {
  const excelRows = filteredData.map((row) => ({
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

  excelRows.push({
    'Turno': selectedShift,
    'Fecha': selectedDate,
    'Supervisor': selectedSupervisor === 'Varios' ? 'VARIOS' : selectedSupervisor,
    'Línea de Producción': 'TOTAL',
    'Plan': totals.totalPlan,
    'Real': totals.totalReal,
    '% Cumplimiento': `${totals.totalPct}%`,
    'Delta': totals.totalDelta,
    'UPH': totals.avgUph,
    'Line Stop (min)': totals.totalLineStop,
    'Pérdida Proceso (min)': totals.totalProceso,
    'Pérdida Línea (min)': totals.totalLinea,
    'Pérdida Materiales (min)': totals.totalMat,
    'Pérdida Calidad (min)': totals.totalCalidad
  });

  const worksheet = XLSX.utils.json_to_sheet(excelRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte_Consolidado');

  XLSX.writeFile(
    workbook,
    `Reporte_Produccion_${selectedDate}_${selectedShift.split(' ')[0]}.xlsx`
  );
};
