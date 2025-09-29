import React from 'react'

// Design System Button Component - SINGLE SOURCE OF TRUTH
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant - matches Design System exactly */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass'
  /** Button size */
  size?: 'small' | 'default' | 'large' | 'icon-only'
  /** Loading state with spinner */
  loading?: boolean
  /** Icon element */
  icon?: React.ReactNode
  /** Full width button */
  fullWidth?: boolean
  /** Children elements */
  children?: React.ReactNode
}

/**
 * LYD Design System Button Component
 * 
 * Based on: /design-system/v2/components/buttons/index.html
 * CSS: /design-system/v2/shared/master.css
 * 
 * Usage:
 * ```tsx
 * <Button variant="secondary" size="large" icon={<Icon />}>
 *   Button Text
 * </Button>
 * ```
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'default', 
  loading = false,
  icon,
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}) => {
  // Build CSS classes following Design System conventions
  const classes = [
    'lyd-button',
    variant,
    size !== 'default' ? size : '',
    loading ? 'loading' : '',
    fullWidth ? 'full-width' : '',
    className
  ].filter(Boolean).join(' ')

  // Fallback styles for button variants
  const getVariantStyles = () => {
    const baseStyle = {
      padding: size === 'small' ? '6px 12px' : size === 'large' ? '12px 24px' : '8px 16px',
      borderRadius: '6px',
      border: 'none',
      fontWeight: '500',
      fontSize: size === 'small' ? '14px' : size === 'large' ? '16px' : '15px',
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s ease',
      opacity: disabled || loading ? 0.6 : 1,
      width: fullWidth ? '100%' : 'auto',
      justifyContent: 'center'
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: 'var(--lyd-primary, #3b82f6)',
          color: 'white'
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: 'var(--lyd-secondary, #f1f5f9)',
          color: 'var(--lyd-text-primary, #1e293b)'
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          color: 'var(--lyd-primary, #3b82f6)',
          border: '1px solid var(--lyd-primary, #3b82f6)'
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          color: 'var(--lyd-text-primary, #1e293b)'
        };
      case 'glass':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          color: 'white',
          backdropFilter: 'blur(10px)'
        };
      default:
        return baseStyle;
    }
  };

  return (
    <button 
      className={classes}
      disabled={disabled || loading}
      style={getVariantStyles()}
      {...props}
    >
      {loading ? (
        // Loading spinner - matches Design System
        <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v4m6.364.636L16.95 8.05M22 12h-4m-.636 6.364L15.95 16.95M12 22v-4m-6.364-.636L7.05 15.95M2 12h4m.636-6.364L7.05 7.05"/>
        </svg>
      ) : icon}
      {children && <span>{children}</span>}
    </button>
  )
}

// Named exports for specific variants - TYPE SAFE
export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => 
  <Button variant="primary" {...props} />

export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => 
  <Button variant="secondary" {...props} />

export const OutlineButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => 
  <Button variant="outline" {...props} />

export const GhostButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => 
  <Button variant="ghost" {...props} />

// Default export
export default Button
