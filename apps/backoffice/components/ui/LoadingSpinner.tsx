'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  variant?: 'default' | 'gradient' | 'dots';
}

export const LoadingSpinner = ({ 
  size = 'md', 
  label = 'Laden...', 
  variant = 'gradient' 
}: LoadingSpinnerProps) => {
  const sizeStyles = {
    sm: { width: '16px', height: '16px' },
    md: { width: '32px', height: '32px' },
    lg: { width: '48px', height: '48px' }
  };

  const labelSizeStyles = {
    sm: { fontSize: '14px' },
    md: { fontSize: '16px' },
    lg: { fontSize: '18px' }
  };

  if (variant === 'gradient') {
    return (
      <div className="lyd-loading-spinner-container">
        <div 
          className="lyd-loading-spinner-gradient"
          style={sizeStyles[size]}
        >
          <div className="lyd-loading-spinner-inner"></div>
        </div>
        {label && (
          <div 
            className="lyd-loading-spinner-label"
            style={labelSizeStyles[size]}
          >
            {label}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className="lyd-loading-spinner-container">
        <div className="lyd-loading-spinner-dots">
          <div className="lyd-dot"></div>
          <div className="lyd-dot"></div>
          <div className="lyd-dot"></div>
        </div>
        {label && (
          <div 
            className="lyd-loading-spinner-label"
            style={labelSizeStyles[size]}
          >
            {label}
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className="lyd-loading-spinner-container">
      <div 
        className="lyd-loading-spinner-default"
        style={sizeStyles[size]}
      >
        <svg viewBox="0 0 24 24" fill="none" style={{ width: '100%', height: '100%' }}>
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="var(--lyd-line)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="var(--lyd-primary)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="60"
            strokeDashoffset="60"
            className="lyd-loading-spinner-circle"
          />
        </svg>
      </div>
      {label && (
        <div 
          className="lyd-loading-spinner-label"
          style={labelSizeStyles[size]}
        >
          {label}
        </div>
      )}
    </div>
  );
};