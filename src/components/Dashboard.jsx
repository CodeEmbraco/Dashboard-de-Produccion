import React from 'react';
import KpiCard from './KpiCard';
import '../styles/Dashboard.css';

import cduImg from '../assets/cdu-unit.png.png';
import electronicsImg from '../assets/electronics_image.png.png';
import fanImg from '../assets/ecmfan_image.png.png'; 
import insikerator1Img from '../assets/insinkerator.png.png'; 
import insikerator2Img from '../assets/insinkerator.png.png'; 
import preEnsambleImg from '../assets/pre_ensamble.png.png'; 
import logoNidec from '../assets/nidec-logo.png'; 
import logoRight from '../assets/zeroproductividad.png.webp'; 

const Dashboard = () => {
  const data = [
    { id: 1, title: 'CDU', total: 390, rate: 24, delta: 366, values: { t3: 118, tt: 87, t2: 185 }, image: cduImg },
    { id: 2, title: 'INSINKERATOR 1', total: 200, rate: 24, delta: -101, values: { t3: 130, tt: 100, t2: 155 }, image: insikerator1Img },
    { id: 3, title: 'PRE ENSAMBLE', total: 185, rate: 15, delta: -101, values: { t3: 130, tt: 100, t2: 155 }, image: preEnsambleImg },
    { id: 4, title: 'ECM FAN', total: 185, rate: 15, delta: -115, values: { t3: 130, tt: 100, t2: 155 }, image: fanImg },         
    { id: 5, title: 'INSINKERATOR 2', total: 390, rate: 24, delta: 366, values: { t3: 118, tt: 87, t2: 185 }, image: insikerator2Img }, 
    { id: 6, title: 'ELECTRONICS', total: 390, rate: 24, delta: 366, values: { t3: 118, tt: 87, t2: 185 }, image: electronicsImg }, 
  ];

  return (
    <div className="dashboard-container">
      <img src={logoRight} alt="Zero Miedo" className="header-logo-right" />

      <header className="dashboard-header">
        <div className="header-left">
          <img src={logoNidec} alt="Nidec Logo" className="header-logo" />
        </div>
       
        <div className="header-center">
          <h1 className="dashboard-title">LINEAS DE PRODUCCION : GA COLD MX</h1>
        </div>

        <div className="header-right-space"></div>
      </header>
          
      <div className="dashboard-grid">
        {data.map((item) => (
          <KpiCard key={item.id} {...item} />
        ))}
      </div>
  
      <footer className="dashboard-footer-main">
        <p>© 2026 Nidec ACIM Embraco Mty. Todos los derechos reservados.</p>
        <p>Dashboard de Producción | Departamento TI</p>
      </footer>
    </div>
  );
};

export default Dashboard;