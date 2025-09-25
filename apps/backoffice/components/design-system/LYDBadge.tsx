/**
 * LYD Badge Component - 100% Design System konform
 * Nutzt master.css Klassen von https://designsystem.liveyourdreams.online
 */

import React from 'react';

export interface LYDBadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'default' | 'large';
  outline?: boolean;
  pill?: boolean;
  dot?: boolean;
  count?: number;
  showZero?: boolean;
  max?: number;
  className?: string;
  onClick?: () => void;
}

export const LYDBadge: React.FC<LYDBadgeProps> = ({
  children,
  variant = 'default',
  size = 'default',
  outline = false,
  pill = false,
  dot = false,
  count,
  showZero = false,
  max = 99,
  className = '',
  onClick
}) => {
  // Design System Klassen
  const badgeClasses = ['lyd-badge'];
  
  // Variant Klassen
  badgeClasses.push(`lyd-badge-${variant}`);
  
  // Size Klassen
  if (size !== 'default') {
    badgeClasses.push(`lyd-badge-${size}`);
  }
  
  // Style Modifiers
  if (outline) {
    badgeClasses.push('lyd-badge-outline');
  }
  
  if (pill) {
    badgeClasses.push('lyd-badge-pill');
  }
  
  if (dot) {
    badgeClasses.push('lyd-badge-dot');
  }
  
  if (onClick) {
    badgeClasses.push('lyd-badge-clickable');
  }
  
  if (className) {
    badgeClasses.push(className);
  }

  // Count logic
  const displayCount = count !== undefined ? (count > max ? `${max}+` : count.toString()) : null;
  const shouldShow = count !== undefined && (count > 0 || showZero);

  const badgeContent = dot ? null : (displayCount || children);

  if (count !== undefined && !shouldShow && !showZero) {
    return <>{children}</>;
  }

  const BadgeElement = onClick ? 'button' : 'span';

  return (
    <BadgeElement 
      className={badgeClasses.join(' ')}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
    >
      {badgeContent}
    </BadgeElement>
  );
};

// Status Badge - Specialized variant for status indicators
export interface LYDStatusBadgeProps {
  status: 'published' | 'draft' | 'archived' | 'active' | 'inactive' | 'pending' | 'approved' | 'rejected';
  size?: 'small' | 'default' | 'large';
  className?: string;
}

export const LYDStatusBadge: React.FC<LYDStatusBadgeProps> = ({
  status,
  size = 'default',
  className = ''
}) => {
  const statusConfig = {
    published: { variant: 'success' as const, label: 'Veröffentlicht' },
    draft: { variant: 'warning' as const, label: 'Entwurf' },
    archived: { variant: 'default' as const, label: 'Archiviert' },
    active: { variant: 'success' as const, label: 'Aktiv' },
    inactive: { variant: 'default' as const, label: 'Inaktiv' },
    pending: { variant: 'warning' as const, label: 'Wartend' },
    approved: { variant: 'success' as const, label: 'Genehmigt' },
    rejected: { variant: 'error' as const, label: 'Abgelehnt' }
  };

  const config = statusConfig[status];

  return (
    <LYDBadge
      variant={config.variant}
      size={size}
      className={`lyd-status-badge lyd-status-${status} ${className}`}
    >
      {config.label}
    </LYDBadge>
  );
};

// Count Badge - For notification counts
export interface LYDCountBadgeProps {
  count: number;
  max?: number;
  showZero?: boolean;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const LYDCountBadge: React.FC<LYDCountBadgeProps> = ({
  count,
  max = 99,
  showZero = false,
  dot = false,
  children,
  className = ''
}) => {
  return (
    <div className={`lyd-count-badge-wrapper ${className}`}>
      {children}
      <LYDBadge
        variant="error"
        size="small"
        count={count}
        max={max}
        showZero={showZero}
        dot={dot}
        className="lyd-count-badge-indicator"
      >
        {/* Count Badge Content */}
      </LYDBadge>
    </div>
  );
};

export default LYDBadge;
