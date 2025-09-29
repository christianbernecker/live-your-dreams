/**
 * Blog System - Multi-Platform Content Management
 * 
 * Hauptseite für Blog-Verwaltung mit Statistiken, Filterung und Artikelübersicht
 * Unterstützt: WOHNEN, MAKLER, ENERGIE Plattformen
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// ============================================================================
// TYPES
// ============================================================================

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: string;
  platforms: string[];
  category: string;
  createdAt: string;
  author: {
    name: string;
    email: string;
  };
}

interface BlogStats {
  total: number;
  published: number;
  draft: number;
}

// ============================================================================
// BLOG DASHBOARD COMPONENT
// ============================================================================

export default function BlogDashboard() {
  const router = useRouter();
  const [blogData, setBlogData] = useState<{posts: BlogPost[], stats: BlogStats} | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter States
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Fetch Blog Data
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/blog');
        
        if (!response.ok) {
          if (response.status === 401) {
            console.log('🔐 Authentication required - redirecting to login');
            router.push('/api/auth/signin');
            return;
          }
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const data = await response.json();
        setBlogData({
          posts: data.posts || [],
          stats: data.stats || { total: 0, published: 0, draft: 0 }
        });
        
      } catch (error) {
        console.error('Blog fetch error:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router]);
  
  // Filtered Posts
  const filteredPosts = blogData?.posts.filter(post => {
    if (statusFilter !== 'all' && post.status !== statusFilter) return false;
    if (platformFilter !== 'all' && !post.platforms.includes(platformFilter)) return false;
    if (categoryFilter !== 'all' && post.category !== categoryFilter) return false;
    return true;
  }) || [];
  
  // Extract unique categories for filter
  const categories = Array.from(new Set(blogData?.posts.map(p => p.category) || []));
  
  // Reset Filter
  const resetFilters = () => {
    setStatusFilter('all');
    setPlatformFilter('all');
    setCategoryFilter('all');
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <DashboardLayout 
      title="Blog System" 
      subtitle="Multi-Platform Content Management (WOHNEN, MAKLER, ENERGIE)"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      
      {/* Info Card */}
      <div className="lyd-card">
        <div className="lyd-card-body" style={{ padding: 'var(--spacing-md)' }}>
          <p style={{ margin: 0, color: 'var(--lyd-gray-600)', fontSize: 'var(--font-size-sm)' }}>
            Verwalten Sie Blog-Artikel für alle Plattformen (WOHNEN, MAKLER, ENERGIE) an einem zentralen Ort.
          </p>
        </div>
      </div>

      {/* Statistics */}
      {blogData && (
        <div className="lyd-card">
          <div className="lyd-card-header" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h2 className="lyd-heading-2" style={{ margin: 0 }}>Statistiken</h2>
          </div>
          <div className="lyd-card-body">
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: 'var(--spacing-lg)' 
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--lyd-primary)' }}>
                  {blogData.stats.total}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--lyd-gray-600)' }}>
                  Artikel gesamt
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--lyd-success)' }}>
                  {blogData.stats.published}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--lyd-gray-600)' }}>
                  Veröffentlicht
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--lyd-warning)' }}>
                  {blogData.stats.draft}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--lyd-gray-600)' }}>
                  Entwürfe
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="lyd-card">
          <div className="lyd-card-body" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
            <p>Lade Blog-Daten...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="lyd-card">
          <div className="lyd-card-body">
            <div style={{ 
              color: 'var(--lyd-error)',
              padding: 'var(--spacing-md)',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 'var(--border-radius-md)'
            }}>
              <strong>Fehler:</strong> {error}
            </div>
          </div>
        </div>
      )}

      {/* Filter Section */}
      {blogData && blogData.posts.length > 0 && (
        <div className="lyd-card">
          <div className="lyd-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 className="lyd-heading-2" style={{ margin: 0 }}>Filter</h2>
            <button 
              className="lyd-button outline sm"
              onClick={resetFilters}
            >
              Zur\u00fccksetzen
            </button>
          </div>
          <div className="lyd-card-body">
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: 'var(--spacing-md)' 
            }}>
              {/* Status Filter */}
              <div>
                <label htmlFor="statusFilter" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontSize: 'var(--font-size-sm)', fontWeight: '600' }}>
                  Status
                </label>
                <select
                  id="statusFilter"
                  className="lyd-input"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Alle</option>
                  <option value="DRAFT">Draft</option>
                  <option value="REVIEW">Review</option>
                  <option value="SCHEDULED">Geplant</option>
                  <option value="PUBLISHED">Ver\u00f6ffentlicht</option>
                  <option value="ARCHIVED">Archiviert</option>
                </select>
              </div>
              
              {/* Platform Filter */}
              <div>
                <label htmlFor="platformFilter" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontSize: 'var(--font-size-sm)', fontWeight: '600' }}>
                  Plattform
                </label>
                <select
                  id="platformFilter"
                  className="lyd-input"
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value)}
                >
                  <option value="all">Alle</option>
                  <option value="WOHNEN">Wohnen</option>
                  <option value="MAKLER">Makler</option>
                  <option value="ENERGIE">Energie</option>
                </select>
              </div>
              
              {/* Category Filter */}
              <div>
                <label htmlFor="categoryFilter" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontSize: 'var(--font-size-sm)', fontWeight: '600' }}>
                  Kategorie
                </label>
                <select
                  id="categoryFilter"
                  className="lyd-input"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">Alle</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Filter Results Info */}
            <div style={{ marginTop: 'var(--spacing-md)', fontSize: 'var(--font-size-sm)', color: 'var(--lyd-gray-600)' }}>
              {filteredPosts.length} von {blogData.posts.length} Artikel{filteredPosts.length !== blogData.posts.length && ' (gefiltert)'}
            </div>
          </div>
        </div>
      )}

      {/* Blog Posts (if available) */}
      {blogData && filteredPosts.length > 0 && (
        <div className="lyd-card">
          <div className="lyd-card-header">
            <h2 className="lyd-heading-2">Blog Artikel ({filteredPosts.length})</h2>
          </div>
          <div className="lyd-card-body">
            <div style={{ overflowX: 'auto' }}>
              <table className="lyd-table striped">
                <thead>
                  <tr>
                    <th>Titel</th>
                    <th>Status</th>
                    <th>Plattformen</th>
                    <th>Kategorie</th>
                    <th>Autor</th>
                    <th>Erstellt</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post) => (
                    <tr key={post.id}>
                      <td>
                        <div style={{ fontWeight: '600' }}>{post.title}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--lyd-gray-500)' }}>
                          /{post.slug}
                        </div>
                      </td>
                      <td>
                        <span className={`lyd-badge ${post.status.toLowerCase()}`}>
                          {post.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {post.platforms.map(platform => (
                            <span key={platform} className="lyd-badge secondary">
                              {platform}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>{post.category}</td>
                      <td>
                        <div>{post.author.name}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--lyd-gray-500)' }}>
                          {post.author.email}
                        </div>
                      </td>
                      <td>
                        {new Date(post.createdAt).toLocaleDateString('de-DE')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Filtered Empty State */}
      {blogData && blogData.posts.length > 0 && filteredPosts.length === 0 && (
        <div className="lyd-card">
          <div className="lyd-card-body" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--lyd-gray-400)', display: 'block', margin: '0 auto' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <h3>Keine Artikel gefunden</h3>
            <p style={{ color: 'var(--lyd-gray-500)', marginBottom: 'var(--spacing-md)' }}>
              Mit den aktuellen Filtern wurden keine Artikel gefunden. Versuchen Sie andere Filter.
            </p>
            <button
              className="lyd-button outline"
              onClick={resetFilters}
            >
              Filter zur\u00fccksetzen
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {blogData && blogData.posts.length === 0 && (
        <div className="lyd-card">
          <div className="lyd-card-body" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--lyd-gray-400)', display: 'block', margin: '0 auto' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10,9 9,9 8,9" />
            </svg>
          </div>
            <h3>Keine Blog-Artikel</h3>
            <p style={{ color: 'var(--lyd-gray-500)', marginBottom: 'var(--spacing-md)' }}>
              Das Blog-System ist bereit, aber es sind noch keine Artikel vorhanden.
            </p>
            <button
              className="lyd-button primary"
              onClick={() => router.push('/dashboard/blog/import')}
            >
              Ersten Artikel erstellen
            </button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="lyd-card">
        <div className="lyd-card-header">
          <h2 className="lyd-heading-2">Schnellaktionen</h2>
        </div>
        <div className="lyd-card-body" style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <button
            className="lyd-button primary"
            onClick={() => router.push('/dashboard/blog/import')}
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Artikel importieren
          </button>
          <button
            className="lyd-button secondary"
            onClick={() => alert('Edit-Feature wird in nächsten Micro-Steps aktiviert')}
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            Artikel erstellen
          </button>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
}
