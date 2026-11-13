import React from 'react';

const ReportTable = ({ filteredData, totals }) => {
  return (
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
              <td className={row.delta < 0 ? 'text-red' : 'text-green'}>
                {row.delta > 0 ? `+${row.delta}` : row.delta}
              </td>
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
            <td>{totals.totalPlan}</td>
            <td>{totals.totalReal}</td>
            <td>
              <div className="pct-progress-cell">
                <span>{totals.totalPct}%</span>
                <div className="mini-bar-bg">
                  <div
                    className="mini-bar-fill bg-green"
                    style={{ width: `${Math.min(totals.totalPct, 100)}%` }}
                  ></div>
                </div>
              </div>
            </td>
            <td className="text-red">{totals.totalDelta}</td>
            <td>{totals.avgUph}</td>
            <td>{totals.totalLineStop}</td>
            <td>{totals.totalProceso}</td>
            <td>{totals.totalLinea}</td>
            <td>{totals.totalMat}</td>
            <td>{totals.totalCalidad}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ReportTable;
