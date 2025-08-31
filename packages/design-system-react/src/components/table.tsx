import React from 'react';

export interface LdsTableProps {
  children: React.ReactNode;
  className?: string;
  striped?: boolean;
}

export function LdsTable({ children, className = '', striped = false }: LdsTableProps) {
  const baseClasses = 'min-w-full divide-y divide-gray-200';
  const classes = `${baseClasses} ${className}`;
  
  return (
    <div className="overflow-x-auto">
      <table className={classes}>
        {children}
      </table>
    </div>
  );
}

export function LdsTableHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <thead className={`bg-gray-50 ${className}`}>
      {children}
    </thead>
  );
}

export function LdsTableBody({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <tbody className={`bg-white divide-y divide-gray-200 ${className}`}>
      {children}
    </tbody>
  );
}

export function LdsTableRow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <tr className={`hover:bg-gray-50 ${className}`}>
      {children}
    </tr>
  );
}

export function LdsTableHeaderCell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>
      {children}
    </th>
  );
}

export function LdsTableCell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${className}`}>
      {children}
    </td>
  );
}
