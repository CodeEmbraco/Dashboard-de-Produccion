import httpClient from '@shared/api/httpClient';

export const lineProductionService = {
  getDailyProduction: async (lineID, date) => {
    const params = { fecha: date };
    const response = await httpClient.get(`api/${lineID}/production`, { params });
    return response.data;
  },

  syncParentLoss: async (linea, fecha, hora, minutosCalculados, idSup, idLider) => {
    const response = await httpClient.post('api/losses/sync-parent', {
      linea,
      fecha,
      hora,
      minutosCalculados,
      idSupervisor: idSup,
      idLider
    });
    return response.data;
  },

  addLossDetail: async (idPerdida, detailData) => {
    const response = await httpClient.post(`api/losses/${idPerdida}/details`, detailData);
    return response.data;
  },

  deleteLossDetail: async (idDetalle) => {
    const response = await httpClient.delete(`api/losses/details/${idDetalle}`);
    return response.data;
  },

  getShiftsStatus: async (lineId, fecha, lineNo = null) => {
    const params = { fecha, lineId };
    if (lineNo) params.lineNo = lineNo;
    const response = await httpClient.get('api/shifts/shift-status', { params });
    return response.data;
  },

  shiftToggleStatus: async (lineId, fecha, turno, nuevoEstado, lineNo = null) => {
    try {
      const response = await httpClient.post('api/shifts/shift-toggle', {
        fecha,
        lineId,
        turno,
        nuevoEstado,
        lineNo
      });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar el estado del turno en la BD:', error);
      throw error;
    }
  },

  getLinesConfig: async (lineId = null) => {
    const params = lineId ? { lineId } : {};
    const response = await httpClient.get('api/lines/lines-config', { params });
    return response.data;
  },

  updateDefaultGoalShift: async (lineId, turno, metaDefault, lineNo = null) => {
    try {
      const params = {};
      if (lineNo) params.lineNo = lineNo;
      const response = await httpClient.post(
        'api/goals/default-goal-update-shift',
        { lineId, turno, metaDefault },
        { params }
      );
      return response.data;
    } catch (err) {
      console.error('Error actualizando la meta:', err);
      throw err;
    }
  },

  updateDefaultGoalTimeSlot: async (lineId, horaSlot, metaDefault, lineNo = null) => {
    try {
      const params = {};
      if (lineNo) params.lineNo = lineNo;
      const response = await httpClient.post(
        'api/goals/default-goal-update-timeslot',
        { lineId, horaSlot, metaDefault },
        { params }
      );
      return response.data;
    } catch (err) {
      console.error('Error actualizando la meta:', err);
      throw err;
    }
  },

  updateCustomGoal: async (lineId, fecha, turno, horaSlot, metaCustom, user, lineNo = null) => {
    try {
      const params = {};
      if (lineNo) params.lineNo = lineNo;
      const response = await httpClient.post(
        'api/goals/custom-goal-update',
        { lineId, fecha, turno, horaSlot, metaCustom, user, lineNo },
        { params }
      );
      return response.data;
    } catch (err) {
      console.error('Error actualizando la meta:', err);
      throw err;
    }
  },

  getLineEffectiveGoalDay: async (lineId, date, lineNo = null) => {
    const params = { fecha: date, lineId };
    if (lineNo) params.lineNo = lineNo;
    const response = await httpClient.get('api/goals/line-effective-goal-day', { params });
    return response.data;
  }
};

export default lineProductionService;
