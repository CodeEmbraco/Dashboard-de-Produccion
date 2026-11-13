import React, { useMemo } from 'react';
import { AreaChart } from '@shared/ui';
import { generateHourlySeries, getHourlyXAxisLabels } from '../../utils/hourlySeriesBuilder';

const HourlyProductionChart = ({ lineData = null, data = null }) => {
  const { series, xAxisLabels } = useMemo(() => {
    const builtSeries = generateHourlySeries(lineData, data);
    const labels = getHourlyXAxisLabels(builtSeries);
    return { series: builtSeries, xAxisLabels: labels };
  }, [lineData, data]);

  return <AreaChart series={series} xAxisLabels={xAxisLabels} />;
};

export default HourlyProductionChart;
