import httpClient from '@shared/api/httpClient';

export const dashboardService = {
  getDashboardProduction: async (date) => {
    const params = { fecha: date };
    const response = await httpClient.get('api/dashboard/production', { params });
    return response.data;
  },

  getDashboardHourlyChart: async (lineId, date) => {
    const params = { fecha: date, lineId };
    const response = await httpClient.get('api/dashboard/hourly-production', { params });
    return response.data;
  },

  postShiftToggle: async (fecha, turno, nuevoEstado, lineId, lineNo = null) => {
    const response = await httpClient.post('api/utils/shift-toggle', {
      fecha,
      lineId,
      turno,
      nuevoEstado,
      lineNo
    });
    return response.data;
  }
};

export default dashboardService;
