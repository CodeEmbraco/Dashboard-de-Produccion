import React from 'react';
import ProductionRow from './ProductionRow';
import './HourlyTable.css';

const ProductionTable = ({
  items = [],
  onOpenModal,
  caption = 'INFORMACIÓN DE PRODUCCIÓN',
  localConfig = {},
  onSetMeal
}) => {
  return (
    <section className="contenedor-tabla-horaria">
      <table className="tabla-produccion-horaria">
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            <th>Hora</th>
            <th>Plan</th>
            <th>Real</th>
            <th>Modelo</th>
            <th>
              Pérdidas <br /> No Justificadas
            </th>
            <th>
              Pérdidas <br /> Justificadas
            </th>
            <th>Observaciones</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((row) => (
              <ProductionRow
                key={row.hora}
                row={row}
                onOpenModal={onOpenModal}
                isMealHour={localConfig?.mealHour === row.hora}
                onSetMeal={onSetMeal}
              />
            ))
          ) : (
            <tr>
              <td colSpan="8" className="empty-table-msg">
                No hay datos disponibles para la selección actual.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};

export default ProductionTable;
