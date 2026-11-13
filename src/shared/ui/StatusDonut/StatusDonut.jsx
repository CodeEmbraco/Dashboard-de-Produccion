import React from 'react';
import './StatusDonut.css';

const StatusDonut = ({ justificada = 0, noJustificada = 0, finalizada = true }) => {
  const just = Math.min(Number(justificada) || 0, 60);
  const noJust = Math.min(Number(noJustificada) || 0, 60);
  const total = just + noJust;

  const porcNoJustificada = (noJust / 60) * 100;
  const porcJustificada = (just / 60) * 100;

  const colorNoJustificada = '#ef5350';
  const colorJustificada = '#42a5f5';
  const colorFondo = '#e0e0e0';
  const colorExito = '#008040';

  const gradient = `conic-gradient(
    ${colorNoJustificada} 0% ${porcNoJustificada}%,
    ${colorJustificada} ${porcNoJustificada}% ${porcNoJustificada + porcJustificada}%,
    ${colorFondo} ${porcNoJustificada + porcJustificada}% 100%
  )`;

  let centerText = '-';
  let textColor = '#9e9e9e';

  if (!finalizada) {
    centerText = '-';
    textColor = '#9e9e9e';
  } else if (noJust > 0) {
    centerText = noJust;
    textColor = colorNoJustificada;
  } else if (just > 0 && noJust === 0) {
    centerText = '✓';
    textColor = colorJustificada;
  } else if (total === 0) {
    centerText = '✓';
    textColor = colorExito;
  }

  return (
    <div
      className="ui-status-donut-outer"
      style={{ backgroundImage: gradient }}
      title={`Justificada: ${just}m | No Justificada: ${noJust}m`}
    >
      <div className="ui-status-donut-inner" style={{ color: textColor }}>
        {centerText}
      </div>
    </div>
  );
};

export default StatusDonut;
