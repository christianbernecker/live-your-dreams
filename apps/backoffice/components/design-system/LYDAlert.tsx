/**
 * LYD Alert Component - 100% Design System konform
 * Nutzt master.css Klassen von https://designsystem.liveyourdreams.online
 */

import { AlertIcon, CheckIcon, InfoIcon, XIcon } from '@/components/icons/LYDIcons';
import React, { useState } from 'react';

export interface LYDAlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message?: string;
  children?: React.ReactNode;
  closable?: boolean;
  onClose?: () => void;
  showIcon?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  size?: 'small' | 'default' | 'large';
}

export const LYDAlert: React.FC<LYDAlertProps> = ({
  type = 'info',
  title,
  message,
  children,
  closable = false,
  onClose,
  showIcon = true,
  action,
  className = '',
  size = 'default'
}) => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckIcon size="default" />;
      case 'error':
        return <XIcon size="default" />;
      case 'warning':
        return <AlertIcon size="default" />;
      case 'info':
      default:
        return <InfoIcon size="default" />;
    }
  };

  // Design System Klassen
  const alertClasses = ['lyd-alert', `lyd-alert-${type}`];
  
  if (size !== 'default') {
    alertClasses.push(`lyd-alert-${size}`);
  }
  
  if (showIcon) {
    alertClasses.push('lyd-alert-with-icon');
  }
  
  if (className) {
    alertClasses.push(className);
  }

  return (
    <div className={alertClasses.join(' ')} role="alert">
      {showIcon && (
        <div className={`lyd-alert-icon lyd-alert-icon-${type}`}>
          {getIcon()}
        </div>
      )}
      
      <div className="lyd-alert-content">
        {title && (
          <div className="lyd-alert-title">{title}</div>
        )}
        
        {message && (
          <div className="lyd-alert-message">{message}</div>
        )}
        
        {children && (
          <div className="lyd-alert-description">
            {children}
          </div>
        )}
        
        {action && (
          <div className="lyd-alert-action">
            <button
              className="lyd-alert-action-btn"
              onClick={action.onClick}
            >
              {action.label}
            </button>
          </div>
        )}
      </div>
      
      {closable && (
        <button
          className="lyd-alert-close-btn"
          onClick={handleClose}
          aria-label="Alert schließen"
        >
          <XIcon size="sm" />
        </button>
      )}
    </div>
  );
};

// Banner Alert - Full width variant
export interface LYDBannerAlertProps extends LYDAlertProps {
  banner?: boolean;
}

export const LYDBannerAlert: React.FC<LYDBannerAlertProps> = (props) => {
  return (
    <LYDAlert
      {...props}
      className={`lyd-alert-banner ${props.className || ''}`}
    />
  );
};

export default LYDAlert;

