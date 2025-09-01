'use client';
import React, { useEffect } from 'react';

export interface LdsDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function LdsDialog({
  open,
  onClose,
  title,
  children,
  size = 'md'
}: LdsDialogProps) {
  // NUR CSS-Module-Klassen verwenden - KEIN Tailwind!
  const dialogClasses = [
    'lds-dialog',
    `lds-dialog--${size}`
  ].join(' ');
  
  // Escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    
    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);
  
  if (!open) return null;
  
  return (
    <div className="lds-dialog-overlay">
      {/* Backdrop */}
      <div 
        className="lds-dialog-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Dialog */}
      <div 
        className={dialogClasses}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'dialog-title' : undefined}
        tabIndex={-1}
      >
        {title && (
          <div className="lds-dialog-header">
            <h2 id="dialog-title" className="lds-dialog-title">
              {title}
            </h2>
            <button
              type="button"
              className="lds-dialog-close"
              onClick={onClose}
              aria-label="Dialog schließen"
            >
              ✕
            </button>
          </div>
        )}
        
        <div className="lds-dialog-content">
          {children}
        </div>
      </div>
    </div>
  );
}
