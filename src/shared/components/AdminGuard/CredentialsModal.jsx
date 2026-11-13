import React, { useState } from 'react';
import { BaseModal } from '@shared/ui';
import './AdminGuard.css';

const CredentialsModal = ({ isOpen, onClose, onUnlock }) => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const expectedUser = (import.meta.env.VITE_ADMIN_USERNAME || 'admin').toLowerCase();
    const expectedPass = import.meta.env.VITE_ADMIN_PASSWORD || 'admin';

    if (user.toLowerCase() === expectedUser && password === expectedPass) {
      onUnlock();
      onClose();
      setUser('');
      setPassword('');
    } else {
      alert('Usuario o Contraseña incorrectos');
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Acceso de Administrador"
      width="360px"
    >
      <p className="admin-credentials-desc">
        Ingrese sus credenciales para habilitar la edición de metas y turnos.
      </p>

      <div className="admin-credentials-form">
        <div className="admin-form-group">
          <label>Usuario:</label>
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Ej: admin"
          />
        </div>
        <div className="admin-form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••"
          />
        </div>
      </div>

      <div className="admin-modal-actions">
        <button type="button" className="btn-modal-cancel" onClick={onClose}>
          Cancelar
        </button>
        <button type="button" className="btn-modal-confirm" onClick={handleLogin}>
          Desbloquear
        </button>
      </div>
    </BaseModal>
  );
};

export default CredentialsModal;
