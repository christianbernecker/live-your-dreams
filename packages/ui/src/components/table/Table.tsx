import clsx from "clsx";
import * as React from "react";
import "./table.css";

// ============================================================================
// TABLE COMPONENT - DESIGN SYSTEM COMPLIANT
// ============================================================================

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  /** Table variant */
  variant?: 'default' | 'striped' | 'bordered';
  /** Table size */
  size?: 'sm' | 'md' | 'lg';
  /** Table data */
  children: React.ReactNode;
}

export interface TableContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
  /** Row variant */
  variant?: 'default' | 'hover' | 'selected';
}

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  /** Cell variant */
  variant?: 'default' | 'numeric' | 'action';
}

export interface TableHeaderCellProps extends React.ThHTMLAttributes<HTMLTableHeaderCellElement> {
  children: React.ReactNode;
  /** Enable sorting */
  sortable?: boolean;
  /** Current sort direction */
  sortDirection?: 'asc' | 'desc' | null;
  /** Sort handler */
  onSort?: () => void;
}

// ============================================================================
// TABLE COMPONENTS
// ============================================================================

/**
 * TableContainer - Wrapper with scrolling and styling
 */
export const TableContainer = React.forwardRef<HTMLDivElement, TableContainerProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx("lyd-table-container", className)}
      {...props}
    >
      {children}
    </div>
  )
);

/**
 * Main Table Component - Uses .api-table from Design System
 */
export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ variant = 'default', size = 'md', children, className, ...props }, ref) => (
    <table
      ref={ref}
      className={clsx(
        "api-table", // Uses existing .api-table from master.css
        variant !== 'default' && `api-table--${variant}`,
        size !== 'md' && `api-table--${size}`,
        className
      )}
      {...props}
    >
      {children}
    </table>
  )
);

/**
 * Table Header
 */
export const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ children, className, ...props }, ref) => (
    <thead
      ref={ref}
      className={clsx("api-table__header", className)}
      {...props}
    >
      {children}
    </thead>
  )
);

/**
 * Table Body
 */
export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ children, className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={clsx("api-table__body", className)}
      {...props}
    >
      {children}
    </tbody>
  )
);

/**
 * Table Row
 */
export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ variant = 'default', children, className, ...props }, ref) => (
    <tr
      ref={ref}
      className={clsx(
        "api-table__row",
        variant !== 'default' && `api-table__row--${variant}`,
        className
      )}
      {...props}
    >
      {children}
    </tr>
  )
);

/**
 * Table Cell
 */
export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ variant = 'default', children, className, ...props }, ref) => (
    <td
      ref={ref}
      className={clsx(
        "api-table__cell",
        variant !== 'default' && `api-table__cell--${variant}`,
        className
      )}
      {...props}
    >
      {children}
    </td>
  )
);

/**
 * Table Header Cell
 */
export const TableHeaderCell = React.forwardRef<HTMLTableHeaderCellElement, TableHeaderCellProps>(
  ({ sortable = false, sortDirection, onSort, children, className, ...props }, ref) => (
    <th
      ref={ref}
      className={clsx(
        "api-table__header-cell",
        sortable && "api-table__header-cell--sortable",
        sortDirection && `api-table__header-cell--sorted-${sortDirection}`,
        className
      )}
      onClick={sortable ? onSort : undefined}
      style={{ cursor: sortable ? 'pointer' : 'default' }}
      {...props}
    >
      <div className="api-table__header-content">
        {children}
        {sortable && (
          <span className="api-table__sort-icon">
            {sortDirection === 'asc' ? '↑' : sortDirection === 'desc' ? '↓' : '↕'}
          </span>
        )}
      </div>
    </th>
  )
);

// Set display names for better debugging
TableContainer.displayName = "TableContainer";
Table.displayName = "Table";
TableHeader.displayName = "TableHeader";
TableBody.displayName = "TableBody";
TableRow.displayName = "TableRow";
TableCell.displayName = "TableCell";
TableHeaderCell.displayName = "TableHeaderCell";

