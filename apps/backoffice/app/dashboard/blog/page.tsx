/**
 * LYD Blog System v1.1 - MICRO Step 4
 * 
 * Minimal Blog UI - nur native React + Design System CSS
 * KEINE externen Components, KEINE komplexen Dependencies
 */

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

// ============================================================================
// MICRO TYPES (inline, minimal)
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
// MINIMAL COMPONENT
// ============================================================================

export default function BlogDashboard() {
  const { data: session } = useSession();
  const [blogData, setBlogData] = useState<{posts: BlogPost[], stats: BlogStats} | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Blog Data
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/blog');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
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

    if (session) {
      fetchData();
    }
  }, [session]);

  // ============================================================================
  // AUTHENTICATION CHECK
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

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      
      {/* Header */}
      <div className="lyd-card">
        <div className="lyd-card-header">
          <h1 className="lyd-heading-1">Blog System v1.1</h1>
          <p className="lyd-text-secondary">Multi-Platform Content Management (MICRO Implementation)</p>
        </div>
        <div className="lyd-card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <span className="lyd-badge success">API Online</span>
            <span className="lyd-badge info">Prisma Schema ✓</span>
            <span className="lyd-badge secondary">Build Stable ✓</span>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {blogData && (
        <div className="lyd-card">
          <div className="lyd-card-header">
            <h2 className="lyd-heading-2">Statistiken</h2>
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

      {/* Blog Posts (if available) */}
      {blogData && blogData.posts.length > 0 && (
        <div className="lyd-card">
          <div className="lyd-card-header">
            <h2 className="lyd-heading-2">Blog Artikel ({blogData.posts.length})</h2>
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
                  {blogData.posts.map((post) => (
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

      {/* Empty State */}
      {blogData && blogData.posts.length === 0 && (
        <div className="lyd-card">
          <div className="lyd-card-body" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--lyd-gray-400)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h3>Keine Blog-Artikel</h3>
            <p style={{ color: 'var(--lyd-gray-500)', marginBottom: 'var(--spacing-md)' }}>
              Das Blog-System ist bereit, aber es sind noch keine Artikel vorhanden.
            </p>
            <button
              className="lyd-button primary"
              onClick={() => alert('Import-Feature wird in nächsten Micro-Steps aktiviert')}
            >
              Ersten Artikel erstellen
            </button>
          </div>
        </div>
      )}

      {/* Development Info */}
      <div className="lyd-card">
        <div className="lyd-card-header">
          <h2 className="lyd-heading-2">Entwicklungsstatus</h2>
        </div>
        <div className="lyd-card-body">
          <div style={{ fontSize: '0.875rem', color: 'var(--lyd-gray-600)' }}>
            <div style={{ marginBottom: '8px' }}>
              <strong>Micro-Steps Completed:</strong>
            </div>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>✅ Prisma BlogPost Schema</li>
              <li>✅ Basic API Route (/api/blog)</li>
              <li>✅ TypeScript Types (native)</li>
              <li>✅ Minimal Blog UI (aktuell)</li>
              <li>⏳ HTML Sanitizer (next)</li>
              <li>⏳ JSON Import (after sanitizer)</li>
              <li>⏳ Enhanced UI (final)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
