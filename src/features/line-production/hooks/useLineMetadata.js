import { useState, useEffect } from 'react';
import lineProductionService from '../services/lineProductionService';

export const useLineMetadata = (lineId, fallbackName = '') => {
  const [metadata, setMetadata] = useState({
    name: fallbackName,
    supervisors: [],
    leaders: []
  });

  useEffect(() => {
    if (!lineId) return;

    let isMounted = true;

    const fetchLineInfo = async () => {
      try {
        const data = await lineProductionService.getLinesConfig(lineId);
        if (isMounted && data && data.LineId) {
          setMetadata({
            name: data.Nombre || fallbackName || lineId,
            supervisors: Array.isArray(data.Supervisores)
              ? data.Supervisores.map((s) => ({
                  id: String(s.PersonalId),
                  name: s.Nombre
                }))
              : [],
            leaders: Array.isArray(data.Lideres)
              ? data.Lideres.map((l) => ({
                  id: String(l.PersonalId),
                  name: l.Nombre
                }))
              : []
          });
        } else if (isMounted) {
          setMetadata((prev) => ({ ...prev, name: fallbackName || lineId }));
        }
      } catch (err) {
        console.error('Error al cargar configuración de línea:', err);
        if (isMounted) {
          setMetadata((prev) => ({ ...prev, name: fallbackName || lineId }));
        }
      }
    };

    fetchLineInfo();

    return () => {
      isMounted = false;
    };
  }, [lineId, fallbackName]);

  return metadata;
};
