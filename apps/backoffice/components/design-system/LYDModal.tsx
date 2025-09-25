/**
 * LYD Modal Component - 100% Design System konform
 * Nutzt master.css Klassen von https://designsystem.liveyourdreams.online
 */

import { XIcon } from '@/components/icons/LYDIcons';
import React, { useEffect, useRef } from 'react';
import { LYDButton } from './LYDButton';

export interface LYDModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'default' | 'large' | 'xl';
  closable?: boolean;
  backdrop?: boolean;
  className?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

export const LYDModal: React.FC<LYDModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'default',
  closable = true,
  backdrop = true,
  className = '',
  onConfirm,
  onCancel,
  confirmText = 'Bestätigen',
  cancelText = 'Abbrechen',
  confirmVariant = 'primary'
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closable) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, closable, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (backdrop && closable && event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Design System Klassen
  const modalClasses = ['lyd-modal'];
  const contentClasses = ['lyd-modal-content'];
  
  if (size !== 'default') {
    contentClasses.push(`lyd-modal-${size}`);
  }
  
  if (className) {
    contentClasses.push(className);
  }

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  return (
    <div className={modalClasses.join(' ')} onClick={handleBackdropClick}>
      <div className="lyd-modal-backdrop" />
      
      <div className={contentClasses.join(' ')} ref={modalRef} role="dialog" aria-modal="true">
        {/* Header */}
        <div className="lyd-modal-header">
          {title && <h2 className="lyd-modal-title">{title}</h2>}
          {closable && (
            <button
              className="lyd-modal-close"
              onClick={onClose}
              aria-label="Modal schließen"
            >
              <XIcon size="default" />
            </button>
          )}
        </div>
        
        {/* Body */}
        <div className="lyd-modal-body">
          {children}
        </div>
        
        {/* Footer */}
        {(onConfirm || onCancel) && (
          <div className="lyd-modal-footer">
            <div className="lyd-modal-actions">
              {onCancel && (
                <LYDButton variant="outline" onClick={handleCancel}>
                  {cancelText}
                </LYDButton>
              )}
              {onConfirm && (
                <LYDButton variant={confirmVariant} onClick={handleConfirm}>
                  {confirmText}
                </LYDButton>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Confirmation Modal - Specialized variant
export interface LYDConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const LYDConfirmModal: React.FC<LYDConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Bestätigen',
  cancelText = 'Abbrechen',
  variant = 'info'
}) => {
  const confirmVariant = variant === 'danger' ? 'primary' : 'primary';
  
  return (
    <LYDModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
      onConfirm={onConfirm}
      onCancel={onClose}
      confirmText={confirmText}
      cancelText={cancelText}
      confirmVariant={confirmVariant}
      className={`lyd-confirm-modal lyd-confirm-${variant}`}
    >
      <p className="lyd-confirm-message">{message}</p>
    </LYDModal>
  );
};

export default LYDModal;

