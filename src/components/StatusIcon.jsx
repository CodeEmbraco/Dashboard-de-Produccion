import React from 'react';

const StatusIcon = ({ iconType }) => {
  switch (iconType) {
    case 'planta':
      return <span>👥</span>;
    case 'pre-ensamble':
      return <span>🧩</span>;
    case 'fan':
    case 'cdu':
      return <span>🌀</span>;
    case 'electronics':
      return <span>🔲</span>;
    case 'insinkerator':
      return <span>🗑️</span>;
    default:
      return <span>⚙️</span>;
  }
};

export default StatusIcon;