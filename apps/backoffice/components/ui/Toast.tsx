'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  onClose: () => void;
}

export const Toast = ({ type, title, message, duration = 5000, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);
  
  const icons = {
    success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  };
  
  if (!isMounted) return null;
  
  return createPortal(
    <div className={`lyd-toast ${type} ${!isVisible ? 'hiding' : ''}`}>
      <svg className="lyd-toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icons[type]} />
      </svg>
      <div className="lyd-toast-content">
        <div className="lyd-toast-title">{title}</div>
        <div className="lyd-toast-message">{message}</div>
      </div>
      <button className="lyd-toast-close" onClick={() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {duration > 0 && <div className="lyd-toast-progress" />}
    </div>,
    document.body
  );
};

// Toast Manager Hook
export const useToast = () => {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([]);
  
  const addToast = (toast: Omit<ToastProps, 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id, onClose: () => removeToast(id) }]);
  };
  
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  const showSuccess = (title: string, message: string) => {
    addToast({ type: 'success', title, message });
  };
  
  const showError = (title: string, message: string) => {
    addToast({ type: 'error', title, message });
  };
  
  const showWarning = (title: string, message: string) => {
    addToast({ type: 'warning', title, message });
  };
  
  const showInfo = (title: string, message: string) => {
    addToast({ type: 'info', title, message });
  };
  
  return {
    toasts,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};