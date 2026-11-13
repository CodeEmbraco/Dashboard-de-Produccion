import { linesCatalog, resolveLineConfig } from '@shared/config/lineConfig';
import placeholderImg from '@assets/placeholder.png';

/**
 * Busca la imagen correspondiente en el catálogo de líneas de Reynosa basándose en lineId o nombre.
 */
export const getLineImage = (lineId, nombre) => {
  if (!lineId && !nombre) return placeholderImg;

  const resolved = resolveLineConfig(lineId || nombre);
  if (resolved?.imgURL) return resolved.imgURL;

  const reynosaCatalog = linesCatalog?.Reynosa || {};
  const rawId = String(lineId || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  const normalizedLineId = rawId.replace(/^linea/, 'line');

  if (reynosaCatalog[normalizedLineId]?.imgURL) {
    return reynosaCatalog[normalizedLineId].imgURL;
  }

  return placeholderImg;
};

export const defaultLine = {
  id: '0',
  title: 'Sin datos',
  iconImg: placeholderImg,
  image: placeholderImg,
  total: 0,
  meta: 0,
  metaTotal: 0,
  metaAcumulada: 0,
  metaEfectiva: 0,
  delta: 0,
  eficiencia: 0,
  perdidaJustificada: 0,
  perdidaNoJustificada: 0,
  values: { t1: 0, tt: 0, t2: 0, t3: 0, d: 0, e: 0, f: 0 },
  turnos: {
    T1: { produccion: 0, meta: 0, metaEfectiva: 0, metaAcumulada: 0, eficiencia: 0, perdidaJustificada: 0, perdidaNoJustificada: 0, downtime: 0 },
    T2: { produccion: 0, meta: 0, metaEfectiva: 0, metaAcumulada: 0, eficiencia: 0, perdidaJustificada: 0, perdidaNoJustificada: 0, downtime: 0 },
    T3: { produccion: 0, meta: 0, metaEfectiva: 0, metaAcumulada: 0, eficiencia: 0, perdidaJustificada: 0, perdidaNoJustificada: 0, downtime: 0 }
  },
  downtime: {
    totalMin: 0,
    perdidaJustificada: 0,
    perdidaNoJustificada: 0,
    t1: 0,
    t2: 0,
    t3: 0,
    turnos: {},
    pending: false
  },
  hourlyProduction: null
};

export const adaptLineData = (item, index = 0) => {
  if (!item) return defaultLine;

  const lineId = item.LineId ?? item.lineId ?? item.id ?? String(index + 1);
  const title = item.Nombre ?? item.nombre ?? item.title ?? `Línea ${lineId}`;
  const totalDiaObj = item.produccion?.totalDia ?? item.totalDia ?? {};
  const total = Number(totalDiaObj.produccion ?? item.total ?? 0);

  const metaTotal = Number(
    totalDiaObj.metaTotal ??
    totalDiaObj.meta ??
    item.metaTotal ??
    item.meta ??
    0
  );

  const metaEfectiva = Number(
    totalDiaObj.metaEfectiva ??
    totalDiaObj.metaAcumulada ??
    item.metaEfectiva ??
    item.metaAcumulada ??
    0
  );

  const metaAcumulada = metaEfectiva;
  const meta = metaTotal > 0 ? metaTotal : metaAcumulada > 0 ? metaAcumulada : Number(item.meta ?? 0);

  const delta =
    item.delta !== undefined && item.delta !== null
      ? Number(item.delta)
      : metaAcumulada > 0
        ? total - metaAcumulada
        : total - meta;

  const turnosObj = item.produccion?.turnos ?? item.turnos ?? {};
  const t1 = turnosObj.T1 ?? turnosObj.t1 ?? turnosObj.D ?? turnosObj.d ?? turnosObj['1'] ?? {};
  const t2 = turnosObj.T2 ?? turnosObj.t2 ?? turnosObj.E ?? turnosObj.e ?? turnosObj['2'] ?? {};
  const t3 = turnosObj.T3 ?? turnosObj.t3 ?? turnosObj.F ?? turnosObj.f ?? turnosObj['3'] ?? {};

  const t1Prod = Number(t1.produccion ?? item.values?.tt ?? item.values?.t1 ?? 0);
  const t2Prod = Number(t2.produccion ?? item.values?.t2 ?? 0);
  const t3Prod = Number(t3.produccion ?? item.values?.t3 ?? 0);

  const t1Meta = Number(t1.metaTotal ?? t1.meta ?? 0);
  const t2Meta = Number(t2.metaTotal ?? t2.meta ?? 0);
  const t3Meta = Number(t3.metaTotal ?? t3.meta ?? 0);

  const t1MetaEfectiva = Number(t1.metaEfectiva ?? t1.metaAcumulada ?? 0);
  const t2MetaEfectiva = Number(t2.metaEfectiva ?? t2.metaAcumulada ?? 0);
  const t3MetaEfectiva = Number(t3.metaEfectiva ?? t3.metaAcumulada ?? 0);

  const t1PJ = Number(t1.perdidaJustificada ?? 0);
  const t1PNJ = Number(t1.perdidaNoJustificada ?? 0);
  const t1Downtime = t1PJ + t1PNJ;

  const t2PJ = Number(t2.perdidaJustificada ?? 0);
  const t2PNJ = Number(t2.perdidaNoJustificada ?? 0);
  const t2Downtime = t2PJ + t2PNJ;

  const t3PJ = Number(t3.perdidaJustificada ?? 0);
  const t3PNJ = Number(t3.perdidaNoJustificada ?? 0);
  const t3Downtime = t3PJ + t3PNJ;

  const t1Eficiencia =
    t1.eficiencia !== undefined
      ? Number(t1.eficiencia)
      : t1Meta > 0
        ? Number(((t1Prod / t1Meta) * 100).toFixed(2))
        : 0;
  const t2Eficiencia =
    t2.eficiencia !== undefined
      ? Number(t2.eficiencia)
      : t2Meta > 0
        ? Number(((t2Prod / t2Meta) * 100).toFixed(2))
        : 0;
  const t3Eficiencia =
    t3.eficiencia !== undefined
      ? Number(t3.eficiencia)
      : t3Meta > 0
        ? Number(((t3Prod / t3Meta) * 100).toFixed(2))
        : 0;

  const perdidaJustificada = Number(totalDiaObj.perdidaJustificada ?? 0);
  const perdidaNoJustificada = Number(totalDiaObj.perdidaNoJustificada ?? 0);
  const totalPerdidasDia = perdidaJustificada + perdidaNoJustificada;

  const hasPerdidasData =
    totalDiaObj.perdidaJustificada !== undefined ||
    totalDiaObj.perdidaNoJustificada !== undefined ||
    t1.perdidaJustificada !== undefined ||
    t1.perdidaNoJustificada !== undefined;

  const totalMinDowntime = hasPerdidasData
    ? totalPerdidasDia
    : Number(item.downtime?.totalMin ?? 0);

  const downtime = {
    totalMin: totalMinDowntime,
    perdidaJustificada,
    perdidaNoJustificada,
    t1: hasPerdidasData ? t1Downtime : Number(item.downtime?.t1 ?? 0),
    t2: hasPerdidasData ? t2Downtime : Number(item.downtime?.t2 ?? 0),
    t3: hasPerdidasData ? t3Downtime : Number(item.downtime?.t3 ?? 0),
    turnos: {
      T1: { total: t1Downtime, justificada: t1PJ, noJustificada: t1PNJ },
      T2: { total: t2Downtime, justificada: t2PJ, noJustificada: t2PNJ },
      T3: { total: t3Downtime, justificada: t3PJ, noJustificada: t3PNJ },
      D: { total: t1Downtime, justificada: t1PJ, noJustificada: t1PNJ },
      E: { total: t2Downtime, justificada: t2PJ, noJustificada: t2PNJ },
      F: { total: t3Downtime, justificada: t3PJ, noJustificada: t3PNJ }
    },
    pending: hasPerdidasData ? false : Boolean(item.downtime?.pending)
  };

  const eficiencia =
    totalDiaObj.eficiencia !== undefined
      ? Number(totalDiaObj.eficiencia)
      : metaAcumulada > 0
        ? Number(((total / metaAcumulada) * 100).toFixed(2))
        : meta > 0
          ? Number(((total / meta) * 100).toFixed(2))
          : 0;

  const img = item.image ?? item.iconImg ?? getLineImage(lineId, title);

  const turno1Data = {
    nombre: 'Turno 1',
    code: 'D',
    produccion: t1Prod,
    meta: t1Meta,
    metaEfectiva: t1MetaEfectiva,
    metaAcumulada: t1MetaEfectiva,
    perdidaJustificada: t1PJ,
    perdidaNoJustificada: t1PNJ,
    downtime: t1Downtime,
    eficiencia: t1Eficiencia
  };

  const turno2Data = {
    nombre: 'Turno 2',
    code: 'E',
    produccion: t2Prod,
    meta: t2Meta,
    metaEfectiva: t2MetaEfectiva,
    metaAcumulada: t2MetaEfectiva,
    perdidaJustificada: t2PJ,
    perdidaNoJustificada: t2PNJ,
    downtime: t2Downtime,
    eficiencia: t2Eficiencia
  };

  const turno3Data = {
    nombre: 'Turno 3',
    code: 'F',
    produccion: t3Prod,
    meta: t3Meta,
    metaEfectiva: t3MetaEfectiva,
    metaAcumulada: t3MetaEfectiva,
    perdidaJustificada: t3PJ,
    perdidaNoJustificada: t3PNJ,
    downtime: t3Downtime,
    eficiencia: t3Eficiencia
  };

  return {
    id: String(lineId),
    lineId: String(lineId),
    title,
    iconImg: img,
    image: img,
    total,
    meta,
    metaTotal,
    metaAcumulada,
    metaEfectiva,
    delta,
    eficiencia,
    perdidaJustificada,
    perdidaNoJustificada,
    values: {
      t1: t1Prod,
      tt: t1Prod,
      t2: t2Prod,
      t3: t3Prod,
      d: t1Prod,
      e: t2Prod,
      f: t3Prod
    },
    turnos: {
      T1: turno1Data,
      T2: turno2Data,
      T3: turno3Data,
      D: turno1Data,
      E: turno2Data,
      F: turno3Data
    },
    downtime,
    produccion: item.produccion ?? {
      totalDia: totalDiaObj,
      turnos: turnosObj
    },
    hourlyProduction: item.hourlyProduction ?? item.produccionPorHora ?? item.horas ?? null,
    raw: item
  };
};

export const adaptDashboardData = (dashboardData) => {
  if (!Array.isArray(dashboardData) || dashboardData.length === 0) {
    return [];
  }
  return dashboardData.map((item, index) => adaptLineData(item, index));
};
