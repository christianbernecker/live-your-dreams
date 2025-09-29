/**
 * Design System Avatar Component
 * 
 * Based on: /design-system/v2/components/avatar/index.html
 */

import Image from 'next/image';

interface AvatarProps {
  /** Avatar size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Image source */
  src?: string;
  /** Alt text for image */
  alt?: string;
  /** Fallback text (usually initials) */
  fallback?: string;
  /** Custom className */
  className?: string;
  /** Online status indicator */
  status?: 'online' | 'offline' | 'away' | 'busy';
}

export function Avatar({
  size = 'md',
  src,
  alt,
  fallback,
  className = '',
  status
}: AvatarProps) {
  // Size mapping with exact pixel values
  const sizeMap = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 56,
    '2xl': 64
  };
  
  const avatarSize = sizeMap[size];
  
  // Status indicator colors
  const statusColors = {
    online: '#10b981', // green
    offline: '#6b7280', // grey
    away: '#f59e0b',   // amber
    busy: '#ef4444'    // red
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} className={className}>
      <div 
        style={{
          width: `${avatarSize}px`,
          height: `${avatarSize}px`,
          borderRadius: '50%',
          backgroundColor: src ? 'transparent' : 'var(--lyd-primary, #3b82f6)',
          color: 'white',
          fontSize: avatarSize < 32 ? '10px' : avatarSize < 40 ? '12px' : avatarSize < 48 ? '14px' : '16px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {src ? (
          <Image
            src={src}
            alt={alt || 'Avatar'}
            width={avatarSize}
            height={avatarSize}
            style={{ 
              borderRadius: '50%', 
              objectFit: 'cover',
              width: '100%',
              height: '100%'
            }}
          />
        ) : (
          <span style={{ textTransform: 'uppercase' }}>
            {fallback || '?'}
          </span>
        )}
      </div>
      
      {status && (
        <div 
          style={{
            position: 'absolute',
            bottom: '0px',
            right: '0px',
            width: `${Math.max(8, avatarSize * 0.3)}px`,
            height: `${Math.max(8, avatarSize * 0.3)}px`,
            borderRadius: '50%',
            border: '2px solid white',
            backgroundColor: statusColors[status] || statusColors.offline,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
        />
      )}
    </div>
  );
}
