import React, { useState, useEffect } from 'react';
import KpiCard from './KpiCard';
import CircularProgress from './CircularProgress';
import NavigationMenu from './NavigationMenu';
import ConsolidatedReport from './ConsolidatedReport';
import '../styles/Dashboard.css';

// Importaciones de las nuevas imágenes de motores
import motor1Img from '../assets/motor_1.png';
import motor2Img from '../assets/motor_2.png';
import motor3Img from '../assets/motor_3.png';
import motor4Img from '../assets/motor_4.png';
import motor5Img from '../assets/motor_5.png';
import motor6Img from '../assets/motor_6.png';
import motor7Img from '../assets/motor_7.png';

// Otras imágenes generales
import logoNidec from '../assets/nidec-logo.png';
import fabricaImg from '../assets/fabrica_nidec.png';
import sakamotoFeliImg from '../assets/sakamoto feli.png';

const initialData = [
  { id: 1, title: 'Linea 1', iconImg: motor1Img, total: 230, meta: 280, delta: -265, values: { t3: 151, tt: 130, t2: 17 }, downtime: { totalMin: 45, t1: 10, t2: 25, t3: 10 }, image: motor1Img },
  { id: 2, title: 'Linea 2', iconImg: motor2Img, total: 280, meta: 300, delta: -14, values: { t3: 1, tt: 0, t2: 30 }, downtime: { totalMin: 12, t1: 2, t2: 10, t3: 0 }, image: motor2Img },
  { id: 3, title: 'Linea 4', iconImg: motor3Img, total: 200, meta: 260, delta: -50, values: { t3: 1002, tt: 1282, t2: 1341 }, downtime: { totalMin: 28, t1: 15, t2: 8, t3: 5 }, image: motor3Img },
  { id: 4, title: 'Linea 7', iconImg: motor4Img, total: 250, meta: 300, delta: -2199, values: { t3: 1, tt: 0, t2: 30 }, downtime: { totalMin: 120, t1: 60, t2: 40, t3: 20 }, image: motor4Img },
  { id: 5, title: 'Linea 14', iconImg: motor5Img, total: 220, meta: 240, delta: 0, values: { t3: 0, tt: 0, t2: 0 }, downtime: { totalMin: 0, t1: 0, t2: 0, t3: 0 }, image: motor5Img },
  { id: 6, title: 'Linea 16', iconImg: motor6Img, total: 220, meta: 300, delta: 44, values: { t3: 644, tt: 0, t2: 0 }, downtime: { totalMin: 18, t1: 0, t2: 0, t3: 18 }, image: motor6Img },
  { id: 7, title: 'Linea 30', iconImg: motor7Img, total: 220, meta: 240, delta: -250, values: { t3: 450, tt: 500, t2: 300 }, downtime: { totalMin: 35, t1: 15, t2: 10, t3: 10 }, image: motor7Img }
];

const Dashboard = () => {
  const [linesData, setLinesData] = useState(initialData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Estado de la pestaña activa
  const [activeTab, setActiveTab] = useState('dashboard');

  // Estado para pausar/reanudar la rotación del Dashboard Central
  const [isPaused, setIsPaused] = useState(false);

  const getStatusColor = (total, meta) => {
    if (!meta || meta === 0) return 'status-yellow';
    const pct = (total / meta) * 100;
    if (pct >= 100) return 'status-green';
    if (pct >= 80) return 'status-yellow';
    return 'status-red';
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // CARROUSEL DEL DASHBOARD CENTRAL (RESPETA EL ESTADO `isPaused`)
  useEffect(() => {
    if (isPaused) return; // Si está pausado, no inicia el temporizador

    const carouselTimer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % linesData.length);
    }, 4000);

    return () => clearInterval(carouselTimer);
  }, [linesData.length, isPaused]);

  const currentLine = linesData[currentIndex];
  const totalPlanta = linesData.reduce((acc, curr) => acc + curr.total, 0);
  const metaPlanta = linesData.reduce((acc, curr) => acc + curr.meta, 0);

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <header className="dashboard-header">
        <div className="header-left">
          <img src={logoNidec} alt="Nidec Logo" className="header-logo" />
        </div>
        
        <div className="banner-green">
          LÍNEAS DE PRODUCCIÓN: Motores Reynosa S.A. de C.V.
        </div>

        <div className="header-right-group">
          <div className="header-time">
            <div className="time-clock">🕒 {currentTime.toLocaleTimeString()}</div>
            <div className="time-date">
              {currentTime.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>

          <NavigationMenu activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </header>

      {/* SECCIÓN PRINCIPAL */}
      <div className="main-layout">
        
        {/* SIDEBAR RESUMEN GENERAL */}
        <aside className="sidebar-summary">
          <img src={sakamotoFeliImg} alt="Sakamoto Feli" className="zero-character" />

          <div className="sidebar-header-title">
            <h3 className="sidebar-title">RESUMEN GENERAL</h3>
            <div className="sidebar-title-underline"></div>
          </div>

          <div className="summary-list">
            <div className="summary-item total-planta-item">
              <div className="summary-item-left">
                <div className="line-icon-circle black-circle">
                  <img src={fabricaImg} alt="Planta" className="sidebar-factory-icon" />
                </div>
                <div className="line-info">
                  <div className="line-name">TOTAL PLANTA</div>
                  <div className="line-val-group">
                    <span className="line-val green-text">{totalPlanta}</span>
                    <span className="line-meta"> / {metaPlanta}</span>
                  </div>
                </div>
              </div>

              <CircularProgress 
                percentage={metaPlanta ? (totalPlanta / metaPlanta) * 100 : 0} 
                color="#008040"
              />
            </div>

            {linesData.map((item, idx) => {
              const pct = item.meta && item.meta > 0 ? (item.total / item.meta) * 100 : null;
              const isSelected = idx === currentIndex;
              const statusColor = getStatusColor(item.total, item.meta);
              const colorHex = statusColor === 'status-green' ? '#008040' : statusColor === 'status-yellow' ? '#d97706' : '#dc2626';

              return (
                <div 
                  key={item.id} 
                  className={`summary-item ${isSelected ? 'active-green-row' : ''}`}
                  onClick={() => setCurrentIndex(idx)}
                >
                  <div className="summary-item-left">
                    <div className="line-icon-circle green-icon-circle">
                      <img src={item.iconImg} alt={item.title} className="sidebar-product-icon" />
                    </div>
                    <div className="line-info">
                      <div className="line-name">{item.title}</div>
                      <div className="line-val-group">
                        <span className="line-val green-text">{item.total}</span>
                        <span className="line-meta"> / {item.meta}</span>
                      </div>
                    </div>
                  </div>

                  <CircularProgress 
                    percentage={pct} 
                    color={colorHex}
                  />
                </div>
              );
            })}
          </div>
        </aside>

        {/* CONTENIDO DINÁMICO */}
        {activeTab === 'dashboard' ? (
          <main className="featured-card">
            <div className="featured-card-grid">

              {/* COLUMNA 1 */}
              <div className="featured-green-sidebar">
                <h2 className="featured-product-title">{currentLine.title}</h2>
                <div className="featured-product-title-underline"></div>
                <div className="featured-img-wrapper">
                  <img src={currentLine.image} alt={currentLine.title} className="featured-product-img" />
                </div>
              </div>

              {/* COLUMNA 2 */}
              <div className="featured-col-chart">
                <div className="featured-section-title">PRODUCCIÓN DEL DÍA</div>
                <div className="featured-main-value">
                  <span className="val-current">{currentLine.total}</span>
                  <span className="val-divider">/</span>
                  <span className="val-meta">{currentLine.meta}</span>
                </div>

                <div className="chart-label-rpm">Actual Rate (RPM)</div>

                <div className="custom-chart-container">
                  <div className="chart-y-axis">
                    <span>1000</span>
                    <span>750</span>
                    <span>500</span>
                    <span>250</span>
                    <span>0</span>
                  </div>
                  <div className="chart-svg-wrapper">
                    <svg viewBox="0 0 300 120" preserveAspectRatio="none" className="chart-svg">
                      <defs>
                        <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#008040" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#008040" stopOpacity="0.02" />
                        </linearGradient>
                      </defs>

                      <line x1="0" y1="10" x2="300" y2="10" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="35" x2="300" y2="35" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="60" x2="300" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="85" x2="300" y2="85" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="110" x2="300" y2="110" stroke="#e2e8f0" strokeWidth="1" />

                      <polygon
                        points="0,80 20,70 40,65 60,45 80,55 100,50 120,68 140,55 160,80 180,70 200,60 220,50 240,70 260,80 280,75 300,78 300,110 0,110"
                        fill="url(#greenGradient)"
                      />

                      <polyline
                        fill="none"
                        stroke="#008040"
                        strokeWidth="2.5"
                        points="0,80 20,70 40,65 60,45 80,55 100,50 120,68 140,55 160,80 180,70 200,60 220,50 240,70 260,80 280,75 300,78"
                      />

                      <circle cx="20" cy="70" r="3" fill="#008040" />
                      <circle cx="60" cy="45" r="3" fill="#008040" />
                      <circle cx="100" cy="50" r="3" fill="#008040" />
                      <circle cx="140" cy="55" r="3" fill="#008040" />
                      <circle cx="180" cy="70" r="3" fill="#008040" />
                      <circle cx="220" cy="50" r="3" fill="#008040" />
                      <circle cx="260" cy="80" r="3" fill="#008040" />
                    </svg>

                    <div className="chart-x-axis">
                      <span>00:00</span>
                      <span>06:00</span>
                      <span>12:00</span>
                      <span>18:00</span>
                      <span>24:00</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* COLUMNA 3 */}
              <div className="featured-col-delta">
                <div className="featured-section-title">DELTA</div>
                <div className="featured-delta-val">
                  {currentLine.delta > 0 ? `+${currentLine.delta}` : currentLine.delta}
                </div>

                <div className="badge-pill-green">
                  ↗ {currentLine.meta ? ((currentLine.delta / currentLine.meta) * 100).toFixed(1) : 0}% <span className="vs-meta">vs Meta</span>
                </div>

                <div className="featured-divider-line"></div>

                <div className="featured-section-title">META DEL DÍA</div>
                <div className="featured-meta-val">{currentLine.meta}</div>
                <div className="featured-rpm-unit">RPM</div>
              </div>

              {/* COLUMNA 4 */}
              <div className="featured-col-trend downtime-col">
                <div className="downtime-top-section">
                  <div className="featured-section-title">DOWNTIME</div>
                  
                  <div className="downtime-main-metric">
                    <span className="downtime-number">{currentLine.downtime.totalMin}</span>
                    <span className="downtime-unit">min</span>
                  </div>

                  <div className="downtime-badge">
                    ⚠️ Tiempo Muerto Acumulado
                  </div>
                </div>

                <div className="featured-divider-line"></div>

                <div className="production-shift-section">
                  <div className="downtime-sub-title">PRODUCCIÓN POR TURNO</div>

                  <div className="featured-bars-container">
                    <div className="featured-bar-row">
                      <span className="lbl-t">T3:</span>
                      <div className="bar-track">
                        <div 
                          className="bar-fill-green" 
                          style={{ width: `${currentLine.meta ? (currentLine.values.t3 / currentLine.meta) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <span className="val-t">{currentLine.values.t3}</span>
                    </div>

                    <div className="featured-bar-row">
                      <span className="lbl-t">T1:</span>
                      <div className="bar-track">
                        <div 
                          className="bar-fill-green" 
                          style={{ width: `${currentLine.meta ? (currentLine.values.tt / currentLine.meta) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <span className="val-t">{currentLine.values.tt}</span>
                    </div>

                    <div className="featured-bar-row">
                      <span className="lbl-t">T2:</span>
                      <div className="bar-track">
                        <div 
                          className="bar-fill-green" 
                          style={{ width: `${currentLine.meta ? (currentLine.values.t2 / currentLine.meta) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <span className="val-t">{currentLine.values.t2}</span>
                    </div>
                  </div>
                </div>

                {/* ÁREA INFERIOR CON MASCOTA Y BOTÓN PAUSA */}
                <div className="zero-mascot-wrapper">
                  <img src={sakamotoFeliImg} alt="Sakamoto Feli Mascot" className="zero-mascot-img" />
                  
                  {/* BOTÓN PAUSA/PLAY */}
                  <button 
                    className={`pause-control-btn ${isPaused ? 'paused' : ''}`}
                    onClick={() => setIsPaused(!isPaused)}
                    title={isPaused ? "Reanudar avance automático" : "Pausar avance en esta línea"}
                  >
                    {isPaused ? '▶' : '⏸'}
                  </button>
                </div>
              </div>

            </div>
          </main>
        ) : (
          <main style={{ flex: 1, width: '100%' }}>
            <ConsolidatedReport linesList={linesData} />
          </main>
        )}
      </div>

      {/* MARQUESINA INFERIOR */}
      <div className="ticker-wrapper">
        <div className="ticker-track">
          {linesData.map((item) => (
            <div key={`orig-${item.id}`} className="ticker-card-item">
              <KpiCard 
                {...item} 
                colorClass={getStatusColor(item.total, item.meta)} 
              />
            </div>
          ))}

          {linesData.map((item) => (
            <div key={`dup-${item.id}`} className="ticker-card-item">
              <KpiCard 
                {...item} 
                colorClass={getStatusColor(item.total, item.meta)} 
              />
            </div>
          ))}
        </div>
      </div>

      <footer className="dashboard-footer-main">
        <p>© 2026 Nidec ACIM. Todos los derechos reservados. | Tablas de Productividad | Departamento TI COLD MÉXICO</p>
      </footer>
    </div>
  );
};

export default Dashboard;