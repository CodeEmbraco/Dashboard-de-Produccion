import { dashboardService } from '@features/production-dashboard';
import { lineProductionService } from '@features/line-production';

const productionService = {
  ...dashboardService,
  ...lineProductionService
};

export default productionService;
