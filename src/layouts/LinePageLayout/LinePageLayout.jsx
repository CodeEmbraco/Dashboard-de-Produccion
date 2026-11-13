import React from 'react';
import AppHeader from '../components/Header/AppHeader';
import AppFooter from '../components/Footer/AppFooter';
import './LinePageLayout.css';

const LinePageLayout = ({ lineTitle, currentLineId, children }) => {
  const bannerText = lineTitle
    ? `TABLA DE PRODUCTIVIDAD: ${lineTitle.toUpperCase()}`
    : 'LÍNEAS DE PRODUCCIÓN: Motores Reynosa S.A. de C.V.';

  return (
    <div className="line-page-body">
      <AppHeader
        activeTab="hourly"
        focusedLineId={currentLineId}
        bannerText={bannerText}
      />

      <main className="line-page-content">{children}</main>

      <AppFooter />
    </div>
  );
};

export default LinePageLayout;
