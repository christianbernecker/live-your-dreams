import clsx from "clsx";
import * as React from "react";
import "./badge.css";

// ============================================================================
// BADGE COMPONENT - DESIGN SYSTEM COMPLIANT
// ============================================================================

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Badge variant */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  /** Badge size */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Badge content */
  children: React.ReactNode;
  /** Leading icon */
  icon?: React.ReactNode;
  /** Removable badge with close button */
  removable?: boolean;
  /** Remove handler */
  onRemove?: () => void;
}

/**
 * Badge Component - Uses .luxury-badge from Design System
 * 
 * Based on the luxury-badge class found in master.css
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ 
    variant = 'secondary', 
    size = 'md', 
    children, 
    icon, 
    removable = false, 
    onRemove,
    className, 
    ...props 
  }, ref) => {
    
    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      onRemove?.();
    };

    return (
      <span
        ref={ref}
        className={clsx(
          "luxury-badge", // Uses existing .luxury-badge from master.css
          `badge--${variant}`,
          `badge--${size}`,
          removable && "badge--removable",
          className
        )}
        {...props}
      >
        {icon && (
          <span className="badge__icon">
            {icon}
          </span>
        )}
        
        <span className="badge__content">
          {children}
        </span>
        
        {removable && onRemove && (
          <button
            type="button"
            className="badge__remove"
            onClick={handleRemove}
            aria-label="Remove badge"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = "Badge";

// ============================================================================
// CONVENIENCE COMPONENTS
// ============================================================================

export const StatusBadge: React.FC<Omit<BadgeProps, 'variant'> & { 
  status: 'active' | 'inactive' | 'pending' | 'error' 
}> = ({ status, ...props }) => {
  const variantMap = {
    active: 'success' as const,
    inactive: 'secondary' as const,
    pending: 'warning' as const,
    error: 'error' as const
  };
  
  return <Badge variant={variantMap[status]} {...props} />;
};

export const RoleBadge: React.FC<Omit<BadgeProps, 'variant'>> = (props) => (
  <Badge variant="primary" size="sm" {...props} />
);

