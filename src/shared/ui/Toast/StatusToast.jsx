import React from 'react';
import './StatusToast.css';

const VARIANT_CLASSES = {
  loading: 'loading-toast',
  saving: 'saving-toast',
  error: 'error-toast',
  warning: 'warning-toast'
};

const StatusToast = ({ variant = 'loading', message, showSpinner = false }) => {
  if (!message) return null;

  const variantClass = VARIANT_CLASSES[variant] || 'loading-toast';

  return (
    <div className={`discreet-notification ${variantClass}`}>
      {showSpinner && <span className="spinner-mini"></span>}
      <span>{message}</span>
    </div>
  );
};

export default StatusToast;
