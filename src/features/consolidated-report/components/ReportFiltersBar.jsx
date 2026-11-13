import React from 'react';
import { MultiSelectDropdown } from '@shared/ui';

const ReportFiltersBar = ({
  selectedShift,
  onShiftChange,
  selectedDate,
  onDateChange,
  selectedSupervisor,
  onSupervisorChange,
  lineOptions,
  selectedLines,
  onToggleLineSelect
}) => {
  return (
    <div className="report-filters-bar">
      <div className="filter-group">
        <label>Turno</label>
        <select
          className="filter-select"
          value={selectedShift}
          onChange={(e) => onShiftChange(e.target.value)}
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
          onChange={(e) => onDateChange(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>Supervisor</label>
        <select
          className="filter-select"
          value={selectedSupervisor}
          onChange={(e) => onSupervisorChange(e.target.value)}
        >
          <option value="Varios">Varios</option>
          <option value="Juan Pérez">Juan Pérez</option>
          <option value="Carlos Gómez">Carlos Gómez</option>
          <option value="María Rodríguez">María Rodríguez</option>
        </select>
      </div>

      <MultiSelectDropdown
        label="Línea de producción"
        options={lineOptions}
        selectedValues={selectedLines}
        onToggleOption={onToggleLineSelect}
        allSelectedLabel="Todas las líneas"
      />
    </div>
  );
};

export default ReportFiltersBar;
