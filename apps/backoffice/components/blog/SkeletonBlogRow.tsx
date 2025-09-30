/**
 * Skeleton Loader for Blog Table Row
 */

'use client';

export const SkeletonBlogRow = () => {
  return (
    <tr>
      <td>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
          <div style={{ 
            width: '70%', 
            height: '16px', 
            background: 'var(--lyd-gray-200)', 
            borderRadius: '4px',
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
          <div style={{ 
            width: '50%', 
            height: '12px', 
            background: 'var(--lyd-gray-200)', 
            borderRadius: '4px',
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
        </div>
      </td>
      <td>
        <div style={{ 
          width: '60px', 
          height: '24px', 
          background: 'var(--lyd-gray-200)', 
          borderRadius: '12px',
          animation: 'pulse 1.5s ease-in-out infinite'
        }} />
      </td>
      <td>
        <div style={{ display: 'flex', gap: '4px' }}>
          <div style={{ 
            width: '60px', 
            height: '20px', 
            background: 'var(--lyd-gray-200)', 
            borderRadius: '10px',
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
          <div style={{ 
            width: '60px', 
            height: '20px', 
            background: 'var(--lyd-gray-200)', 
            borderRadius: '10px',
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
        </div>
      </td>
      <td>
        <div style={{ 
          width: '80%', 
          height: '14px', 
          background: 'var(--lyd-gray-200)', 
          borderRadius: '4px',
          animation: 'pulse 1.5s ease-in-out infinite'
        }} />
      </td>
      <td>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
          <div style={{ 
            width: '90%', 
            height: '14px', 
            background: 'var(--lyd-gray-200)', 
            borderRadius: '4px',
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
          <div style={{ 
            width: '70%', 
            height: '12px', 
            background: 'var(--lyd-gray-200)', 
            borderRadius: '4px',
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
        </div>
      </td>
      <td>
        <div style={{ 
          width: '80px', 
          height: '14px', 
          background: 'var(--lyd-gray-200)', 
          borderRadius: '4px',
          animation: 'pulse 1.5s ease-in-out infinite'
        }} />
      </td>
      <td>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            background: 'var(--lyd-gray-200)', 
            borderRadius: '4px',
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
          <div style={{ 
            width: '32px', 
            height: '32px', 
            background: 'var(--lyd-gray-200)', 
            borderRadius: '4px',
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
        </div>
      </td>
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </tr>
  );
};
