// Imágenes de motores Reynosa
import motor1Img from '@assets/reynosa/motor_1.png';
import motor2Img from '@assets/reynosa/motor_2.png';
import motor3Img from '@assets/reynosa/motor_3.png';
import motor4Img from '@assets/reynosa/motor_4.png';
import motor5Img from '@assets/reynosa/motor_5.png';
import motor6Img from '@assets/reynosa/motor_6.png';
import motor7Img from '@assets/reynosa/motor_7.png';

export const REYNOSA_LINES = [
  { key: 'linea1', catalogKey: 'line1', id: 'linea1', numericId: 1, lineNumber: 1, name: 'Línea 1', defaultMeta: 70, imgURL: motor1Img },
  { key: 'linea2', catalogKey: 'line2', id: 'linea2', numericId: 2, lineNumber: 2, name: 'Línea 2', defaultMeta: 20, imgURL: motor2Img },
  { key: 'linea4', catalogKey: 'line4', id: 'linea4', numericId: 3, lineNumber: 4, name: 'Línea 4', defaultMeta: 180, imgURL: motor3Img },
  { key: 'linea7', catalogKey: 'line7', id: 'linea7', numericId: 4, lineNumber: 7, name: 'Línea 7', defaultMeta: 450, imgURL: motor4Img },
  { key: 'linea14', catalogKey: 'line14', id: 'linea14', numericId: 5, lineNumber: 14, name: 'Línea 14', defaultMeta: 240, imgURL: motor5Img },
  { key: 'linea16', catalogKey: 'line16', id: 'linea16', numericId: 6, lineNumber: 16, name: 'Línea 16', defaultMeta: 280, imgURL: motor6Img },
  { key: 'linea30', catalogKey: 'line30', id: 'linea30', numericId: 7, lineNumber: 30, name: 'Línea 30', defaultMeta: 100, imgURL: motor7Img }
];

// Catálogo: Líneas de Reynosa
export const linesCatalog = {
  Reynosa: {
    line1: { id: 1, lineId: 'linea1', name: 'Línea 1', defaultMeta: 70, imgURL: motor1Img },
    line2: { id: 2, lineId: 'linea2', name: 'Línea 2', defaultMeta: 20, imgURL: motor2Img },
    line4: { id: 3, lineId: 'linea4', name: 'Línea 4', defaultMeta: 180, imgURL: motor3Img },
    line7: { id: 4, lineId: 'linea7', name: 'Línea 7', defaultMeta: 450, imgURL: motor4Img },
    line14: { id: 5, lineId: 'linea14', name: 'Línea 14', defaultMeta: 240, imgURL: motor5Img },
    line16: { id: 6, lineId: 'linea16', name: 'Línea 16', defaultMeta: 280, imgURL: motor6Img },
    line30: { id: 7, lineId: 'linea30', name: 'Línea 30', defaultMeta: 100, imgURL: motor7Img }
  }
};

/**
 * Resuelve cualquier identificador de ruta (ej. "linea14", "line14", "14", "5")
 * hacia la configuración de línea de Reynosa correspondiente.
 */
export const resolveLineConfig = (rawKey) => {
  if (!rawKey) return null;
  const clean = String(rawKey).toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  const digits = clean.replace(/\D/g, '');

  const found =
    REYNOSA_LINES.find(
      (l) =>
        l.key === clean ||
        l.catalogKey === clean ||
        String(l.lineNumber) === digits
    ) ||
    REYNOSA_LINES.find((l) => String(l.numericId) === clean);

  if (found) return found;

  // Fallback dinámico por si se consulta otra línea válida en el backend
  return {
    key: rawKey,
    catalogKey: rawKey,
    id: rawKey,
    name: `Línea ${rawKey}`,
    defaultMeta: 100,
    imgURL: motor1Img
  };
};
