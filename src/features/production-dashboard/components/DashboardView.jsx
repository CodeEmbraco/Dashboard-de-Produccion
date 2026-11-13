import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useProduction } from '@shared/components/ProductionProvider/ProductionContext';
import { getFormattedDate } from '@shared/utils/dateUtils';
import { LoadingScreen } from '@shared/ui';
import { MainLayout } from '@layouts';
import { ConsolidatedReportView } from '@features/consolidated-report';

import { useDashboardData } from '../hooks/useDashboardData';
import dashboardService from '../services/dashboardService';
import { adaptDashboardData, defaultLine } from '../adapters/dashboardAdapter';
import FeaturedLineCard from './FeaturedLineCard/FeaturedLineCard';
import BottomTicker from './BottomTicker/BottomTicker';

import mockData from '../../../mock.json';

const initialData = adaptDashboardData(mockData);

const DashboardView = () => {
  const { selectedDate, setSelectedDate } = useProduction();
  const todayFormatted = getFormattedDate();
  const currentDateValue = selectedDate || todayFormatted;
  const isToday = currentDateValue === todayFormatted;

  const location = useLocation();
  const [linesData, setLinesData] = useState(initialData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(
    () => location.state?.activeTab || 'dashboard'
  );
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state?.activeTab]);

  const focusedLineId = linesData[currentIndex]?.lineId || linesData[currentIndex]?.id || null;

  const { dashboardData, hourlyData, loading } = useDashboardData(
    currentDateValue,
    focusedLineId,
    dashboardService
  );

  useEffect(() => {
    if (dashboardData && Array.isArray(dashboardData) && dashboardData.length > 0) {
      setLinesData(adaptDashboardData(dashboardData));
    }
  }, [dashboardData]);

  useEffect(() => {
    if (linesData.length > 0 && currentIndex >= linesData.length) {
      setCurrentIndex(0);
    }
  }, [linesData.length, currentIndex]);

  useEffect(() => {
    if (isPaused || linesData.length === 0) return;

    const carouselTimer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % linesData.length);
    }, 4000);

    return () => clearInterval(carouselTimer);
  }, [linesData.length, isPaused]);

  const getTargetMeta = useCallback(
    (line) => {
      if (!line) return 0;
      const metaTotalDia = Number(
        line.produccion?.totalDia?.meta ?? line.metaTotal ?? line.meta ?? 0
      );

      if (!isToday) {
        return metaTotalDia;
      }

      const metaEnCurso = Number(line.metaAcumulada ?? line.metaEfectiva ?? 0);
      return metaEnCurso > 0 ? metaEnCurso : metaTotalDia;
    },
    [isToday]
  );

  const getStatusColor = useCallback((total, target) => {
    if (!target || target === 0) return 'status-yellow';
    const pct = (total / target) * 100;
    if (pct >= 100) return 'status-green';
    if (pct >= 80) return 'status-yellow';
    return 'status-red';
  }, []);

  const currentLine = linesData[currentIndex] || linesData[0] || defaultLine;
  const targetCurrentMeta = getTargetMeta(currentLine);
  const currentDelta = isToday
    ? currentLine.delta !== undefined
      ? currentLine.delta
      : currentLine.total - targetCurrentMeta
    : currentLine.total - targetCurrentMeta;

  const totalPlanta = linesData.reduce((acc, curr) => acc + (curr.total || 0), 0);
  const metaPlanta = linesData.reduce((acc, curr) => acc + getTargetMeta(curr), 0);

  if (loading && dashboardData.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <MainLayout
      currentDateValue={currentDateValue}
      todayFormatted={todayFormatted}
      isToday={isToday}
      onDateChange={setSelectedDate}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      focusedLineId={focusedLineId}
      linesData={linesData}
      currentIndex={currentIndex}
      onSelectLine={setCurrentIndex}
      totalPlanta={totalPlanta}
      metaPlanta={metaPlanta}
      getTargetMeta={getTargetMeta}
      getStatusColor={getStatusColor}
      bottomSlot={
        <BottomTicker
          linesData={linesData}
          getTargetMeta={getTargetMeta}
          getStatusColor={getStatusColor}
        />
      }
    >
      {activeTab === 'dashboard' ? (
        <FeaturedLineCard
          currentLine={currentLine}
          targetCurrentMeta={targetCurrentMeta}
          currentDelta={currentDelta}
          isToday={isToday}
          hourlyData={hourlyData}
          isPaused={isPaused}
          onTogglePause={() => setIsPaused((prev) => !prev)}
        />
      ) : (
        <main style={{ flex: 1, width: '100%' }}>
          <ConsolidatedReportView linesList={linesData} />
        </main>
      )}
    </MainLayout>
  );
};

export default DashboardView;
