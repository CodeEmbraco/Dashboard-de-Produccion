import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ message = 'Cargando información de producción' }) => {
  return (
    <div className="loading-screen">
      <div className="loader" />
      <p>{message}</p>
    </div>
  );
};

export default LoadingScreen;
