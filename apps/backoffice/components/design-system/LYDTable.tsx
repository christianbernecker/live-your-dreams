/**
 * LYD Table Component - 100% Design System konform
 * Nutzt master.css Klassen von https://designsystem.liveyourdreams.online
 */

import { FilterIcon, SortIcon } from '@/components/icons/LYDIcons';
import React, { useState } from 'react';

export interface TableColumn<T = any> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export interface LYDTableProps<T = any> {
  columns: TableColumn<T>[];
  dataSource: T[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  sortable?: boolean;
  filterable?: boolean;
  selectable?: boolean;
  selectedRows?: string[];
  onSelectChange?: (selectedRows: string[]) => void;
  rowKey?: keyof T | ((record: T) => string);
  className?: string;
  size?: 'small' | 'default' | 'large';
  bordered?: boolean;
  striped?: boolean;
}

export const LYDTable = <T extends Record<string, any>>({
  columns,
  dataSource,
  loading = false,
  pagination,
  sortable = true,
  filterable = true,
  selectable = false,
  selectedRows = [],
  onSelectChange,
  rowKey = 'id',
  className = '',
  size = 'default',
  bordered = true,
  striped = true
}: LYDTableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc' | null;
  }>({ key: '', direction: null });

  // Design System Klassen
  const tableClasses = ['lyd-table'];
  
  if (size !== 'default') {
    tableClasses.push(`lyd-table-${size}`);
  }
  
  if (bordered) {
    tableClasses.push('lyd-table-bordered');
  }
  
  if (striped) {
    tableClasses.push('lyd-table-striped');
  }
  
  if (loading) {
    tableClasses.push('lyd-table-loading');
  }
  
  if (className) {
    tableClasses.push(className);
  }

  // Get row key
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return String(record[rowKey] || index);
  };

  // Handle sorting
  const handleSort = (columnKey: string) => {
    if (!sortable) return;

    let direction: 'asc' | 'desc' | null = 'asc';
    
    if (sortConfig.key === columnKey) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      }
    }
    
    setSortConfig({ key: columnKey, direction });
  };

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortConfig.direction) return dataSource;
    
    return [...dataSource].sort((a, b) => {
      const column = columns.find(col => col.key === sortConfig.key);
      if (!column) return 0;
      
      const aValue = column.dataIndex ? a[column.dataIndex] : a[sortConfig.key];
      const bValue = column.dataIndex ? b[column.dataIndex] : b[sortConfig.key];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [dataSource, sortConfig, columns]);

  // Handle row selection
  const handleSelectAll = (checked: boolean) => {
    if (!onSelectChange) return;
    
    if (checked) {
      const allKeys = sortedData.map((record, index) => getRowKey(record, index));
      onSelectChange(allKeys);
    } else {
      onSelectChange([]);
    }
  };

  const handleRowSelect = (recordKey: string, checked: boolean) => {
    if (!onSelectChange) return;
    
    if (checked) {
      onSelectChange([...selectedRows, recordKey]);
    } else {
      onSelectChange(selectedRows.filter(key => key !== recordKey));
    }
  };

  const isAllSelected = selectable && sortedData.length > 0 && 
    sortedData.every((record, index) => selectedRows.includes(getRowKey(record, index)));

  const isSomeSelected = selectable && selectedRows.length > 0 && !isAllSelected;

  return (
    <div className="lyd-table-wrapper">
      <table className={tableClasses.join(' ')}>
        <thead className="lyd-table-thead">
          <tr className="lyd-table-row">
            {selectable && (
              <th className="lyd-table-cell lyd-table-selection-cell">
                <input
                  type="checkbox"
                  className="lyd-checkbox-input"
                  checked={isAllSelected}
                  ref={input => {
                    if (input) input.indeterminate = isSomeSelected;
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
            )}
            
            {columns.map((column) => (
              <th
                key={column.key}
                className={`lyd-table-cell lyd-table-header-cell ${column.className || ''}`}
                style={{
                  width: column.width,
                  textAlign: column.align || 'left'
                }}
              >
                <div className="lyd-table-header-content">
                  <span className="lyd-table-header-title">{column.title}</span>
                  
                  {column.sortable !== false && sortable && (
                    <button
                      className={`lyd-table-sort-btn ${
                        sortConfig.key === column.key ? 'lyd-table-sort-active' : ''
                      }`}
                      onClick={() => handleSort(column.key)}
                    >
                      <SortIcon size="sm" />
                    </button>
                  )}
                  
                  {column.filterable !== false && filterable && (
                    <button className="lyd-table-filter-btn">
                      <FilterIcon size="sm" />
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody className="lyd-table-tbody">
          {loading ? (
            <tr>
              <td 
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="lyd-table-loading-cell"
              >
                <div className="lyd-table-loading-content">
                  <div className="luxury-spinner" />
                  <span>Lade Daten...</span>
                </div>
              </td>
            </tr>
          ) : sortedData.length === 0 ? (
            <tr>
              <td 
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="lyd-table-empty-cell"
              >
                <div className="lyd-table-empty-content">
                  <span>Keine Daten vorhanden</span>
                </div>
              </td>
            </tr>
          ) : (
            sortedData.map((record, index) => {
              const recordKey = getRowKey(record, index);
              const isSelected = selectedRows.includes(recordKey);
              
              return (
                <tr
                  key={recordKey}
                  className={`lyd-table-row ${isSelected ? 'lyd-table-row-selected' : ''}`}
                >
                  {selectable && (
                    <td className="lyd-table-cell lyd-table-selection-cell">
                      <input
                        type="checkbox"
                        className="lyd-checkbox-input"
                        checked={isSelected}
                        onChange={(e) => handleRowSelect(recordKey, e.target.checked)}
                      />
                    </td>
                  )}
                  
                  {columns.map((column) => {
                    const value = column.dataIndex ? record[column.dataIndex] : record[column.key];
                    const content = column.render ? column.render(value, record, index) : value;
                    
                    return (
                      <td
                        key={column.key}
                        className={`lyd-table-cell ${column.className || ''}`}
                        style={{ textAlign: column.align || 'left' }}
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      
      {pagination && (
        <div className="lyd-table-pagination">
          {/* Pagination implementation would go here */}
          <div className="lyd-pagination">
            <span>
              Zeige {((pagination.current - 1) * pagination.pageSize) + 1} - {Math.min(pagination.current * pagination.pageSize, pagination.total)} von {pagination.total} Einträgen
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LYDTable;

