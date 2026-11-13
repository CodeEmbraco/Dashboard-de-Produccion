import React from 'react';
import LineSelector from '@shared/components/LineSelector/LineSelector';
import './LineControlPanel.css';

const LineControlPanel = ({
  selectedDate,
  onDateChange,
  selectedShift,
  onShiftChange,
  supervisor,
  onSupervisorChange,
  supervisors = [],
  lider,
  onLiderChange,
  leaders = [],
  currentLineId
}) => {
  return (
    <div className="panel-left">
      <section className="line-control-panel">
        <table>
          <tbody>
            <tr>
              <td>Fecha:</td>
              <td>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => onDateChange(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>Turno:</td>
              <td>
                <select
                  value={selectedShift}
                  onChange={(e) => onShiftChange(e.target.value)}
                >
                  <option value="0" disabled>
                    --Selecciona--
                  </option>
                  <option value="1">1 (D)</option>
                  <option value="2">2 (E)</option>
                  <option value="3">3 (F)</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>Supervisor:</td>
              <td>
                <select
                  value={supervisor}
                  onChange={(e) => onSupervisorChange(e.target.value)}
                >
                  <option value="0" disabled>
                    --Selecciona--
                  </option>
                  {supervisors.map((s) => {
                    const id = typeof s === 'object' ? s.id : s;
                    const name = typeof s === 'object' ? s.name : s;
                    return (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    );
                  })}
                </select>
              </td>
            </tr>
            <tr>
              <td>Team Leader:</td>
              <td>
                <select value={lider} onChange={(e) => onLiderChange(e.target.value)}>
                  <option value="0" disabled>
                    --Selecciona--
                  </option>
                  {leaders.map((l) => {
                    const id = typeof l === 'object' ? l.id : l;
                    const name = typeof l === 'object' ? l.name : l;
                    return (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    );
                  })}
                </select>
              </td>
            </tr>
            <tr>
              <td>Línea:</td>
              <td>
                <LineSelector currentLineId={currentLineId} />
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default LineControlPanel;
