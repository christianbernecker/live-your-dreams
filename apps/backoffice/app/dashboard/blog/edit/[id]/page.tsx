'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  format: string;
  status: string;
  platforms: string[];
  category: string;
  subcategory: string | null;
  tags: string[];
  metaTitle: string | null;
  metaDescription: string | null;
  focusKeyword: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  featuredImageUrl: string | null;
  scheduledFor: string | null;
}

export default function EditBlogPost({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Partial<BlogPostData>>({});

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/blog/${resolvedParams.id}`);
        
        if (!response.ok) {
          throw new Error('Post not found');
        }

        const data = await response.json();
        setPost(data);
        setFormData(data);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [resolvedParams.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/blog/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Update failed');
      }

      router.push('/dashboard/blog');
    } catch (error) {
      console.error('Save error:', error);
      alert('Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof BlogPostData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <DashboardLayout title="Artikel bearbeiten" subtitle="Lade Artikel...">
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--spacing-xl)' }}>
          <LoadingSpinner size="lg" label="Lade Artikel..." variant="gradient" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !post) {
    return (
      <DashboardLayout title="Fehler" subtitle="Artikel konnte nicht geladen werden">
        <div className="lyd-card">
          <div className="lyd-card-body">
            <p style={{ color: 'var(--lyd-error)' }}>{error || 'Artikel nicht gefunden'}</p>
            <button className="lyd-button outline" onClick={() => router.push('/dashboard/blog')}>
              Zurück zur Übersicht
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title={`Bearbeiten: ${post.title}`}
      subtitle="Artikel-Details bearbeiten und Status ändern"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
        
        {/* Actions Bar */}
        <div className="lyd-card">
          <div className="lyd-card-body">
            <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                className="lyd-button outline"
                onClick={() => router.push('/dashboard/blog')}
                disabled={saving}
              >
                Abbrechen
              </button>
              <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                <button
                  type="submit"
                  className="lyd-button secondary"
                  disabled={saving}
                  onClick={() => updateField('status', 'DRAFT')}
                >
                  {saving ? 'Speichern...' : 'Als Entwurf speichern'}
                </button>
                <button
                  type="submit"
                  className="lyd-button primary"
                  disabled={saving}
                >
                  {saving ? 'Speichern...' : 'Speichern'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="lyd-card">
          <div className="lyd-card-header">
            <h2 className="lyd-heading-2">Basis-Informationen</h2>
          </div>
          <div className="lyd-card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <div>
                <label htmlFor="title" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' }}>
                  Titel *
                </label>
                <input
                  id="title"
                  className="lyd-input"
                  value={formData.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  required
                  maxLength={120}
                />
                <small style={{ color: 'var(--lyd-gray-600)' }}>
                  {formData.title?.length || 0}/120 Zeichen
                </small>
              </div>

              <div>
                <label htmlFor="slug" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' }}>
                  Slug (URL) *
                </label>
                <input
                  id="slug"
                  className="lyd-input"
                  value={formData.slug || ''}
                  onChange={(e) => updateField('slug', e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="excerpt" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' }}>
                  Zusammenfassung *
                </label>
                <textarea
                  id="excerpt"
                  className="lyd-input"
                  value={formData.excerpt || ''}
                  onChange={(e) => updateField('excerpt', e.target.value)}
                  required
                  maxLength={200}
                  rows={3}
                />
                <small style={{ color: 'var(--lyd-gray-600)' }}>
                  {formData.excerpt?.length || 0}/200 Zeichen
                </small>
              </div>

              <div>
                <label htmlFor="content" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' }}>
                  Inhalt (Markdown) *
                </label>
                <textarea
                  id="content"
                  className="lyd-input"
                  value={formData.content || ''}
                  onChange={(e) => updateField('content', e.target.value)}
                  required
                  rows={15}
                  style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category & Platforms */}
        <div className="lyd-card">
          <div className="lyd-card-header">
            <h2 className="lyd-heading-2">Kategorisierung</h2>
          </div>
          <div className="lyd-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
              <div>
                <label htmlFor="category" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' }}>
                  Kategorie *
                </label>
                <input
                  id="category"
                  className="lyd-input"
                  value={formData.category || ''}
                  onChange={(e) => updateField('category', e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="subcategory" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' }}>
                  Unterkategorie
                </label>
                <input
                  id="subcategory"
                  className="lyd-input"
                  value={formData.subcategory || ''}
                  onChange={(e) => updateField('subcategory', e.target.value)}
                />
              </div>
            </div>

            <div style={{ marginTop: 'var(--spacing-md)' }}>
              <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' }}>
                Plattformen *
              </label>
              <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                {['WOHNEN', 'MAKLER', 'ENERGIE'].map(platform => (
                  <label key={platform} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                    <input
                      type="checkbox"
                      checked={formData.platforms?.includes(platform) || false}
                      onChange={(e) => {
                        const current = formData.platforms || [];
                        if (e.target.checked) {
                          updateField('platforms', [...current, platform]);
                        } else {
                          updateField('platforms', current.filter(p => p !== platform));
                        }
                      }}
                    />
                    {platform}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Status & Publishing */}
        <div className="lyd-card">
          <div className="lyd-card-header">
            <h2 className="lyd-heading-2">Status & Veröffentlichung</h2>
          </div>
          <div className="lyd-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
              <div>
                <label htmlFor="status" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' }}>
                  Status *
                </label>
                <select
                  id="status"
                  className="lyd-input"
                  value={formData.status || 'DRAFT'}
                  onChange={(e) => updateField('status', e.target.value)}
                >
                  <option value="DRAFT">Entwurf</option>
                  <option value="REVIEW">Review</option>
                  <option value="SCHEDULED">Geplant</option>
                  <option value="PUBLISHED">Veröffentlicht</option>
                  <option value="ARCHIVED">Archiviert</option>
                </select>
              </div>

              {formData.status === 'SCHEDULED' && (
                <div>
                  <label htmlFor="scheduledFor" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' }}>
                    Geplant für
                  </label>
                  <input
                    type="datetime-local"
                    id="scheduledFor"
                    className="lyd-input"
                    value={formData.scheduledFor ? new Date(formData.scheduledFor).toISOString().slice(0, 16) : ''}
                    onChange={(e) => updateField('scheduledFor', e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="lyd-card">
          <div className="lyd-card-header">
            <h2 className="lyd-heading-2">SEO & Meta-Daten</h2>
          </div>
          <div className="lyd-card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <div>
                <label htmlFor="metaTitle" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' }}>
                  Meta Titel
                </label>
                <input
                  id="metaTitle"
                  className="lyd-input"
                  value={formData.metaTitle || ''}
                  onChange={(e) => updateField('metaTitle', e.target.value)}
                  maxLength={120}
                />
              </div>

              <div>
                <label htmlFor="metaDescription" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' }}>
                  Meta Beschreibung
                </label>
                <textarea
                  id="metaDescription"
                  className="lyd-input"
                  value={formData.metaDescription || ''}
                  onChange={(e) => updateField('metaDescription', e.target.value)}
                  maxLength={200}
                  rows={3}
                />
              </div>

              <div>
                <label htmlFor="focusKeyword" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' }}>
                  Focus Keyword
                </label>
                <input
                  id="focusKeyword"
                  className="lyd-input"
                  value={formData.focusKeyword || ''}
                  onChange={(e) => updateField('focusKeyword', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

      </form>
    </DashboardLayout>
  );
}
