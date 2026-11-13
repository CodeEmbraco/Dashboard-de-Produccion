import React from 'react';
import { X } from 'lucide-react';
import './BaseModal.css';

const BaseModal = ({
  isOpen,
  onClose,
  title,
  width = 'auto',
  minWidth,
  showCloseIcon = false,
  closeOnOverlayClick = false,
  children
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="ui-modal-overlay"
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      <div
        className="ui-modal-content"
        style={{ width, minWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseIcon) && (
          <div className="ui-modal-header">
            {title && <h3 className="ui-modal-title">{title}</h3>}
            {showCloseIcon && (
              <button
                type="button"
                className="ui-modal-close-btn"
                onClick={onClose}
                aria-label="Cerrar modal"
              >
                <X size={22} />
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default BaseModal;
