//React & Router
import React, { useState, useEffect } from 'react';

//Contexto & Hooks
import { useAdmin } from '@hooks/useAdmin';
import { useProduction } from '@context/ProductionContext';
import { useDashboardData } from '@hooks/useDashboardData';

//Peticiones al Backend
import productionService from '@services/ProductionServices';

//Componentes Visuales
import KpiCard from './KpiCard';
import CircularProgress from './CircularProgress';
import NavigationMenu from './NavigationMenu';
import ConsolidatedReport from './ConsolidatedReport';
import Chart from './Chart/Chart';

//Estilos
import '../styles/Dashboard.css';

//Catálogo de líneas
import { linesCatalog } from '@config/lineConfig';

//Adaptador de datos de la API
import { adaptDashboardData, defaultLine } from '@utils/dashboardAdapter';

//Respuesta mock de producción (api/dashboard/production)
import mockData from '../mock.json';

//Otras imágenes generales
import logoNidec from '@assets/nidec-logo.png';
import fabricaImg from '@assets/fabrica_nidec.png';
import sakamotoFeliImg from '@assets/reynosa/sakamoto feli.png';
import placeholderImg from '@assets/placeholder.png';

// Generar estado inicial adaptado a partir del mock del backend de producción
const initialData = adaptDashboardData(mockData);

const Dashboard = () => {
  const { selectedDate, selectedShift } = useProduction();

  // Consumir datos de la API mediante el hook
  const { dashboardData, loading, error } = useDashboardData(selectedDate, productionService);

  const [linesData, setLinesData] = useState(dashboardData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Estado de la pestaña activa
  const [activeTab, setActiveTab] = useState('dashboard');

  // Estado para pausar/reanudar la rotación del Dashboard Central
  const [isPaused, setIsPaused] = useState(false);

  // Acoplar los datos recibidos de la API al estado de líneas
  useEffect(() => {
    if (dashboardData && Array.isArray(dashboardData) && dashboardData.length > 0) {
      setLinesData(adaptDashboardData(dashboardData));
    }
  }, [dashboardData]);

  // Asegurar que currentIndex no quede fuera de rango al cambiar la lista
  useEffect(() => {
    if (linesData.length > 0 && currentIndex >= linesData.length) {
      setCurrentIndex(0);
    }
  }, [linesData.length, currentIndex]);

  const getStatusColor = (total, meta, metaAcumulada) => {
    // Si contamos con meta acumulada para la hora actual, evalúa contra el avance acumulado
    const target = metaAcumulada && metaAcumulada > 0 ? metaAcumulada : meta;
    if (!target || target === 0) return 'status-yellow';
    const pct = (total / target) * 100;
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
    if (isPaused || linesData.length === 0) return; // Si está pausado o sin datos, no inicia el temporizador

    const carouselTimer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % linesData.length);
    }, 4000);

    return () => clearInterval(carouselTimer);
  }, [linesData.length, isPaused]);

  const currentLine = linesData[currentIndex] || linesData[0] || defaultLine;
  const totalPlanta = linesData.reduce((acc, curr) => acc + (curr.total || 0), 0);
  const metaPlanta = linesData.reduce((acc, curr) => acc + (curr.metaAcumulada || 0), 0);

      // Renderizado alternativo SÓLO si es la primera carga y no hay datos en absoluto
    if (loading && dashboardData.length === 0) {
        return (
        <div className='loading-screen'>
          <div className="loader"/>
          <p>Cargando información de producción</p>
        </div>
        );
    }

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
              const pct = item.eficiencia !== undefined ? item.eficiencia : (item.meta && item.meta > 0 ? (item.total / item.meta) * 100 : null);
              const isSelected = idx === currentIndex;
              const statusColor = getStatusColor(item.total, item.meta, item.metaAcumulada);
              const colorHex = statusColor === 'status-green' ? '#008040' : statusColor === 'status-yellow' ? '#d97706' : '#dc2626';

              return (
                <div
                  key={item.id}
                  className={`summary-item ${isSelected ? 'active-green-row' : ''}`}
                  onClick={() => setCurrentIndex(idx)}
                >
                  <div className="summary-item-left">
                    <div className="line-icon-circle green-icon-circle">
                      <img src={item.iconImg || placeholderImg} alt={item.title} className="sidebar-product-icon" />
                    </div>
                    <div className="line-info">
                      <div className="line-name">{item.title}</div>
                      <div className="line-val-group">
                        <span className="line-val green-text">{item.total}</span>
                        <span className="line-meta"> / {item.metaAcumulada}</span>
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

                <Chart />

              </div>

              {/* COLUMNA 3 */}
              <div className="featured-col-delta">
                <div className="featured-section-title">DELTA</div>
                <div
                  className="featured-delta-val"
                  style={{ color: currentLine.delta >= 0 ? '#008040' : '#dc2626' }}
                >
                  {currentLine.delta > 0 ? `+${currentLine.delta}` : currentLine.delta}
                </div>

                <div className={currentLine.delta >= 0 ? 'badge-pill-green' : 'badge-pill-red'}>
                  {currentLine.delta >= 0 ? '↗' : '↘'}{' '}
                  {(() => {
                    const baseTarget = currentLine.metaAcumulada > 0 ? currentLine.metaAcumulada : currentLine.meta;
                    return baseTarget ? ((Math.abs(currentLine.delta) / baseTarget) * 100).toFixed(1) : 0;
                  })()}%{' '}
                  <span className="vs-meta">
                    {currentLine.metaAcumulada > 0 ? 'vs Meta Acum.' : 'vs Meta'}
                  </span>
                </div>

                <div className="featured-divider-line"></div>

                <div className="featured-section-title">META DEL DÍA</div>
                <div className="featured-meta-val">{currentLine.meta}</div>
                <div className="featured-rpm-unit">PZAS / DÍA</div>
              </div>

              {/* COLUMNA 4 */}
              <div className="featured-col-trend downtime-col">
                <div className="downtime-top-section">
                  <div className="featured-section-title">DOWNTIME</div>

                  <div className="downtime-main-metric">
                    <span className="downtime-number">{currentLine.downtime?.totalMin ?? 0}</span>
                    <span className="downtime-unit">min</span>
                  </div>

                  <div className="downtime-badge">
                    {currentLine.downtime?.pending ? '⏳ Tiempo Muerto (Pendiente)' : '⚠️ Tiempo Muerto Acumulado'}
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
                          style={{
                            width: `${Math.min(
                              Math.max(
                                currentLine.turnos?.T3?.eficiencia ??
                                (currentLine.turnos?.T3?.meta
                                  ? ((currentLine.values?.t3 ?? 0) / currentLine.turnos.T3.meta) * 100
                                  : currentLine.meta
                                    ? ((currentLine.values?.t3 ?? 0) / currentLine.meta) * 100
                                    : 0),
                                0
                              ),
                              100
                            )}%`
                          }}
                        ></div>
                      </div>
                      <span className="val-t">{currentLine.values?.t3 ?? 0}</span>
                    </div>

                    <div className="featured-bar-row">
                      <span className="lbl-t">T1:</span>
                      <div className="bar-track">
                        <div
                          className="bar-fill-green"
                          style={{
                            width: `${Math.min(
                              Math.max(
                                currentLine.turnos?.T1?.eficiencia ??
                                (currentLine.turnos?.T1?.meta
                                  ? ((currentLine.values?.tt ?? currentLine.values?.t1 ?? 0) / currentLine.turnos.T1.meta) * 100
                                  : currentLine.meta
                                    ? ((currentLine.values?.tt ?? currentLine.values?.t1 ?? 0) / currentLine.meta) * 100
                                    : 0),
                                0
                              ),
                              100
                            )}%`
                          }}
                        ></div>
                      </div>
                      <span className="val-t">{currentLine.values?.tt ?? currentLine.values?.t1 ?? 0}</span>
                    </div>

                    <div className="featured-bar-row">
                      <span className="lbl-t">T2:</span>
                      <div className="bar-track">
                        <div
                          className="bar-fill-green"
                          style={{
                            width: `${Math.min(
                              Math.max(
                                currentLine.turnos?.T2?.eficiencia ??
                                (currentLine.turnos?.T2?.meta
                                  ? ((currentLine.values?.t2 ?? 0) / currentLine.turnos.T2.meta) * 100
                                  : currentLine.meta
                                    ? ((currentLine.values?.t2 ?? 0) / currentLine.meta) * 100
                                    : 0),
                                0
                              ),
                              100
                            )}%`
                          }}
                        ></div>
                      </div>
                      <span className="val-t">{currentLine.values?.t2 ?? 0}</span>
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
                colorClass={getStatusColor(item.total, item.meta, item.metaAcumulada)}
              />
            </div>
          ))}

          {linesData.map((item) => (
            <div key={`dup-${item.id}`} className="ticker-card-item">
              <KpiCard
                {...item}
                colorClass={getStatusColor(item.total, item.meta, item.metaAcumulada)}
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