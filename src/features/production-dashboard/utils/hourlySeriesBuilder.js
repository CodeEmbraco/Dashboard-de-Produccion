/**
 * Genera la serie de 24 horas (07:00 a 07:00 +1 día) a partir de los datos
 * recibidos de la API (con estructura Hora_Slot, Turno, ProduccionTotal, Orden)
 * o calculada desde los totales reales de los turnos de la línea.
 */
export const generateHourlySeries = (lineData, externalData) => {
  const source = externalData || lineData?.hourlyProduction;

  if (Array.isArray(source) && source.length > 0) {
    const sorted = [...source].sort((a, b) => Number(a.Orden ?? 0) - Number(b.Orden ?? 0));

    return sorted.map((item, idx) => {
      if (typeof item === 'number') {
        const hourNum = (7 + idx) % 24;
        const label = `${String(hourNum).padStart(2, '0')}:00`;
        const slot = `${label} - ${String((hourNum + 1) % 24).padStart(2, '0')}:00`;
        const value = Math.max(0, item);
        return {
          id: idx + 1,
          orden: idx + 1,
          hour: idx,
          label,
          slot,
          turno: '',
          value,
          tooltip: `${slot}: ${Math.round(value)} pzas`
        };
      }

      const rawSlot = item.Hora_Slot || item.hora_slot || item.horaSlot || '';
      const startHour = rawSlot
        ? rawSlot.split('-')[0].trim()
        : `${String((7 + idx) % 24).padStart(2, '0')}:00`;

      const val = Number(
        item.ProduccionTotal ??
        item.produccionTotal ??
        item.value ??
        item.valor ??
        item.produccion ??
        0
      );

      const orden = Number(item.Orden ?? idx + 1);
      const turno = item.Turno ?? item.turno ?? '';
      const slot = rawSlot || `${startHour} - ...`;
      const value = Math.max(0, val);

      return {
        id: `${orden}-${idx}`,
        orden,
        hour: idx,
        label: startHour,
        slot,
        turno,
        value,
        tooltip: `${slot}${turno ? ` (Turno ${turno})` : ''}: ${Math.round(value)} pzas`
      };
    });
  }

  const t1 = Number(lineData?.values?.tt ?? lineData?.values?.t1 ?? lineData?.turnos?.T1?.produccion ?? 0);
  const t2 = Number(lineData?.values?.t2 ?? lineData?.turnos?.T2?.produccion ?? 0);
  const t3 = Number(lineData?.values?.t3 ?? lineData?.turnos?.T3?.produccion ?? 0);

  const weights8 = [0.85, 1.1, 1.15, 1.05, 0.95, 1.1, 1.0, 0.8];

  const series = [];
  for (let idx = 0; idx < 24; idx++) {
    const startH = (7 + idx) % 24;
    const endH = (startH + 1) % 24;
    const startStr = `${String(startH).padStart(2, '0')}:00`;
    const endStr = `${String(endH).padStart(2, '0')}:00`;
    const slot = `${startStr} - ${endStr}`;

    let turno = 'D';
    let val = 0;

    if (idx < 8) {
      turno = 'D';
      val = t1 > 0 ? (t1 / 8) * weights8[idx] : 0;
    } else if (idx < 16) {
      turno = 'E';
      val = t2 > 0 ? (t2 / 8) * weights8[idx - 8] : 0;
    } else {
      turno = 'F';
      val = t3 > 0 ? (t3 / 8) * weights8[idx - 16] : 0;
    }

    const roundedVal = Math.round(val * 10) / 10;

    series.push({
      id: idx + 1,
      orden: idx + 1,
      hour: idx,
      label: startStr,
      slot,
      turno,
      value: roundedVal,
      tooltip: `${slot} (Turno ${turno}): ${Math.round(roundedVal)} pzas`
    });
  }

  return series;
};

/**
 * Calcula las 5 etiquetas equidistantes del eje X para el ciclo de 24 horas (07:00 a 07:00).
 */
export const getHourlyXAxisLabels = (series) => {
  if (!series || series.length === 0) {
    return ['07:00', '13:00', '19:00', '01:00', '07:00'];
  }

  const total = series.length;
  if (total === 1) return [series[0].label];

  const idx0 = 0;
  const idx1 = Math.round((total - 1) * 0.25);
  const idx2 = Math.round((total - 1) * 0.5);
  const idx3 = Math.round((total - 1) * 0.75);

  const lbl0 = series[idx0]?.label || '07:00';
  const lbl1 = series[idx1]?.label || '13:00';
  const lbl2 = series[idx2]?.label || '19:00';
  const lbl3 = series[idx3]?.label || '01:00';

  const lastPt = series[total - 1];
  const lastSlotParts = lastPt?.slot ? lastPt.slot.split('-') : [];
  const lblEnd = lastSlotParts.length > 1 ? lastSlotParts[1].trim() : '07:00';

  return [lbl0, lbl1, lbl2, lbl3, lblEnd];
};
