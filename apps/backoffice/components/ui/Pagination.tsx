/**
 * Design System Pagination Component
 * 
 * Based on: /design-system/v2/components/pagination/index.html
 */

import React from 'react';
import { Button } from './Button';

interface PaginationProps {
  /** Current page */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Page change handler */
  onPageChange: (page: number) => void;
  /** Items per page */
  itemsPerPage?: number;
  /** Total items count */
  totalItems?: number;
  /** Show page size selector */
  showPageSize?: boolean;
  /** Page size change handler */
  onPageSizeChange?: (size: number) => void;
  /** Custom className */
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 20,
  totalItems,
  showPageSize = false,
  onPageSizeChange,
  className = ''
}: PaginationProps) {
  const classes = ['lyd-pagination', className].filter(Boolean).join(' ');

  // Calculate visible pages (show max 7 pages)
  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 7;
    
    if (totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages with ellipsis
      if (currentPage <= 4) {
        // Show first pages + ellipsis + last page
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Show first page + ellipsis + last pages
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show first + ellipsis + current-1,current,current+1 + ellipsis + last
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  // Calculate item range
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems || 0);

  return (
    <div className={classes}>
      <div className="lyd-pagination-content">
        {/* Items info */}
        {totalItems && (
          <div className="lyd-pagination-info" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--lyd-text-secondary)' }}>
            {startItem}-{endItem} von {totalItems} Einträgen
          </div>
        )}

        {/* Page controls */}
        <div className="lyd-pagination-controls" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
          {/* Previous button */}
          <Button
            variant="outline"
            size="small"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"/>
            </svg>
            Zurück
          </Button>

          {/* Page numbers */}
          <div className="lyd-pagination-pages" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
            {visiblePages.map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span 
                    className="lyd-pagination-ellipsis"
                    style={{
                      padding: 'var(--spacing-sm)',
                      color: 'var(--lyd-text-secondary)',
                      fontSize: 'var(--font-size-sm)'
                    }}
                  >
                    ...
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => typeof page === 'number' && onPageChange(page)}
                    className={`lyd-pagination-page ${currentPage === page ? 'lyd-pagination-page-active' : ''}`}
                    style={{
                      padding: 'var(--spacing-sm)',
                      border: '1px solid var(--lyd-border)',
                      borderRadius: 'var(--border-radius)',
                      background: currentPage === page ? 'var(--lyd-primary)' : 'white',
                      color: currentPage === page ? 'white' : 'var(--lyd-text)',
                      fontSize: 'var(--font-size-sm)',
                      cursor: 'pointer',
                      minWidth: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-family-primary)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Next button */}
          <Button
            variant="outline"
            size="small"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}
          >
            Weiter
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9,18 15,12 9,6"/>
            </svg>
          </Button>
        </div>

        {/* Page size selector */}
        {showPageSize && onPageSizeChange && (
          <div className="lyd-pagination-size" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--lyd-text-secondary)' }}>
              Pro Seite:
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
              className="lyd-select"
              style={{ width: 'auto', minWidth: '60px' }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// END OF PAGINATION COMPONENT
// ============================================================================
