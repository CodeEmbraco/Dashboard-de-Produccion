//react
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

//Production Context
import { ProductionProvider } from '@context/ProductionContext'

//Componente Padre
import Dashboard from './components/Dashboard';
import './styles/Dashboard.css';

function App() {
  return (
    <>
      <ProductionProvider>
        <Routes>
          <Route path="/Dashboard" element={<Dashboard/>} />
          <Route path="*" element={<Navigate to="/Dashboard" replace/>} />
          {/*//TODO: Cuando tengamos el componente de tabla descomentamos lo de abajo*/}
          {/* <Route path="/Produccion/:lineid" element={<Tabla/>} />  */}
        </Routes>
      </ProductionProvider>
    </>
  );
}

export default App;