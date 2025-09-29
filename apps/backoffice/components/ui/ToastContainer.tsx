'use client';

import { Toast, useToast } from './Toast';

export const ToastContainer = () => {
  const { toasts } = useToast();
  
  if (toasts.length === 0) return null;
  
  return (
    <div className="lyd-toast-container">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};
