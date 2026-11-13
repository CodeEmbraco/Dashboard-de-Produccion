import React from 'react';
import logoNidec from '@assets/nidec-logo.png';
import { useProduction } from '@shared/components/ProductionProvider/ProductionContext';
import { getFormattedDate } from '@shared/utils/dateUtils';
import LiveClock from './LiveClock';
import NavigationMenu from '../NavigationMenu/NavigationMenu';
import './AppHeader.css';

const AppHeader = ({
  currentDateValue: propDateValue,
  todayFormatted: propToday,
  isToday: propIsToday,
  onDateChange: propOnDateChange,
  activeTab,
  setActiveTab,
  focusedLineId,
  bannerText = 'LÍNEAS DE PRODUCCIÓN: Motores Reynosa S.A. de C.V.'
}) => {
  const { selectedDate, setSelectedDate } = useProduction();
  const todayFormatted = propToday || getFormattedDate();
  const currentDateValue = propDateValue || selectedDate || todayFormatted;
  const isToday = propIsToday !== undefined ? propIsToday : currentDateValue === todayFormatted;
  const handleDateChange = propOnDateChange || setSelectedDate;

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <img src={logoNidec} alt="Nidec Logo" className="header-logo" />
      </div>

      <div className="banner-green">{bannerText}</div>

      <div className="header-right-group">
        <div className="header-time">
          <LiveClock />
          <div className="date-picker-wrapper">
            <input
              type="date"
              className="header-date-input"
              value={currentDateValue}
              max={todayFormatted}
              onChange={(e) => {
                if (e.target.value) {
                  handleDateChange(e.target.value);
                }
              }}
              title="Consultar producción por fecha"
            />
            {!isToday && (
              <button
                type="button"
                className="btn-today-reset"
                onClick={() => handleDateChange(todayFormatted)}
                title="Restablecer al día de hoy"
              >
                Hoy
              </button>
            )}
          </div>
        </div>

        <NavigationMenu
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          focusedLineId={focusedLineId}
        />
      </div>
    </header>
  );
};

export default AppHeader;
