/**
 * LYD Blog System v1.1 - Dashboard Overview
 * Multi-Platform Blog mit KI Import Support
 * Basierend auf technischem Briefing v1.0
 */

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: 'DRAFT' | 'REVIEW' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED' | 'REJECTED';
  platforms: ('WOHNEN' | 'MAKLER' | 'ENERGIE')[];
  category: string;
  subcategory?: string;
  tags: string[];
  featuredImageUrl?: string;
  publishedAt?: string;
  scheduledFor?: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  importSource?: string;
  importModel?: string;
}

interface BlogStats {
  total: number;
  draft: number;
  review: number;
  scheduled: number;
  published: number;
  archived: number;
  rejected: number;
}

interface FilterState {
  status: string;
  platforms: string[];
  categories: string[];
  authors: string[];
  dateRange: 'all' | '7days' | '30days' | '90days';
  search: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function BlogDashboard() {
  const { data: session } = useSession();
  
  // State Management
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [stats, setStats] = useState<BlogStats>({
    total: 0,
    draft: 0,
    review: 0,
    scheduled: 0,
    published: 0,
    archived: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    platforms: [],
    categories: [],
    authors: [],
    dateRange: 'all',
    search: ''
  });

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  const fetchBlogPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (filters.status !== 'all') queryParams.append('status', filters.status);
      if (filters.platforms.length > 0) queryParams.append('platforms', filters.platforms.join(','));
      if (filters.categories.length > 0) queryParams.append('categories', filters.categories.join(','));
      if (filters.authors.length > 0) queryParams.append('authors', filters.authors.join(','));
      if (filters.dateRange !== 'all') queryParams.append('dateRange', filters.dateRange);
      if (filters.search) queryParams.append('search', filters.search);

      const response = await fetch(`/api/blog?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setBlogPosts(data.posts || []);
      setStats(data.stats || stats);
      
    } catch (error) {
      console.error('Blog fetch error:', error);
      setError(error instanceof Error ? error.message : 'Failed to load blog posts');
      setBlogPosts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBlogPosts();
  }, [fetchBlogPosts]);

  // ============================================================================
  // FILTER HANDLERS
  // ============================================================================

  const handleFilterChange = useCallback((key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      status: 'all',
      platforms: [],
      categories: [],
      authors: [],
      dateRange: 'all',
      search: ''
    });
  }, []);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const platformFilterOptions = useMemo(() => [
    { value: 'WOHNEN', label: 'LYD Wohnen', color: '#10b981' },
    { value: 'MAKLER', label: 'LYD Makler', color: '#3b82f6' },
    { value: 'ENERGIE', label: 'LYD Energie', color: '#f59e0b' }
  ], []);

  const statusFilterOptions = useMemo(() => [
    { value: 'all', label: 'Alle Status' },
    { value: 'DRAFT', label: 'Entwurf', color: '#6b7280' },
    { value: 'REVIEW', label: 'Review', color: '#f59e0b' },
    { value: 'SCHEDULED', label: 'Geplant', color: '#3b82f6' },
    { value: 'PUBLISHED', label: 'Veröffentlicht', color: '#10b981' },
    { value: 'ARCHIVED', label: 'Archiviert', color: '#6b7280' },
    { value: 'REJECTED', label: 'Abgelehnt', color: '#ef4444' }
  ], []);

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderPlatformBadges = (platforms: string[]) => (
    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
      {platforms.map(platform => {
        const option = platformFilterOptions.find(opt => opt.value === platform);
        return (
          <span
            key={platform}
            className="lyd-badge secondary"
            style={{
              backgroundColor: option?.color + '20',
              color: option?.color,
              border: `1px solid ${option?.color}40`
            }}
          >
            {option?.label || platform}
          </span>
        );
      })}
    </div>
  );

  const renderStatusBadge = (status: string) => {
    const option = statusFilterOptions.find(opt => opt.value === status);
    return (
      <span
        className="lyd-badge"
        style={{
          backgroundColor: option?.color + '20',
          color: option?.color,
          border: `1px solid ${option?.color}40`
        }}
      >
        {option?.label || status}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (!session) {
    return (
      <div className="lyd-card">
        <div className="lyd-card-body">
          <p>Authentifizierung erforderlich</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      
      {/* ============================================================================
          STATISTIK CARDS
          ============================================================================ */}
      <div className="lyd-card">
        <div className="lyd-card-header">
          <h1 className="lyd-heading-1">Multi-Platform Blog</h1>
          <p className="lyd-text-secondary">Content Management für LYD Wohnen, Makler und Energie</p>
        </div>
        <div className="lyd-card-body">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: 'var(--spacing-lg)' 
          }}>
            <div className="lyd-stat-card">
              <div className="lyd-stat-value">{stats.total}</div>
              <div className="lyd-stat-label">Artikel gesamt</div>
            </div>
            <div className="lyd-stat-card">
              <div className="lyd-stat-value" style={{ color: 'var(--lyd-success)' }}>{stats.published}</div>
              <div className="lyd-stat-label">Veröffentlicht</div>
            </div>
            <div className="lyd-stat-card">
              <div className="lyd-stat-value" style={{ color: 'var(--lyd-warning)' }}>{stats.draft}</div>
              <div className="lyd-stat-label">Entwürfe</div>
            </div>
            <div className="lyd-stat-card">
              <div className="lyd-stat-value" style={{ color: 'var(--lyd-info)' }}>{stats.scheduled}</div>
              <div className="lyd-stat-label">Geplant</div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================================
          FILTER & ACTIONS
          ============================================================================ */}
      <div className="lyd-card">
        <div className="lyd-card-header">
          <h2 className="lyd-heading-2">Filter & Aktionen</h2>
          <p className="lyd-text-secondary">Durchsuchen und filtern Sie Ihre Blog-Artikel</p>
        </div>
        <div className="lyd-card-body">
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr auto auto',
            gap: 'var(--spacing-md)',
            alignItems: 'center',
            marginBottom: 'var(--spacing-lg)'
          }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="lyd-input"
                placeholder="Artikel suchen..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
              <svg 
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '16px',
                  height: '16px',
                  color: 'var(--lyd-gray-400)'
                }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Reset Filters Button */}
            <button
              className="lyd-button outline"
              onClick={resetFilters}
              type="button"
            >
              Filter zurücksetzen
            </button>

            {/* Import Button */}
            <button
              className="lyd-button primary"
              onClick={() => window.location.href = '/dashboard/blog/import'}
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              KI-Import starten
            </button>
          </div>

          {/* Filter Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--spacing-md)'
          }}>
            {/* Status Filter */}
            <select
              className="lyd-select"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              {statusFilterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Platform Filter */}
            <select
              className="lyd-select"
              onChange={(e) => {
                const value = e.target.value;
                if (value && !filters.platforms.includes(value)) {
                  handleFilterChange('platforms', [...filters.platforms, value]);
                }
                e.target.value = '';
              }}
            >
              <option value="">Plattform hinzufügen...</option>
              {platformFilterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Date Range Filter */}
            <select
              className="lyd-select"
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            >
              <option value="all">Alle Zeiträume</option>
              <option value="7days">Letzte 7 Tage</option>
              <option value="30days">Letzte 30 Tage</option>
              <option value="90days">Letzte 90 Tage</option>
            </select>
          </div>

          {/* Active Platform Filters */}
          {filters.platforms.length > 0 && (
            <div style={{ marginTop: 'var(--spacing-md)' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span className="lyd-text-secondary">Aktive Plattformen:</span>
                {filters.platforms.map(platform => {
                  const option = platformFilterOptions.find(opt => opt.value === platform);
                  return (
                    <span
                      key={platform}
                      className="lyd-badge secondary"
                      style={{
                        backgroundColor: option?.color + '20',
                        color: option?.color,
                        border: `1px solid ${option?.color}40`,
                        cursor: 'pointer'
                      }}
                      onClick={() => handleFilterChange('platforms', 
                        filters.platforms.filter(p => p !== platform)
                      )}
                    >
                      {option?.label || platform}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '4px' }}>
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================================
          ARTIKEL TABELLE
          ============================================================================ */}
      <div className="lyd-card">
        <div className="lyd-card-header">
          <h2 className="lyd-heading-2">Blog Artikel ({blogPosts.length})</h2>
          <p className="lyd-text-secondary">Verwalten Sie Ihre Multi-Platform Inhalte</p>
        </div>
        <div className="lyd-card-body">
          {error && (
            <div className="lyd-alert error" style={{ marginBottom: 'var(--spacing-md)' }}>
              <strong>Fehler:</strong> {error}
              <button 
                className="lyd-button ghost small"
                onClick={fetchBlogPosts}
                style={{ marginLeft: 'auto' }}
              >
                Erneut versuchen
              </button>
            </div>
          )}

          {loading ? (
            <LoadingSpinner 
              size="lg" 
              label="Blog-Artikel laden..." 
              variant="gradient"
            />
          ) : blogPosts.length === 0 ? (
            <div className="lyd-empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <h3>Keine Artikel gefunden</h3>
              <p>Es wurden keine Blog-Artikel gefunden, die Ihren Filterkriterien entsprechen.</p>
              {(filters.status !== 'all' || filters.platforms.length > 0 || filters.search) && (
                <button 
                  className="lyd-button secondary"
                  onClick={resetFilters}
                >
                  Filter zurücksetzen
                </button>
              )}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="lyd-table striped">
                <thead>
                  <tr>
                    <th>Artikel</th>
                    <th>Plattformen</th>
                    <th>Kategorie</th>
                    <th>Status</th>
                    <th>Veröffentlichung</th>
                    <th>Autor</th>
                    <th>Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {blogPosts.map((post) => (
                    <tr key={post.id}>
                      <td>
                        <div>
                          <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                            {post.title}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: 'var(--lyd-gray-500)' }}>
                            /{post.slug}
                          </div>
                          {post.importSource && (
                            <div style={{ 
                              fontSize: '0.75rem', 
                              color: 'var(--lyd-info)', 
                              marginTop: '2px' 
                            }}>
                              KI-Import: {post.importSource} {post.importModel}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>{renderPlatformBadges(post.platforms)}</td>
                      <td>
                        <div>{post.category}</div>
                        {post.subcategory && (
                          <div style={{ fontSize: '0.875rem', color: 'var(--lyd-gray-500)' }}>
                            {post.subcategory}
                          </div>
                        )}
                      </td>
                      <td>{renderStatusBadge(post.status)}</td>
                      <td>
                        {post.publishedAt ? (
                          <div>
                            <div>{formatDate(post.publishedAt)}</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--lyd-gray-500)' }}>
                              Veröffentlicht
                            </div>
                          </div>
                        ) : post.scheduledFor ? (
                          <div>
                            <div>{formatDate(post.scheduledFor)}</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--lyd-info)' }}>
                              Geplant
                            </div>
                          </div>
                        ) : (
                          <div style={{ color: 'var(--lyd-gray-400)' }}>-</div>
                        )}
                      </td>
                      <td>
                        <div>{post.author.name}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--lyd-gray-500)' }}>
                          {post.author.email}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="lyd-button ghost icon-only small"
                            onClick={() => window.location.href = `/dashboard/blog/${post.id}/edit`}
                            title="Bearbeiten"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            className="lyd-button ghost icon-only small"
                            onClick={() => window.location.href = `/dashboard/blog/${post.id}/preview`}
                            title="Vorschau"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
