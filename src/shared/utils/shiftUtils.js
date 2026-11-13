import {
  getFormattedDate,
  getCurrentShift,
  generateHourSlots,
  getMetaPorHoraIndividual
} from '@shared/utils/dateUtils';

const SHIFT_ORDER = ['1', '2', '3'];

const SHIFT_START_TIMES = {
  '1': 6,
  '2': 14,
  '3': 23
};

export const getShiftStartHour = (shiftId) => {
  return SHIFT_START_TIMES[shiftId] || 6;
};

export const getFullShiftMeta = (config) => {
  const { metaPorHora } = config;
  const shiftId = config.selectedShift || config.shiftId;
  if (!shiftId) return 0;

  return generateHourSlots(shiftId).reduce((acc, slot) => {
    const start = parseInt(slot.split(':')[0], 10);
    return acc + getMetaPorHoraIndividual(start, shiftId, metaPorHora);
  }, 0);
};

export const calculateShiftMeta = (config) => {
  const {
    selectedDate,
    currentClientMinute,
    currentClientHour,
    metaPorHora
  } = config;

  const shiftId = config.shiftId || config.selectedShift;

  if (!shiftId) return 0;
  if (selectedDate < getFormattedDate()) return getFullShiftMeta({ selectedShift: shiftId, metaPorHora });
  if (selectedDate > getFormattedDate()) return 0;

  const currentShift = getCurrentShift();
  const currentIndex = SHIFT_ORDER.indexOf(currentShift);
  const targetIndex = SHIFT_ORDER.indexOf(shiftId);

  if (targetIndex < currentIndex) return getFullShiftMeta({ selectedShift: shiftId, metaPorHora });
  if (targetIndex > currentIndex) return 0;

  const slots = generateHourSlots(shiftId);
  let metaAcum = 0;

  for (const slot of slots) {
    const startHour = parseInt(slot.split(':')[0], 10);
    const hourlyMeta = getMetaPorHoraIndividual(startHour, shiftId, metaPorHora);

    if (startHour === currentClientHour) {
      const quarter = hourlyMeta / 4;
      if (currentClientMinute >= 45) metaAcum += hourlyMeta;
      else if (currentClientMinute >= 30) metaAcum += quarter * 2;
      else if (currentClientMinute >= 15) metaAcum += quarter;
      break;
    } else {
      metaAcum += hourlyMeta;
    }
  }
  return metaAcum;
};

export const calcularMetaDiaAcumulada = (config, shiftFilter = null) => {
  const { selectedDate, metaPorHora, currentClientHour, currentClientMinute } = config;
  const today = getFormattedDate();

  if (selectedDate > today) return 0;

  const currentShift = getCurrentShift();
  const currentShiftIdx = SHIFT_ORDER.indexOf(currentShift);
  let totalAcc = 0;

  for (let i = 0; i < SHIFT_ORDER.length; i++) {
    const shiftId = SHIFT_ORDER[i];

    let isShiftActive = true;
    if (shiftFilter) {
      if (Array.isArray(shiftFilter)) {
        if (shiftFilter.length === 0) {
          isShiftActive = true;
        } else if (typeof shiftFilter[0] === 'object') {
          const found = shiftFilter.find((s) => String(s?.Turno ?? s?.id ?? '') === String(shiftId));
          isShiftActive = found ? Boolean(found.Activo) : true;
        } else {
          isShiftActive = shiftFilter.map(String).includes(String(shiftId));
        }
      } else if (shiftFilter.activeShifts && Array.isArray(shiftFilter.activeShifts)) {
        isShiftActive = shiftFilter.activeShifts.map(String).includes(String(shiftId));
      }
    }

    if (!isShiftActive) continue;

    if (selectedDate === today) {
      const targetIndex = SHIFT_ORDER.indexOf(shiftId);
      if (targetIndex < currentShiftIdx) {
        totalAcc += getFullShiftMeta({ selectedShift: shiftId, metaPorHora });
      } else if (targetIndex === currentShiftIdx) {
        totalAcc += calculateShiftMeta({
          shiftId,
          selectedDate,
          currentClientMinute,
          currentClientHour,
          metaPorHora
        });
        break;
      }
    } else {
      totalAcc += getFullShiftMeta({ selectedShift: shiftId, metaPorHora });
    }
  }
  return totalAcc;
};

export const calcularMetaProgresiva = (horasData, metaTurnoDB) => {
  if (!horasData || horasData.length === 0) return 0;

  const ahora = new Date();
  const horaActual = ahora.getHours();
  const minutosActuales = ahora.getMinutes();

  let metaAcumulada = 0;

  for (let i = 0; i < horasData.length; i++) {
    const fila = horasData[i];
    const metaDeEstaHora = Number(fila.MetaEfectiva) || 0;
    const horaInt = Number(fila.Hora);

    if (horaInt === horaActual) {
      const cuartosPasados = Math.floor(minutosActuales / 15);
      metaAcumulada += metaDeEstaHora * (cuartosPasados / 4);
      break;
    } else {
      metaAcumulada += metaDeEstaHora;
    }
  }

  metaAcumulada = Math.round(metaAcumulada);
  return metaTurnoDB > 0 && metaAcumulada > metaTurnoDB ? metaTurnoDB : metaAcumulada;
};

export const horasEsperadas = (turno) => {
  if (turno === '1') return [6, 7, 8, 9, 10, 11, 12, 13];
  if (turno === '2') return [14, 15, 16, 17, 18, 19, 20, 21, 22];
  if (turno === '3') return [23, 0, 1, 2, 3, 4, 5];
  return [];
};

export const esHoraTerminada = (fecha, horaFija, turno) => {
  if (!fecha) return true;

  const [year, month, day] = fecha.split('-');
  const rowEnd = new Date(year, month - 1, day);
  if (String(turno) === '3' && horaFija < 6) {
    rowEnd.setDate(rowEnd.getDate() + 1);
  }

  rowEnd.setHours(horaFija + 1, 0, 0, 0);

  const now = new Date();
  return now >= rowEnd;
};
