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
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const labelSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  if (variant === 'gradient') {
    return (
      <div className="lyd-loading-spinner-container">
        <div className={`lyd-loading-spinner-gradient ${sizeClasses[size]}`}>
          <div className="lyd-loading-spinner-inner"></div>
        </div>
        {label && (
          <div className={`lyd-loading-spinner-label ${labelSizeClasses[size]}`}>
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
          <div className={`lyd-loading-spinner-label ${labelSizeClasses[size]}`}>
            {label}
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className="lyd-loading-spinner-container">
      <div className={`lyd-loading-spinner-default ${sizeClasses[size]}`}>
        <svg viewBox="0 0 24 24" fill="none">
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
        <div className={`lyd-loading-spinner-label ${labelSizeClasses[size]}`}>
          {label}
        </div>
      )}
    </div>
  );
};