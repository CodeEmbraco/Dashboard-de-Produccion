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
  delta: 0,
  eficiencia: 0,
  values: { t1: 0, tt: 0, t2: 0, t3: 0 },
  turnos: {
    T1: { produccion: 0, meta: 0, eficiencia: 0 },
    T2: { produccion: 0, meta: 0, eficiencia: 0 },
    T3: { produccion: 0, meta: 0, eficiencia: 0 }
  },
  downtime: { totalMin: 0, t1: 0, t2: 0, t3: 0, pending: true }
};

/**
 * Transforma un elemento individual recibido de la API al formato que consume Dashboard.jsx
 */
export const adaptLineData = (item, index = 0) => {
  if (!item) return defaultLine;

  const lineId = item.LineId ?? item.lineId ?? item.id ?? String(index + 1);
  const title = item.Nombre ?? item.nombre ?? item.title ?? `Línea ${lineId}`;

  // Producción total del día
  const total =
    item.totalDia?.produccion ??
    item.produccion?.totalDia?.produccion ??
    item.total ??
    0;

  // Metas del día
  const metaTotal =
    item.totalDia?.metaTotal ??
    item.produccion?.totalDia?.metaTotal ??
    item.totalDia?.meta ??
    item.produccion?.totalDia?.meta ??
    item.meta ??
    0;

  const metaAcumulada =
    item.totalDia?.metaAcumulada ??
    item.produccion?.totalDia?.metaAcumulada ??
    0;

  // Meta del día (prioriza metaTotal)
  const meta = metaTotal > 0 ? metaTotal : (metaAcumulada > 0 ? metaAcumulada : (item.meta ?? 0));

  // Delta: si viene explícito en item, usarlo; de lo contrario, si hay meta acumulada mayor a 0,
  // calcular la diferencia respecto al avance actual del día; si no, contra la meta total
  const delta =
    item.delta !== undefined && item.delta !== null
      ? item.delta
      : (metaAcumulada > 0 ? (total - metaAcumulada) : (total - meta));

  // Turnos (T1, T2, T3)
  const turnosObj = item.turnos ?? item.produccion?.turnos ?? {};
  const t1 = turnosObj.T1 ?? turnosObj.t1 ?? {};
  const t2 = turnosObj.T2 ?? turnosObj.t2 ?? {};
  const t3 = turnosObj.T3 ?? turnosObj.t3 ?? {};

  const t1Prod = t1.produccion ?? item.values?.tt ?? item.values?.t1 ?? 0;
  const t2Prod = t2.produccion ?? item.values?.t2 ?? 0;
  const t3Prod = t3.produccion ?? item.values?.t3 ?? 0;

  const t1Meta = t1.meta ?? 0;
  const t2Meta = t2.meta ?? 0;
  const t3Meta = t3.meta ?? 0;

  const t1Eficiencia = t1.eficiencia ?? (t1Meta > 0 ? Number(((t1Prod / t1Meta) * 100).toFixed(2)) : 0);
  const t2Eficiencia = t2.eficiencia ?? (t2Meta > 0 ? Number(((t2Prod / t2Meta) * 100).toFixed(2)) : 0);
  const t3Eficiencia = t3.eficiencia ?? (t3Meta > 0 ? Number(((t3Prod / t3Meta) * 100).toFixed(2)) : 0);

  // Imagen del motor/línea
  const img = item.image ?? item.iconImg ?? getLineImage(lineId, title);

  // Downtime (tiempo muerto): pendiente de este endpoint
  const downtime = item.downtime ?? {
    totalMin: 0,
    t1: 0,
    t2: 0,
    t3: 0,
    pending: true
  };

  // Eficiencia del día
  const eficiencia =
    item.totalDia?.eficiencia ??
    item.produccion?.totalDia?.eficiencia ??
    (meta > 0 ? Number(((total / meta) * 100).toFixed(2)) : 0);

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
    delta,
    eficiencia,
    values: {
      t1: t1Prod,
      tt: t1Prod, // Compatibilidad con el JSX existente que usa values.tt para Turno 1
      t2: t2Prod,
      t3: t3Prod
    },
    turnos: {
      T1: {
        produccion: t1Prod,
        meta: t1Meta,
        eficiencia: t1Eficiencia
      },
      T2: {
        produccion: t2Prod,
        meta: t2Meta,
        eficiencia: t2Eficiencia
      },
      T3: {
        produccion: t3Prod,
        meta: t3Meta,
        eficiencia: t3Eficiencia
      }
    },
    downtime,
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
