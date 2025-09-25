/**
 * LYD Toast Component - 100% Design System konform
 * Nutzt master.css Klassen von https://designsystem.liveyourdreams.online
 */

import { AlertIcon, CheckIcon, InfoIcon, XIcon } from '@/components/icons/LYDIcons';
import React, { createContext, useCallback, useContext, useState } from 'react';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Provider Component
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 5000
    };

    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAll }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

// Individual Toast Component
interface LYDToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const LYDToast: React.FC<LYDToastProps> = ({ toast, onClose }) => {
  const handleClose = () => {
    onClose(toast.id);
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckIcon size="default" className="lyd-toast-icon-success" />;
      case 'error':
        return <XIcon size="default" className="lyd-toast-icon-error" />;
      case 'warning':
        return <AlertIcon size="default" className="lyd-toast-icon-warning" />;
      case 'info':
      default:
        return <InfoIcon size="default" className="lyd-toast-icon-info" />;
    }
  };

  return (
    <div className={`lyd-toast lyd-toast-${toast.type}`} role="alert">
      <div className="lyd-toast-content">
        <div className="lyd-toast-icon">
          {getIcon()}
        </div>
        
        <div className="lyd-toast-body">
          <div className="lyd-toast-title">{toast.title}</div>
          {toast.message && (
            <div className="lyd-toast-message">{toast.message}</div>
          )}
        </div>
        
        <div className="lyd-toast-actions">
          {toast.action && (
            <button
              className="lyd-toast-action-btn"
              onClick={toast.action.onClick}
            >
              {toast.action.label}
            </button>
          )}
          
          <button
            className="lyd-toast-close-btn"
            onClick={handleClose}
            aria-label="Toast schließen"
          >
            <XIcon size="sm" />
          </button>
        </div>
      </div>
      
      {toast.duration && toast.duration > 0 && (
        <div 
          className="lyd-toast-progress"
          style={{ 
            animationDuration: `${toast.duration}ms`,
            animationName: 'toast-progress'
          }}
        />
      )}
    </div>
  );
};

// Toast Container
const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="lyd-toast-container">
      {toasts.map(toast => (
        <LYDToast
          key={toast.id}
          toast={toast}
          onClose={removeToast}
        />
      ))}
      
      <style jsx>{`
        @keyframes toast-progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

// Convenience hooks for different toast types
export const useToastHelpers = () => {
  const { addToast } = useToast();

  return {
    success: (title: string, message?: string) =>
      addToast({ type: 'success', title, message }),
    
    error: (title: string, message?: string) =>
      addToast({ type: 'error', title, message }),
    
    warning: (title: string, message?: string) =>
      addToast({ type: 'warning', title, message }),
    
    info: (title: string, message?: string) =>
      addToast({ type: 'info', title, message })
  };
};
