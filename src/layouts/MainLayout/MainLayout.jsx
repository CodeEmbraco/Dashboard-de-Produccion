import React from 'react';
import AppHeader from '../components/Header/AppHeader';
import PlantSummarySidebar from '../components/Sidebar/PlantSummarySidebar';
import AppFooter from '../components/Footer/AppFooter';
import './MainLayout.css';

const MainLayout = ({
  currentDateValue,
  todayFormatted,
  isToday,
  onDateChange,
  activeTab,
  setActiveTab,
  focusedLineId,
  linesData,
  currentIndex,
  onSelectLine,
  totalPlanta,
  metaPlanta,
  getTargetMeta,
  getStatusColor,
  bottomSlot,
  children
}) => {
  return (
    <div className="dashboard-container">
      <AppHeader
        currentDateValue={currentDateValue}
        todayFormatted={todayFormatted}
        isToday={isToday}
        onDateChange={onDateChange}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        focusedLineId={focusedLineId}
      />

      <div className="main-layout">
        <PlantSummarySidebar
          linesData={linesData}
          currentIndex={currentIndex}
          onSelectLine={onSelectLine}
          totalPlanta={totalPlanta}
          metaPlanta={metaPlanta}
          getTargetMeta={getTargetMeta}
          getStatusColor={getStatusColor}
        />

        {children}
      </div>

      {bottomSlot}

      <AppFooter />
    </div>
  );
};

export default MainLayout;
