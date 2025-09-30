'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/Toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// ============================================================================
// BLOG CREATE COMPONENT
// ============================================================================

export default function CreateBlogPost() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [saving, setSaving] = useState(false);
  
  // Form state with defaults
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '# Artikel-Titel\n\n> Lead-Absatz: Kernbotschaft in 2-3 Sätzen\n\n## Einleitung\n\n...',
    format: 'mdx',
    category: '',
    subcategory: '',
    platforms: [] as string[],
    tags: [] as string[],
    status: 'DRAFT',
    metaTitle: '',
    metaDescription: '',
    focusKeyword: '',
    canonicalUrl: '',
    ogTitle: '',
    ogDescription: '',
    featuredImageUrl: '',
    featuredImageAlt: '',
    scheduledFor: ''
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // Auto-generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };
  
  const handleTitleChange = (title: string) => {
    updateField('title', title);
    // Auto-generate slug only if slug is empty or matches previous auto-generated slug
    if (!formData.slug || formData.slug === generateSlug(formData.title)) {
      updateField('slug', generateSlug(title));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Create failed');
      }

      const result = await response.json();

      showSuccess(
        'Artikel erstellt',
        `"${formData.title}" wurde als ${formData.status} erstellt.`
      );

      setTimeout(() => {
        router.push('/dashboard/blog');
      }, 500);
    } catch (error) {
      console.error('Save error:', error);
      showError(
        'Fehler beim Erstellen',
        error instanceof Error ? error.message : 'Unbekannter Fehler'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="Neuer Artikel" subtitle="Blog-Artikel erstellen">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
        
        {/* Header Actions */}
        <div className="lyd-card">
          <div className="lyd-card-body" style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
            <button
              className="lyd-button secondary"
              onClick={() => router.push('/dashboard/blog')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Zurück zur Übersicht
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
          
          {/* Basis-Informationen */}
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
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    required
                    maxLength={120}
                    placeholder="z.B. Immobilie ohne Makler verkaufen: Der komplette Guide 2025"
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--spacing-xs)' }}>
                    <small style={{ color: 'var(--lyd-gray-600)' }}>
                      Slug wird automatisch generiert
                    </small>
                    <small style={{ color: (formData.title.length) > 100 ? 'var(--lyd-warning)' : 'var(--lyd-gray-600)' }}>
                      {formData.title.length}/120 Zeichen
                    </small>
                  </div>
                </div>

                <div>
                  <label htmlFor="slug" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' }}>
                    Slug (URL) *
                  </label>
                  <input
                    id="slug"
                    className="lyd-input"
                    value={formData.slug}
                    onChange={(e) => updateField('slug', e.target.value)}
                    required
                    placeholder="immobilie-ohne-makler-verkaufen-guide-2025"
                  />
                </div>

                <div>
                  <label htmlFor="excerpt" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' }}>
                    Zusammenfassung *
                  </label>
                  <textarea
                    id="excerpt"
                    className="lyd-input"
                    value={formData.excerpt}
                    onChange={(e) => updateField('excerpt', e.target.value)}
                    required
                    maxLength={200}
                    rows={3}
                    placeholder="Kurze Zusammenfassung für Suchergebnisse und Social Media"
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--spacing-xs)' }}>
                    <small style={{ color: 'var(--lyd-gray-600)' }}>
                      Wird in Suchergebnissen und Social Media angezeigt
                    </small>
                    <small style={{ color: (formData.excerpt.length) > 180 ? 'var(--lyd-warning)' : 'var(--lyd-gray-600)' }}>
                      {formData.excerpt.length}/200 Zeichen
                    </small>
                  </div>
                </div>

                <div>
                  <label htmlFor="content" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' }}>
                    Inhalt (Markdown) *
                  </label>
                  <textarea
                    id="content"
                    className="lyd-input"
                    value={formData.content}
                    onChange={(e) => updateField('content', e.target.value)}
                    required
                    rows={20}
                    style={{ fontFamily: 'monospace', fontSize: '14px' }}
                    placeholder="# Überschrift&#10;&#10;Text..."
                  />
                  <small style={{ color: 'var(--lyd-gray-600)' }}>
                    Unterstützt Markdown/MDX • Bilder: ![alt](url)
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Kategorisierung */}
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
                    value={formData.category}
                    onChange={(e) => updateField('category', e.target.value)}
                    required
                    placeholder="z.B. Verkaufsratgeber"
                  />
                </div>
                <div>
                  <label htmlFor="subcategory" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' }}>
                    Unterkategorie
                  </label>
                  <input
                    id="subcategory"
                    className="lyd-input"
                    value={formData.subcategory}
                    onChange={(e) => updateField('subcategory', e.target.value)}
                    placeholder="z.B. Privatverkauf"
                  />
                </div>
              </div>
              
              <div style={{ marginTop: 'var(--spacing-md)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' }}>
                  Plattformen * (mind. 1)
                </label>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                  {['WOHNEN', 'MAKLER', 'ENERGIE'].map(platform => (
                    <label key={platform} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.platforms.includes(platform)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateField('platforms', [...formData.platforms, platform]);
                          } else {
                            updateField('platforms', formData.platforms.filter(p => p !== platform));
                          }
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                      {platform}
                    </label>
                  ))}
                </div>
              </div>
              
              <div style={{ marginTop: 'var(--spacing-md)' }}>
                <label htmlFor="tags" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' }}>
                  Tags (Komma-separiert)
                </label>
                <input
                  id="tags"
                  className="lyd-input"
                  value={formData.tags.join(', ')}
                  onChange={(e) => updateField('tags', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                  placeholder="München, Provision sparen, 2025"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="lyd-card">
            <div className="lyd-card-header">
              <h2 className="lyd-heading-2">Status & Veröffentlichung</h2>
            </div>
            <div className="lyd-card-body">
              <div>
                <label htmlFor="status" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' }}>
                  Status
                </label>
                <select
                  id="status"
                  className="lyd-input"
                  value={formData.status}
                  onChange={(e) => updateField('status', e.target.value)}
                >
                  <option value="DRAFT">Draft (Entwurf)</option>
                  <option value="REVIEW">Review (Überprüfung)</option>
                  <option value="SCHEDULED">Geplant</option>
                  <option value="PUBLISHED">Veröffentlicht</option>
                </select>
              </div>
              
              {formData.status === 'SCHEDULED' && (
                <div style={{ marginTop: 'var(--spacing-md)' }}>
                  <label htmlFor="scheduledFor" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' }}>
                    Geplant für (Datum & Zeit)
                  </label>
                  <input
                    id="scheduledFor"
                    type="datetime-local"
                    className="lyd-input"
                    value={formData.scheduledFor}
                    onChange={(e) => updateField('scheduledFor', e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* SEO (Optional, collapsible) */}
          <details className="lyd-card">
            <summary className="lyd-card-header" style={{ cursor: 'pointer' }}>
              <h2 className="lyd-heading-2">SEO & Meta-Daten (Optional)</h2>
            </summary>
            <div className="lyd-card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                <div>
                  <label htmlFor="metaTitle" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' }}>
                    Meta Titel
                  </label>
                  <input
                    id="metaTitle"
                    className="lyd-input"
                    value={formData.metaTitle}
                    onChange={(e) => updateField('metaTitle', e.target.value)}
                    maxLength={120}
                    placeholder="Leer = Titel wird verwendet"
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--spacing-xs)' }}>
                    <small style={{ color: 'var(--lyd-gray-600)' }}>
                      Optimal: 50-60 Zeichen
                    </small>
                    <small style={{ color: (formData.metaTitle.length) > 100 ? 'var(--lyd-warning)' : 'var(--lyd-gray-600)' }}>
                      {formData.metaTitle.length}/120 Zeichen
                    </small>
                  </div>
                </div>

                <div>
                  <label htmlFor="metaDescription" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' }}>
                    Meta Beschreibung
                  </label>
                  <textarea
                    id="metaDescription"
                    className="lyd-input"
                    value={formData.metaDescription}
                    onChange={(e) => updateField('metaDescription', e.target.value)}
                    maxLength={200}
                    rows={3}
                    placeholder="Leer = Zusammenfassung wird verwendet"
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--spacing-xs)' }}>
                    <small style={{ color: 'var(--lyd-gray-600)' }}>
                      Optimal: 150-160 Zeichen
                    </small>
                    <small style={{ color: (formData.metaDescription.length) > 180 ? 'var(--lyd-warning)' : 'var(--lyd-gray-600)' }}>
                      {formData.metaDescription.length}/200 Zeichen
                    </small>
                  </div>
                </div>

                <div>
                  <label htmlFor="focusKeyword" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' }}>
                    Focus Keyword
                  </label>
                  <input
                    id="focusKeyword"
                    className="lyd-input"
                    value={formData.focusKeyword}
                    onChange={(e) => updateField('focusKeyword', e.target.value)}
                    placeholder="z.B. immobilie ohne makler verkaufen"
                  />
                </div>

                <div>
                  <label htmlFor="featuredImageUrl" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' }}>
                    Featured Image URL
                  </label>
                  <input
                    id="featuredImageUrl"
                    className="lyd-input"
                    value={formData.featuredImageUrl}
                    onChange={(e) => updateField('featuredImageUrl', e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                </div>

                <div>
                  <label htmlFor="featuredImageAlt" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' }}>
                    Featured Image Alt Text
                  </label>
                  <input
                    id="featuredImageAlt"
                    className="lyd-input"
                    value={formData.featuredImageAlt}
                    onChange={(e) => updateField('featuredImageAlt', e.target.value)}
                    placeholder="Beschreibender Alt-Text für SEO"
                  />
                </div>
              </div>
            </div>
          </details>

          {/* Save Button */}
          <div className="lyd-card">
            <div className="lyd-card-body" style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="lyd-button outline"
                onClick={() => router.push('/dashboard/blog')}
                disabled={saving}
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="lyd-button primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Erstelle...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Artikel erstellen
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
