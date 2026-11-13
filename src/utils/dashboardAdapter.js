import { linesCatalog } from '@config/lineConfig';
import placeholderImg from '../assets/placeholder.png';

/**
 * Busca la imagen correspondiente en el catálogo de líneas basándose en lineId o nombre.
 */
export const getLineImage = (lineId, nombre) => {
  if (!lineId && !nombre) return placeholderImg;

  const rawId = String(lineId || '').toLowerCase().trim();
  const rawName = String(nombre || '').toLowerCase().trim();

  // Soporte para catálogo dividido por entidades (Embraco y Reynosa) o plano
  const embracoCatalog = linesCatalog?.Embraco || {};
  const reynosaCatalog = linesCatalog?.Reynosa || {};
  const flatCatalog = { ...embracoCatalog, ...reynosaCatalog, ...(linesCatalog || {}) };

  // 1. Coincidencia directa por clave en catálogo plano (ej. "cdu", "ecmfan", "electronics", "thermo", "line1")
  if (flatCatalog[rawId]?.imgURL) return flatCatalog[rawId].imgURL;

  // 2. Coincidencia normalizada sin caracteres especiales (ej. "line_1" -> "line1", "pre-ensamble" -> "preensamble")
  const cleanId = rawId.replace(/[^a-z0-9]/g, '');
  if (flatCatalog[cleanId]?.imgURL) return flatCatalog[cleanId].imgURL;

  // Normalización con prefijo "line" si viene como "lineaX" (ej. "linea14" -> "line14")
  const normalizedLineId = cleanId.replace(/^linea/, 'line');
  if (flatCatalog[normalizedLineId]?.imgURL) return flatCatalog[normalizedLineId].imgURL;

  // 3. Coincidencia por id del catálogo
  const byCatalogId = Object.values(flatCatalog).find(item => String(item?.id).toLowerCase() === rawId);
  if (byCatalogId?.imgURL) return byCatalogId.imgURL;

  // 4. Coincidencias específicas por nombre o palabras clave para Embraco
  if (rawName.includes('cdu') && rawName.includes('tfs')) return embracoCatalog.thermo?.imgURL || flatCatalog.thermo?.imgURL;
  if (rawName.includes('cdu')) return embracoCatalog.cdu?.imgURL || flatCatalog.cdu?.imgURL;
  if (rawName.includes('ecm') || rawName.includes('fan')) return embracoCatalog.ecmfan?.imgURL || flatCatalog.ecmfan?.imgURL;
  if (rawName.includes('electronics')) return embracoCatalog.electronics?.imgURL || flatCatalog.electronics?.imgURL;
  if (rawName.includes('insinkerator')) return embracoCatalog.insinkerator1?.imgURL || flatCatalog.insinkerator1?.imgURL;
  if (rawName.includes('preensamble') || rawName.includes('pre-ensamble')) return embracoCatalog.preensamble?.imgURL || flatCatalog.preensamble?.imgURL;
  if (rawName.includes('thermo')) return embracoCatalog.thermo?.imgURL || flatCatalog.thermo?.imgURL;

  // 5. Prefijo con "line" si solo se envían dígitos (ej. "1" -> "line1")
  const idDigits = rawId.replace(/\D/g, '');
  if (idDigits && flatCatalog[`line${idDigits}`]?.imgURL) {
    return flatCatalog[`line${idDigits}`].imgURL;
  }

  // 6. Extracción de dígitos desde el Nombre (ej. "Línea 4" -> "4" -> flatCatalog["line4"])
  const nameDigits = rawName.replace(/\D/g, '');
  if (nameDigits && flatCatalog[`line${nameDigits}`]?.imgURL) {
    return flatCatalog[`line${nameDigits}`].imgURL;
  }

  return placeholderImg;
};

/**
 * Línea por defecto para evitar errores de renderizado cuando los datos están cargando o vacíos.
 */
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

/**
 * Transforma un elemento individual recibido de la API al formato que consume Dashboard.jsx
 */
export const adaptLineData = (item, index = 0) => {
  if (!item) return defaultLine;

  const lineId = item.LineId ?? item.lineId ?? item.id ?? String(index + 1);
  const title = item.Nombre ?? item.nombre ?? item.title ?? `Línea ${lineId}`;

  // Objeto totalDia (compatible con item.produccion.totalDia o item.totalDia)
  const totalDiaObj = item.produccion?.totalDia ?? item.totalDia ?? {};

  // Producción total del día
  const total = Number(totalDiaObj.produccion ?? item.total ?? 0);

  // Metas del día:
  // metaTotal = meta planeada completa del día (ej. 5760)
  const metaTotal = Number(
    totalDiaObj.metaTotal ??
    totalDiaObj.meta ??
    item.metaTotal ??
    item.meta ??
    0
  );

  // metaEfectiva = meta esperada acumulada a la hora actual (ej. 240)
  const metaEfectiva = Number(
    totalDiaObj.metaEfectiva ??
    totalDiaObj.metaAcumulada ??
    item.metaEfectiva ??
    item.metaAcumulada ??
    0
  );

  // metaAcumulada es el alias consumido por el Dashboard para el cálculo acumulado
  const metaAcumulada = metaEfectiva;

  // Meta del día para visualización (prioriza metaTotal)
  const meta = metaTotal > 0 ? metaTotal : (metaAcumulada > 0 ? metaAcumulada : Number(item.meta ?? 0));

  // Delta: si viene explícito en item, usarlo; de lo contrario, si hay meta acumulada/efectiva mayor a 0,
  // calcular la diferencia respecto al avance actual del día; si no, contra la meta total
  const delta =
    item.delta !== undefined && item.delta !== null
      ? Number(item.delta)
      : (metaAcumulada > 0 ? (total - metaAcumulada) : (total - meta));

  // Turnos (soporte flexible para códigos D, E, F y T1, T2, T3)
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

  // Pérdidas por turno (equivalente a downtime)
  const t1PJ = Number(t1.perdidaJustificada ?? 0);
  const t1PNJ = Number(t1.perdidaNoJustificada ?? 0);
  const t1Downtime = t1PJ + t1PNJ;

  const t2PJ = Number(t2.perdidaJustificada ?? 0);
  const t2PNJ = Number(t2.perdidaNoJustificada ?? 0);
  const t2Downtime = t2PJ + t2PNJ;

  const t3PJ = Number(t3.perdidaJustificada ?? 0);
  const t3PNJ = Number(t3.perdidaNoJustificada ?? 0);
  const t3Downtime = t3PJ + t3PNJ;

  const t1Eficiencia = t1.eficiencia !== undefined
    ? Number(t1.eficiencia)
    : (t1Meta > 0 ? Number(((t1Prod / t1Meta) * 100).toFixed(2)) : 0);
  const t2Eficiencia = t2.eficiencia !== undefined
    ? Number(t2.eficiencia)
    : (t2Meta > 0 ? Number(((t2Prod / t2Meta) * 100).toFixed(2)) : 0);
  const t3Eficiencia = t3.eficiencia !== undefined
    ? Number(t3.eficiencia)
    : (t3Meta > 0 ? Number(((t3Prod / t3Meta) * 100).toFixed(2)) : 0);

  // Pérdidas del día (equivalente a downtime)
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

  // Estructura de downtime
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

  // Eficiencia del día
  const eficiencia =
    totalDiaObj.eficiencia !== undefined
      ? Number(totalDiaObj.eficiencia)
      : (metaAcumulada > 0
          ? Number(((total / metaAcumulada) * 100).toFixed(2))
          : (meta > 0 ? Number(((total / meta) * 100).toFixed(2)) : 0));

  // Imagen del motor/línea
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
      tt: t1Prod, // Compatibilidad con el JSX existente que usa values.tt para Turno 1
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

/**
 * Transforma el arreglo de datos del Dashboard recibido de la API
 */
export const adaptDashboardData = (dashboardData) => {
  if (!Array.isArray(dashboardData) || dashboardData.length === 0) {
    return [];
  }
  return dashboardData.map((item, index) => adaptLineData(item, index));
};
