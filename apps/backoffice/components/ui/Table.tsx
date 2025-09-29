/**
 * Design System Table Component
 * 
 * Provides styled table functionality following the LYD Design System
 */

import React from 'react';

// ============================================================================
// TABLE COMPONENTS
// ============================================================================

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
  variant?: 'default' | 'striped' | 'bordered';
  size?: 'small' | 'default' | 'large';
}

export function Table({ 
  children, 
  variant = 'default', 
  size = 'default',
  className = '',
  ...props 
}: TableProps) {
  const variantClass = variant !== 'default' ? `lyd-table-${variant}` : '';
  const sizeClass = size !== 'default' ? `lyd-table-${size}` : '';
  const classes = ['lyd-table', variantClass, sizeClass, className]
    .filter(Boolean)
    .join(' ');

  // Enhanced table styling with fallbacks
  const getTableStyles = () => {
    const baseStyle = {
      width: '100%',
      borderCollapse: 'collapse' as const,
      fontSize: '14px',
      lineHeight: '1.5'
    };

    return baseStyle;
  };

  const getContainerStyles = () => {
    return {
      overflow: 'auto',
      borderRadius: 'var(--border-radius-lg, 8px)',
      border: '1px solid var(--lyd-gray-200, #e5e7eb)',
      backgroundColor: 'white'
    };
  };

  return (
    <div 
      className="lyd-table-container" 
      style={getContainerStyles()}
    >
      <table 
        className={classes} 
        style={{
          ...getTableStyles(),
          // Inline striped styling for reliable rendering
          ...(variant === 'striped' && {
            '--stripe-bg': 'var(--lyd-gray-25, #fafbfc)',
            '--hover-bg': 'var(--lyd-gray-50, #f9fafb)'
          })
        }}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export function TableHeader({ children, className = '', ...props }: TableHeaderProps) {
  return (
    <thead className={`lyd-table-header ${className}`} {...props}>
      {children}
    </thead>
  );
}

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export function TableBody({ children, className = '', ...props }: TableBodyProps) {
  return (
    <tbody className={`lyd-table-body ${className}`} {...props}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child) && child.type === TableRow) {
          // Add striped styling to every even row
          const isEven = index % 2 === 1; // 0-indexed, so second row (index 1) is "even"
          return React.cloneElement(child as React.ReactElement<any>, {
            style: {
              ...child.props.style,
              backgroundColor: isEven ? 'var(--lyd-gray-25, #fafbfc)' : 'transparent'
            },
            onMouseEnter: (e: React.MouseEvent<HTMLTableRowElement>) => {
              (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'var(--lyd-gray-50, #f9fafb)';
              child.props.onMouseEnter?.(e);
            },
            onMouseLeave: (e: React.MouseEvent<HTMLTableRowElement>) => {
              (e.currentTarget as HTMLTableRowElement).style.backgroundColor = isEven ? 'var(--lyd-gray-25, #fafbfc)' : 'transparent';
              child.props.onMouseLeave?.(e);
            }
          });
        }
        return child;
      })}
    </tbody>
  );
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
  variant?: 'default' | 'hover' | 'selected';
}

export function TableRow({ 
  children, 
  variant = 'default',
  className = '', 
  ...props 
}: TableRowProps) {
  const variantClass = variant !== 'default' ? `lyd-table-row-${variant}` : '';
  const classes = ['lyd-table-row', variantClass, className]
    .filter(Boolean)
    .join(' ');

  // Fallback styles for better striping and hover
  const getRowStyles = () => {
    const baseStyle = {
      transition: 'all 0.15s ease'
    };

    if (variant === 'hover') {
      return {
        ...baseStyle,
        backgroundColor: 'var(--lyd-gray-50, #f9fafb)'
      };
    }
    
    if (variant === 'selected') {
      return {
        ...baseStyle,
        backgroundColor: 'var(--lyd-primary-50, #eff6ff)',
        borderLeft: '3px solid var(--lyd-primary, #3b82f6)'
      };
    }

    return baseStyle;
  };

  return (
    <tr 
      className={classes} 
      style={getRowStyles()}
      {...props}
    >
      {children}
    </tr>
  );
}

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  variant?: 'default' | 'header' | 'numeric' | 'actions';
  width?: string;
}

export function TableCell({ 
  children, 
  variant = 'default',
  width,
  className = '', 
  ...props 
}: TableCellProps) {
  const variantClass = variant !== 'default' ? `lyd-table-cell-${variant}` : '';
  const classes = ['lyd-table-cell', variantClass, className]
    .filter(Boolean)
    .join(' ');

  const style = {
    ...(width && { width }),
    ...props.style
  };

  return (
    <td className={classes} style={style} {...props}>
      {children}
    </td>
  );
}

interface TableHeaderCellProps extends React.ThHTMLAttributes<HTMLTableHeaderCellElement> {
  children: React.ReactNode;
  sortable?: boolean;
  sorted?: 'asc' | 'desc';
  onSort?: () => void;
  width?: string;
}

export function TableHeaderCell({ 
  children, 
  sortable = false,
  sorted,
  onSort,
  width,
  className = '', 
  ...props 
}: TableHeaderCellProps) {
  const classes = [
    'lyd-table-header-cell',
    sortable ? 'lyd-table-sortable' : '',
    sorted ? `lyd-table-sorted-${sorted}` : '',
    className
  ].filter(Boolean).join(' ');

  const style = {
    ...(width && { width }),
    ...props.style
  };

  const handleClick = () => {
    if (sortable && onSort) {
      onSort();
    }
  };

  return (
    <th 
      className={classes} 
      style={style}
      onClick={handleClick}
      {...props}
    >
      <div className="lyd-table-header-content">
        {children}
        {sortable && (
          <span className="lyd-table-sort-icon">
            {sorted === 'asc' ? '↑' : sorted === 'desc' ? '↓' : '↕'}
          </span>
        )}
      </div>
    </th>
  );
}

// ============================================================================
// TABLE UTILITIES
// ============================================================================

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function TableEmptyState({ 
  title = 'Keine Daten vorhanden',
  description = 'Es wurden keine Einträge gefunden.',
  action
}: EmptyStateProps) {
  return (
    <TableRow>
      <TableCell 
        colSpan={999}
        style={{ 
          textAlign: 'center', 
          padding: 'var(--spacing-xl)',
          color: 'var(--lyd-text-secondary)'
        }}
      >
        <div className="lyd-stack center">
          <div style={{ fontSize: '3rem', opacity: 0.5 }}>📭</div>
          <h3 className="lyd-heading-3">{title}</h3>
          <p className="lyd-text-secondary">{description}</p>
          {action && (
            <div style={{ marginTop: 'var(--spacing-md)' }}>
              {action}
            </div>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

interface LoadingStateProps {
  rows?: number;
  columns?: number;
}

export function TableLoadingState({ rows = 5, columns = 4 }: LoadingStateProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: columns }).map((_, j) => (
            <TableCell key={j}>
              <div 
                style={{
                  height: 'var(--spacing-md, 16px)',
                  width: j === 0 ? '60%' : j === columns - 1 ? '40%' : '80%',
                  backgroundColor: 'var(--lyd-gray-100, #f3f4f6)',
                  borderRadius: 'var(--radius-sm, 4px)',
                  animation: 'pulse 1.5s ease-in-out infinite',
                  opacity: 0.7 - (j * 0.1)
                }}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </>
  );
}
