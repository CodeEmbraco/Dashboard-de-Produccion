import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import CredentialsModal from './CredentialsModal';
import './AdminGuard.css';

const AdminAccessButton = ({ isAdmin, onUnlock, className = '' }) => {
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={`btn-admin-access ${isAdmin ? 'admin-active' : ''} ${className}`}
        onClick={() => setIsCredentialsModalOpen(true)}
        title={isAdmin ? 'Acceso Administrador Activo' : 'Bloqueado - Requiere Credenciales'}
      >
        <Shield strokeWidth={2.5} size={26} />
      </button>

      <CredentialsModal
        isOpen={isCredentialsModalOpen}
        onClose={() => setIsCredentialsModalOpen(false)}
        onUnlock={onUnlock}
      />
    </>
  );
};

export default AdminAccessButton;
