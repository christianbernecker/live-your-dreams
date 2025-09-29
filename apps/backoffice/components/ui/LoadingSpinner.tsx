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

  // Default variant - Pure CSS, Hero UI Style
  return (
    <div className="lyd-loading-spinner-container">
      <div 
        className="lyd-loading-spinner-default"
        style={sizeStyles[size]}
      >
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