//React & Router
import React from 'react';

const Chart = () => {
    return (
        <>
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

                        {/*GRAFICA DE FRECUENCIAS: Gradiente (Debajo de la linea)*/}
                        <polygon
                            points="0,80 20,70 40,65 60,45 80,55 100,50 120,68 140,55 160,80 180,70 200,60 220,50 240,70 260,80 280,75 300,78 300,110 0,110"
                            fill="url(#greenGradient)"
                        />
                        {/*GRAFICA DE FRECUENCIAS: Linea*/}
                        <polyline
                            fill="none"
                            stroke="#008040"
                            strokeWidth="2.5"
                            points="0,80 20,70 40,65 60,45 80,55 100,50 120,68 140,55 160,80 180,70 200,60 220,50 240,70 260,80 280,75 300,78"
                        />
                        {/*GRAFICA DE FRECUENCIAS: Puntos*/}
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
        </>
    );
};

export default Chart; 