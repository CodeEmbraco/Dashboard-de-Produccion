import React, { useMemo } from 'react';

/**
 * Calcula una escala agradable para el eje Y basada en el valor máximo.
 * Retorna niceMax y los 5 pasos correspondientes a las líneas de la cuadrícula.
 */
const getNiceYAxisSteps = (maxVal) => {
    let niceMax = 100;

    if (maxVal && maxVal > 0) {
        const raw = maxVal * 1.15; // Margen superior del 15% para que los picos no toquen el borde superior
        if (raw <= 20) niceMax = 20;
        else if (raw <= 40) niceMax = 40;
        else if (raw <= 80) niceMax = 80;
        else if (raw <= 100) niceMax = 100;
        else if (raw <= 150) niceMax = 150;
        else if (raw <= 200) niceMax = 200;
        else if (raw <= 300) niceMax = 300;
        else if (raw <= 400) niceMax = 400;
        else if (raw <= 600) niceMax = 600;
        else if (raw <= 800) niceMax = 800;
        else if (raw <= 1200) niceMax = 1200;
        else if (raw <= 1600) niceMax = 1600;
        else if (raw <= 2000) niceMax = 2000;
        else niceMax = Math.ceil(raw / 400) * 400;
    }

    const step = niceMax / 4;
    return {
        niceMax,
        steps: [
            Math.round(niceMax),
            Math.round(niceMax - step),
            Math.round(niceMax - (step * 2)),
            Math.round(niceMax - (step * 3)),
            0
        ]
    };
};

/**
 * Genera la serie de 24 horas (07:00 a 07:00 +1 día) a partir de los datos
 * recibidos de la API (con estructura Hora_Slot, Turno, ProduccionTotal, Orden)
 * o calculada desde los totales reales de los turnos de la línea.
 */
const generateHourlySeries = (lineData, externalData) => {
    const source = externalData || lineData?.hourlyProduction;

    // 1. Si vienen datos explícitos del endpoint hora por hora
    if (Array.isArray(source) && source.length > 0) {
        // Ordenar por el campo 'Orden' si viene presente
        const sorted = [...source].sort((a, b) => Number(a.Orden ?? 0) - Number(b.Orden ?? 0));

        return sorted.map((item, idx) => {
            if (typeof item === 'number') {
                const hourNum = (7 + idx) % 24;
                const label = `${String(hourNum).padStart(2, '0')}:00`;
                return {
                    orden: idx + 1,
                    hour: idx,
                    label,
                    slot: `${label} - ${String((hourNum + 1) % 24).padStart(2, '0')}:00`,
                    turno: '',
                    value: Math.max(0, item)
                };
            }

            // Estructura esperada de la API:
            // Turno, Hora_Slot ("07:00 - 08:00"), DuracionMinutos, Orden, ProduccionTotal
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

            return {
                orden: Number(item.Orden ?? (idx + 1)),
                hour: idx,
                label: startHour,
                slot: rawSlot || `${startHour} - ...`,
                turno: item.Turno ?? item.turno ?? '',
                value: Math.max(0, val)
            };
        });
    }

    // 2. Si aún no hay datos de la API, generamos el ciclo operativo de 24 horas (07:00 a 07:00 +1 día)
    // basado en la producción real de los turnos de la línea:
    // Turno D: 07:00 - 15:00 (8 horas, índices 0 a 7)
    // Turno E: 15:00 - 23:00 (8 horas, índices 8 a 15)
    // Turno F: 23:00 - 07:00 (8 horas, índices 16 a 23)
    const t1 = Number(lineData?.values?.tt ?? lineData?.values?.t1 ?? lineData?.turnos?.T1?.produccion ?? 0);
    const t2 = Number(lineData?.values?.t2 ?? lineData?.turnos?.T2?.produccion ?? 0);
    const t3 = Number(lineData?.values?.t3 ?? lineData?.turnos?.T3?.produccion ?? 0);

    const weights8 = [0.85, 1.1, 1.15, 1.05, 0.95, 1.1, 1.0, 0.8]; // suma: 8.0

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
            // Turno D (07:00 a 15:00)
            turno = 'D';
            val = t1 > 0 ? (t1 / 8) * weights8[idx] : 0;
        } else if (idx < 16) {
            // Turno E (15:00 a 23:00)
            turno = 'E';
            val = t2 > 0 ? (t2 / 8) * weights8[idx - 8] : 0;
        } else {
            // Turno F (23:00 a 07:00)
            turno = 'F';
            val = t3 > 0 ? (t3 / 8) * weights8[idx - 16] : 0;
        }

        series.push({
            orden: idx + 1,
            hour: idx,
            label: startStr,
            slot,
            turno,
            value: Math.round(val * 10) / 10
        });
    }

    return series;
};

const Chart = ({ lineData = null, data = null }) => {
    // Generar la serie horaria y calcular la escala en base a los datos
    const { points, niceMax, ySteps } = useMemo(() => {
        const series = generateHourlySeries(lineData, data);
        const maxVal = Math.max(...series.map((item) => item.value), 0);
        const { niceMax, steps } = getNiceYAxisSteps(maxVal);

        const svgWidth = 300;
        const baseY = 110; // Corresponde al valor 0
        const usableHeight = 100; // De y=10 (máximo) a y=110 (cero)
        const totalPoints = series.length;

        const mappedPoints = series.map((pt, index) => {
            const x = totalPoints > 1 ? (index / (totalPoints - 1)) * svgWidth : svgWidth / 2;
            const ratio = niceMax > 0 ? pt.value / niceMax : 0;
            const y = baseY - Math.min(usableHeight, Math.max(0, ratio * usableHeight));

            return {
                ...pt,
                x: Number(x.toFixed(1)),
                y: Number(y.toFixed(1))
            };
        });

        return {
            points: mappedPoints,
            niceMax,
            ySteps: steps
        };
    }, [lineData, data]);

    // Cadena de coordenadas para la línea (polyline)
    const polylinePoints = useMemo(() => {
        if (!points || points.length === 0) return '0,110 300,110';
        return points.map((p) => `${p.x},${p.y}`).join(' ');
    }, [points]);

    // Cadena de coordenadas para el área con gradiente (polygon)
    const polygonPoints = useMemo(() => {
        if (!points || points.length === 0) return '0,110 300,110 300,110 0,110';
        const coords = points.map((p) => `${p.x},${p.y}`).join(' ');
        return `0,110 ${coords} 300,110 0,110`;
    }, [points]);

    // Etiquetas dinámicas para el eje X que reflejan el ciclo de 07:00 a 07:00 (cada 6 horas)
    const xAxisLabels = useMemo(() => {
        if (!points || points.length === 0) {
            return ['07:00', '13:00', '19:00', '01:00', '07:00'];
        }

        const total = points.length;
        if (total === 1) return [points[0].label];

        // Obtener los 5 puntos clave equidistantes: 0%, 25%, 50%, 75% y el final (100%)
        const idx0 = 0;
        const idx1 = Math.round((total - 1) * 0.25);
        const idx2 = Math.round((total - 1) * 0.5);
        const idx3 = Math.round((total - 1) * 0.75);

        const lbl0 = points[idx0]?.label || '07:00';
        const lbl1 = points[idx1]?.label || '13:00';
        const lbl2 = points[idx2]?.label || '19:00';
        const lbl3 = points[idx3]?.label || '01:00';

        // La última marca refleja el cierre del último slot (ej. de "06:00 - 07:00" toma "07:00")
        const lastPt = points[total - 1];
        const lastSlotParts = lastPt?.slot ? lastPt.slot.split('-') : [];
        const lblEnd = lastSlotParts.length > 1 ? lastSlotParts[1].trim() : '07:00';

        return [lbl0, lbl1, lbl2, lbl3, lblEnd];
    }, [points]);

    return (
        <div className="custom-chart-container">
            {/* Eje Y dinámico */}
            <div className="chart-y-axis">
                {ySteps.map((stepVal, idx) => (
                    <span key={idx}>{stepVal}</span>
                ))}
            </div>

            {/* Gráfico SVG */}
            <div className="chart-svg-wrapper">
                <svg viewBox="0 0 300 120" preserveAspectRatio="none" className="chart-svg">
                    <defs>
                        <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#008040" stopOpacity="0.28" />
                            <stop offset="100%" stopColor="#008040" stopOpacity="0.02" />
                        </linearGradient>
                    </defs>

                    {/* Líneas horizontales de cuadrícula correspondientes a los 5 niveles del eje Y */}
                    <line x1="0" y1="10" x2="300" y2="10" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="35" x2="300" y2="35" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="60" x2="300" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="85" x2="300" y2="85" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="110" x2="300" y2="110" stroke="#e2e8f0" strokeWidth="1" />

                    {/* Área sombreada bajo la curva */}
                    <polygon
                        points={polygonPoints}
                        fill="url(#greenGradient)"
                        style={{ transition: 'all 0.4s ease-out' }}
                    />

                    {/* Línea principal de tendencia */}
                    <polyline
                        fill="none"
                        stroke="#008040"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={polylinePoints}
                        style={{ transition: 'all 0.4s ease-out' }}
                    />

                    {/* Punto visible por cada hora de la serie */}
                    {points.map((marker, i) => (
                        <circle
                            key={`${marker.orden || marker.hour}-${i}`}
                            cx={marker.x}
                            cy={marker.y}
                            r="2.5"
                            fill="#008040"
                            stroke="#ffffff"
                            strokeWidth="1"
                            className="chart-data-point"
                            style={{ transition: 'all 0.3s ease-out', cursor: 'pointer' }}
                        >
                            <title>
                                {`${marker.slot || marker.label}${marker.turno ? ` (Turno ${marker.turno})` : ''}: ${Math.round(marker.value)} pzas`}
                            </title>
                        </circle>
                    ))}
                </svg>

                {/* Eje X de 07:00 a 07:00 (+1 día) */}
                <div className="chart-x-axis">
                    {xAxisLabels.map((lbl, idx) => (
                        <span key={idx}>{lbl}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Chart;
