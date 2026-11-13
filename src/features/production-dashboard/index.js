export { default as DashboardView } from './components/DashboardView';
export { default as FeaturedLineCard } from './components/FeaturedLineCard/FeaturedLineCard';
export { default as BottomTicker } from './components/BottomTicker/BottomTicker';
export { default as HourlyProductionChart } from './components/HourlyProductionChart/HourlyProductionChart';
export { useDashboardData } from './hooks/useDashboardData';
export { dashboardService } from './services/dashboardService';
export { adaptDashboardData, adaptLineData, getLineImage, defaultLine } from './adapters/dashboardAdapter';
