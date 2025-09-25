/**
 * LYD Progress Component - 100% Design System konform
 * Nutzt master.css Klassen von https://designsystem.liveyourdreams.online
 */

import React from 'react';

export interface LYDProgressProps {
  value: number;
  max?: number;
  size?: 'small' | 'default' | 'large';
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  label?: string;
  format?: (value: number, max: number) => string;
  className?: string;
  animated?: boolean;
  striped?: boolean;
}

export const LYDProgress: React.FC<LYDProgressProps> = ({
  value,
  max = 100,
  size = 'default',
  variant = 'primary',
  showLabel = true,
  label,
  format,
  className = '',
  animated = false,
  striped = false
}) => {
  // Ensure value is within bounds
  const clampedValue = Math.max(0, Math.min(value, max));
  const percentage = (clampedValue / max) * 100;

  // Design System Klassen
  const progressClasses = ['lyd-progress'];
  
  if (size !== 'default') {
    progressClasses.push(`lyd-progress-${size}`);
  }
  
  if (className) {
    progressClasses.push(className);
  }

  const barClasses = ['lyd-progress-bar', `lyd-progress-bar-${variant}`];
  
  if (animated) {
    barClasses.push('lyd-progress-bar-animated');
  }
  
  if (striped) {
    barClasses.push('lyd-progress-bar-striped');
  }

  // Format label
  const displayLabel = format 
    ? format(clampedValue, max)
    : label || `${Math.round(percentage)}%`;

  return (
    <div className="lyd-progress-wrapper">
      {showLabel && (
        <div className="lyd-progress-label">
          <span className="lyd-progress-label-text">{displayLabel}</span>
          <span className="lyd-progress-label-value">{clampedValue}/{max}</span>
        </div>
      )}
      
      <div className={progressClasses.join(' ')} role="progressbar" aria-valuenow={clampedValue} aria-valuemin={0} aria-valuemax={max}>
        <div 
          className={barClasses.join(' ')}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Circle Progress - Circular progress indicator
export interface LYDCircleProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  format?: (value: number, max: number) => string;
  className?: string;
}

export const LYDCircleProgress: React.FC<LYDCircleProgressProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  variant = 'primary',
  showLabel = true,
  format,
  className = ''
}) => {
  const clampedValue = Math.max(0, Math.min(value, max));
  const percentage = (clampedValue / max) * 100;
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const displayLabel = format 
    ? format(clampedValue, max)
    : `${Math.round(percentage)}%`;

  return (
    <div className={`lyd-circle-progress ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="lyd-circle-progress-svg">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--lyd-gray-200)"
          strokeWidth={strokeWidth}
          className="lyd-circle-progress-track"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`var(--lyd-${variant === 'default' ? 'primary' : variant})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`lyd-circle-progress-bar lyd-circle-progress-bar-${variant}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      
      {showLabel && (
        <div className="lyd-circle-progress-label">
          {displayLabel}
        </div>
      )}
    </div>
  );
};

// Steps Progress - Multi-step progress indicator
export interface Step {
  title: string;
  description?: string;
  status: 'pending' | 'active' | 'completed' | 'error';
}

export interface LYDStepsProgressProps {
  steps: Step[];
  current: number;
  direction?: 'horizontal' | 'vertical';
  size?: 'small' | 'default';
  className?: string;
}

export const LYDStepsProgress: React.FC<LYDStepsProgressProps> = ({
  steps,
  current,
  direction = 'horizontal',
  size = 'default',
  className = ''
}) => {
  return (
    <div className={`lyd-steps-progress lyd-steps-${direction} lyd-steps-${size} ${className}`}>
      {steps.map((step, index) => {
        const isActive = index === current;
        const isCompleted = index < current;
        const isError = step.status === 'error';
        
        const stepClasses = ['lyd-step'];
        
        if (isActive) stepClasses.push('lyd-step-active');
        if (isCompleted) stepClasses.push('lyd-step-completed');
        if (isError) stepClasses.push('lyd-step-error');

        return (
          <div key={index} className={stepClasses.join(' ')}>
            <div className="lyd-step-indicator">
              <div className="lyd-step-number">
                {isCompleted ? '✓' : index + 1}
              </div>
            </div>
            
            <div className="lyd-step-content">
              <div className="lyd-step-title">{step.title}</div>
              {step.description && (
                <div className="lyd-step-description">{step.description}</div>
              )}
            </div>
            
            {index < steps.length - 1 && (
              <div className="lyd-step-separator" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LYDProgress;

