import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProductionProvider } from '@shared/components/ProductionProvider/ProductionContext';
import { DashboardView } from '@features/production-dashboard';
import { LineProductionView } from '@features/line-production';

function App() {
  return (
    <ProductionProvider>
      <Routes>
        <Route path="/Dashboard" element={<DashboardView />} />
        <Route path="/Produccion/:lineId" element={<LineProductionView />} />
        <Route path="/tabla/:lineId" element={<LineProductionView />} />
        <Route path="*" element={<Navigate to="/Dashboard" replace />} />
      </Routes>
    </ProductionProvider>
  );
}

export default App;
