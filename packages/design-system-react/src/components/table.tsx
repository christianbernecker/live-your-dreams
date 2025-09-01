import React from 'react';

export interface LdsTableProps {
  children: React.ReactNode;
  className?: string;
  striped?: boolean;
}

export function LdsTable({ children, className = '', striped = false }: LdsTableProps) {
  const classes = `lds-table ${className}`;
  
  return (
    <div className="lds-table-container">
      <table className={classes}>
        {children}
      </table>
    </div>
  );
}

export function LdsTableHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <thead className={`lds-table-header ${className}`}>
      {children}
    </thead>
  );
}

export function LdsTableBody({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <tbody className={className}>
      {children}
    </tbody>
  );
}

export function LdsTableRow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <tr className={`lds-table-row ${className}`}>
      {children}
    </tr>
  );
}

export function LdsTableHeaderCell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`lds-table-header-cell ${className}`}>
      {children}
    </th>
  );
}

export function LdsTableCell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`lds-table-cell ${className}`}>
      {children}
    </td>
  );
}
