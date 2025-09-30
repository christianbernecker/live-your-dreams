/**
 * Blog System - Multi-Platform Content Management
 * 
 * Hauptseite für Blog-Verwaltung mit Statistiken, Filterung und Artikelübersicht
 * Unterstützt: WOHNEN, MAKLER, ENERGIE Plattformen
 */

'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/Toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
  const { showSuccess, showError } = useToast();
  const [blogData, setBlogData] = useState<{posts: BlogPost[], stats: BlogStats} | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter States
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Delete State
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [deletePostTitle, setDeletePostTitle] = useState<string>('');
  const [deleting, setDeleting] = useState(false);

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
  
  // Handle Edit
  const handleEdit = (postId: string) => {
    router.push(`/dashboard/blog/edit/${postId}`);
  };
  
  // Handle Delete
  const confirmDelete = (postId: string, title: string) => {
    setDeletePostId(postId);
    setDeletePostTitle(title);
  };
  
  const handleDelete = async () => {
    if (!deletePostId) return;
    
    try {
      setDeleting(true);
      const response = await fetch(`/api/blog/${deletePostId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Delete failed');
      }
      
      // Remove post from UI
      setBlogData(prev => prev ? {
        ...prev,
        posts: prev.posts.filter(p => p.id !== deletePostId)
      } : null);
      
      showSuccess(
        'Gelöscht',
        `Artikel "${deletePostTitle}" wurde erfolgreich gelöscht.`
      );
      
      setDeletePostId(null);
      setDeletePostTitle('');
    } catch (error) {
      console.error('Delete error:', error);
      showError(
        'Fehler beim Löschen',
        error instanceof Error ? error.message : 'Unbekannter Fehler'
      );
    } finally {
      setDeleting(false);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <DashboardLayout 
      title="Blog System" 
      subtitle="Multi-Platform Content Management (WOHNEN, MAKLER, ENERGIE)"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
      
      {/* Welcome Header */}
      <div className="lyd-card">
        <div className="lyd-card-header">
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700',
            color: 'var(--lyd-text)',
            margin: 0
          }}>Blog System</h1>
          <p className="lyd-text-secondary" style={{ fontSize: '0.875rem', marginTop: 'var(--spacing-xs)' }}>
            Verwalten Sie Blog-Artikel für alle Plattformen (WOHNEN, MAKLER, ENERGIE) an einem zentralen Ort.
          </p>
        </div>
      </div>

      {/* Platform Overview */}
      {blogData && (
        <div className="lyd-card">
          <div className="lyd-card-header">
            <h2 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600',
              margin: 0
            }}>Plattform-Übersicht</h2>
            <p className="lyd-text-secondary" style={{ fontSize: '0.875rem', marginTop: 'var(--spacing-xs)' }}>Verteilung Ihrer Artikel auf die verschiedenen Plattformen</p>
          </div>
          <div className="lyd-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-sm)' }}>
              <div style={{ padding: 'var(--spacing-sm) var(--spacing-md)', border: '1px solid var(--lyd-line)', borderRadius: 'var(--border-radius-lg)', textAlign: 'center' }}>
                <div style={{ marginBottom: 'var(--spacing-xs)', color: 'var(--lyd-primary)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: '0 auto' }}>
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9,22 9,12 15,12 15,22"/>
                  </svg>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 var(--spacing-xs) 0' }}>WOHNEN</h3>
                <p style={{ color: 'var(--lyd-gray-600)', fontSize: '0.875rem', marginBottom: 'var(--spacing-md)' }}>
                  {blogData.posts.filter(p => p.platforms.includes('WOHNEN')).length} Artikel
                </p>
              </div>
              
              <div style={{ padding: 'var(--spacing-sm) var(--spacing-md)', border: '1px solid var(--lyd-line)', borderRadius: 'var(--border-radius-lg)', textAlign: 'center' }}>
                <div style={{ marginBottom: 'var(--spacing-xs)', color: 'var(--lyd-secondary)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: '0 auto' }}>
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
                    <line x1="12" y1="22.08" x2="12" y2="12"/>
                  </svg>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 var(--spacing-xs) 0' }}>MAKLER</h3>
                <p style={{ color: 'var(--lyd-gray-600)', fontSize: '0.875rem', marginBottom: 'var(--spacing-md)' }}>
                  {blogData.posts.filter(p => p.platforms.includes('MAKLER')).length} Artikel
                </p>
              </div>
              
              <div style={{ padding: 'var(--spacing-sm) var(--spacing-md)', border: '1px solid var(--lyd-line)', borderRadius: 'var(--border-radius-lg)', textAlign: 'center' }}>
                <div style={{ marginBottom: 'var(--spacing-xs)', color: 'var(--lyd-success)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: '0 auto' }}>
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                  </svg>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 var(--spacing-xs) 0' }}>ENERGIE</h3>
                <p style={{ color: 'var(--lyd-gray-600)', fontSize: '0.875rem', marginBottom: 'var(--spacing-md)' }}>
                  {blogData.posts.filter(p => p.platforms.includes('ENERGIE')).length} Artikel
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      {blogData && (
        <div className="lyd-card">
          <div className="lyd-card-header" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>Statistiken</h2>
          </div>
          <div className="lyd-card-body">
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: 'var(--spacing-sm)' 
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--lyd-primary)' }}>
                  {blogData.stats.total}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--lyd-gray-600)' }}>
                  Artikel gesamt
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--lyd-success)' }}>
                  {blogData.stats.published}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--lyd-gray-600)' }}>
                  Veröffentlicht
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--lyd-warning)' }}>
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
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>Filter</h2>
            <button 
              className="lyd-button secondary sm"
              onClick={resetFilters}
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Filter zurücksetzen
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
                <label htmlFor="statusFilter" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontSize: '0.875rem', fontWeight: '600' }}>
                  Status
                </label>
                <CustomSelect
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={[
                    { value: 'all', label: 'Alle' },
                    { value: 'DRAFT', label: 'Draft' },
                    { value: 'REVIEW', label: 'Review' },
                    { value: 'SCHEDULED', label: 'Geplant' },
                    { value: 'PUBLISHED', label: 'Veröffentlicht' },
                    { value: 'ARCHIVED', label: 'Archiviert' }
                  ]}
                />
              </div>
              
              {/* Platform Filter */}
              <div>
                <label htmlFor="platformFilter" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontSize: '0.875rem', fontWeight: '600' }}>
                  Plattform
                </label>
                <CustomSelect
                  value={platformFilter}
                  onChange={setPlatformFilter}
                  options={[
                    { value: 'all', label: 'Alle' },
                    { value: 'WOHNEN', label: 'Wohnen' },
                    { value: 'MAKLER', label: 'Makler' },
                    { value: 'ENERGIE', label: 'Energie' }
                  ]}
                />
              </div>
              
              {/* Category Filter */}
              <div>
                <label htmlFor="categoryFilter" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontSize: '0.875rem', fontWeight: '600' }}>
                  Kategorie
                </label>
                <CustomSelect
                  value={categoryFilter}
                  onChange={setCategoryFilter}
                  options={[
                    { value: 'all', label: 'Alle' },
                    ...categories.map(cat => ({ value: cat, label: cat }))
                  ]}
                />
              </div>
            </div>
            
            {/* Filter Results Info */}
            <div style={{ marginTop: 'var(--spacing-md)', fontSize: '0.875rem', color: 'var(--lyd-gray-600)' }}>
              {filteredPosts.length} von {blogData.posts.length} Artikel{filteredPosts.length !== blogData.posts.length && ' (gefiltert)'}
            </div>
          </div>
        </div>
      )}

      {/* Blog Posts (if available) */}
      {blogData && filteredPosts.length > 0 && (
        <div className="lyd-card">
          {loading ? (
            <LoadingSpinner 
              size="lg" 
              label="Blog-Artikel laden..." 
              variant="gradient"
            />
          ) : (
            <>
          <div className="lyd-card-header">
            <h2 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600',
              margin: 0
            }}>Blog Artikel ({filteredPosts.length})</h2>
          </div>
          <div className="lyd-card-body">
            <div style={{ overflowX: 'auto' }}>
              <table className="api-table striped">
                <thead>
                  <tr>
                    <th>Titel</th>
                    <th>Status</th>
                    <th>Plattformen</th>
                    <th>Kategorie</th>
                    <th>Autor</th>
                    <th>Erstellt</th>
                    <th>Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post) => (
                    <tr key={post.id}>
                      <td>
                        <div style={{ fontWeight: '600' }}>{post.title}</div>
                      </td>
                      <td>
                        <span className={`lyd-badge ${
                          post.status === 'DRAFT' ? 'warning' :
                          post.status === 'PUBLISHED' ? 'success' :
                          post.status === 'REVIEW' ? 'info' :
                          post.status === 'SCHEDULED' ? 'info' :
                          'secondary'
                        }`}>
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
                        <div style={{ fontSize: '14px', color: 'var(--lyd-text-secondary)' }}>
                          {post.author.email}
                        </div>
                      </td>
                      <td>
                        {new Date(post.createdAt).toLocaleDateString('de-DE')}
                      </td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
                          <button
                            onClick={() => handleEdit(post.id)}
                            className="lyd-button ghost icon-only"
                            style={{
                              background: 'transparent',
                              border: 'none',
                              padding: '4px',
                              color: 'var(--lyd-text-secondary)'
                            }}
                            title="Bearbeiten"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          
                          <button
                            onClick={() => confirmDelete(post.id, post.title)}
                            className="lyd-button ghost icon-only"
                            style={{
                              background: 'transparent',
                              border: 'none',
                              padding: '4px',
                              color: 'var(--lyd-error)'
                            }}
                            title="Löschen"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3,6 5,6 21,6"/>
                              <path d="m19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                              <line x1="10" y1="11" x2="10" y2="17"/>
                              <line x1="14" y1="11" x2="14" y2="17"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
            </>
          )}
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
              className="lyd-button secondary sm"
              onClick={resetFilters}
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Filter zurücksetzen
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
              className="lyd-button primary sm"
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
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>Schnellaktionen</h2>
        </div>
        <div className="lyd-card-body">
          <div style={{ 
            display: 'flex', 
            gap: 'var(--spacing-sm)', 
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <button
              className="lyd-button primary sm"
              onClick={() => router.push('/dashboard/blog/new')}
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Neuer Artikel
            </button>
            <button
              className="lyd-button secondary sm"
              onClick={() => router.push('/dashboard/blog/import')}
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              JSON importieren
            </button>
          </div>
        </div>
      </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {deletePostId && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div className="lyd-card" style={{ width: '100%', maxWidth: '500px', margin: 'var(--spacing-lg)' }}>
            <div className="lyd-card-header">
              <h2 className="lyd-heading-2">Artikel löschen?</h2>
            </div>
            <div className="lyd-card-body">
              <p style={{ marginBottom: 'var(--spacing-lg)' }}>
                Möchten Sie den Artikel <strong>"{deletePostTitle}"</strong> wirklich löschen?
              </p>
              <p style={{ color: 'var(--lyd-error)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-lg)' }}>
                Diese Aktion kann nicht rückgängig gemacht werden.
              </p>
              <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'flex-end' }}>
                <button
                  className="lyd-button outline"
                  onClick={() => {
                    setDeletePostId(null);
                    setDeletePostTitle('');
                  }}
                  disabled={deleting}
                >
                  Abbrechen
                </button>
                <button
                  className="lyd-button primary"
                  onClick={handleDelete}
                  disabled={deleting}
                  style={{ backgroundColor: 'var(--lyd-error)', borderColor: 'var(--lyd-error)' }}
                >
                  {deleting ? 'Löschen...' : 'Artikel löschen'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
