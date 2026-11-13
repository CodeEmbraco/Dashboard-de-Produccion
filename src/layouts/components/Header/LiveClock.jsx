import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

/**
 * Micro-componente que encapsula el estado del reloj de 1 segundo
 * para evitar re-renderizar todo el árbol del Dashboard en cada tick.
 */
const LiveClock = () => {
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="time-clock">
      <Clock size={16} />
      <span>{currentTime.toLocaleTimeString()}</span>
    </div>
  );
};

export default LiveClock;
