'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MediaManager } from '@/components/media/MediaManager';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/Toast';
import { renderMediaInContent } from '@/lib/media-parser';
import { MediaItem } from '@/types/media';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

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
  keywords: string[];
  metaTitle: string | null;
  metaDescription: string | null;
  focusKeyword: string | null;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  featuredImageUrl: string | null;
  featuredImageAlt: string | null;
  scheduledFor: string | null;
  publishedAt: string | null;
  authorName?: string; // Simplified to string instead of object
  media?: MediaItem[] | null; // NEW: Unified media system
}

export default function EditBlogPost({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [postId, setPostId] = useState<string | null>(null);
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<Partial<BlogPostData>>({});

  // Preview container ref for executing scripts
  const previewRef = useRef<HTMLDivElement>(null);

  // Resolve params (handle both Promise and direct object for Next.js 15 compatibility)
  useEffect(() => {
    const resolveParams = async () => {
      try {
        // Check if params is a Promise
        const resolved = params instanceof Promise ? await params : params;
        setPostId(resolved.id);
      } catch (error) {
        console.error('Failed to resolve params:', error);
        setError('Failed to load post ID');
      }
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!postId) return;
    
    async function fetchPost() {
      try {
        const response = await fetch(`/api/blog/${postId}`);
        
        if (!response.ok) {
          throw new Error('Post not found');
        }

        const data = await response.json();
        
        // DEBUG: Log API response
        console.log('📥 [LOAD] API Response media field:', data.media);
        
        // EXPLICIT field mapping (NO SPREAD to avoid objects from JSON fields)
        const cleanData: BlogPostData = {
          id: data.id,
          title: data.title || '',
          slug: data.slug || '',
          excerpt: data.excerpt || '',
          content: data.content || '',
          format: data.format || 'mdx',
          status: data.status || 'DRAFT',
          platforms: Array.isArray(data.platforms) ? data.platforms : [],
          category: data.category || '',
          subcategory: data.subcategory || null,
          tags: Array.isArray(data.tags) ? data.tags : [],
          keywords: Array.isArray(data.keywords) ? data.keywords : [],
          metaTitle: data.metaTitle || null,
          metaDescription: data.metaDescription || null,
          focusKeyword: data.focusKeyword || null,
          canonicalUrl: data.canonicalUrl || null,
          ogTitle: data.ogTitle || null,
          ogDescription: data.ogDescription || null,
          ogImage: data.ogImage || null,
          featuredImageUrl: data.featuredImageUrl || null,
          featuredImageAlt: data.featuredImageAlt || null,
          scheduledFor: data.scheduledFor || null,
          publishedAt: data.publishedAt || null,
          authorName: data.authorName || 'Unbekannt',
          // CRITICAL: Media field was missing! This is why data wasn't loaded
          media: Array.isArray(data.media) ? data.media : (data.media ? [data.media] : null)
        };
        
        console.log('📦 [LOAD] Cleaned data media field:', cleanData.media);
        
        setPost(cleanData);
        setFormData(cleanData);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postId) return;
    setSaving(true);

    try {
      // DEBUG: Log media field before sending
      console.log('🔍 [SAVE] FormData media field:', formData.media);
      console.log('🔍 [SAVE] Full FormData:', JSON.stringify(formData, null, 2));

      const response = await fetch(`/api/blog/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Update failed');
      }

      const result = await response.json();
      console.log('✅ [SAVE] API Response:', result);

      setHasUnsavedChanges(false); // Reset unsaved changes flag
      
      showSuccess(
        'Gespeichert',
        `Artikel "${formData.title}" wurde erfolgreich aktualisiert.`
      );

      setTimeout(() => {
        router.push('/dashboard/blog');
      }, 500);
    } catch (error) {
      console.error('❌ [SAVE] Save error:', error);
      showError(
        'Fehler beim Speichern',
        error instanceof Error ? error.message : 'Unbekannter Fehler'
      );
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof BlogPostData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Track unsaved changes for media updates
    if (field === 'media') {
      setHasUnsavedChanges(true);
    }
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
    if (!formData.slug || formData.slug === generateSlug(formData.title || '')) {
      updateField('slug', generateSlug(title));
    }
  };

  // Execute scripts in preview after content changes
  useEffect(() => {
    if (!previewRef.current || !formData.content || !formData.media) return;

    // Debounce to prevent multiple rapid executions
    const timer = setTimeout(() => {
      console.log('🔧 [PREVIEW] Executing embedded scripts...');

      // Find all html-embed containers
      const embedContainers = previewRef.current?.querySelectorAll('.html-embed');
      if (!embedContainers) return;
    
    embedContainers.forEach((container) => {
      const embedId = container.getAttribute('data-embed-id');
      if (!embedId) return;

      console.log(`📝 [PREVIEW] Processing embed: ${embedId}`);

      // CLEANUP: Remove old scripts first to avoid duplicate variable errors
      const oldScripts = container.querySelectorAll('script[data-executed="true"]');
      oldScripts.forEach(script => script.remove());

      // CLEANUP: Destroy old Chart.js instances (if any)
      const canvases = container.querySelectorAll('canvas');
      canvases.forEach(canvas => {
        const canvasId = canvas.getAttribute('id');
        if (canvasId && (window as any).Chart) {
          const existingChart = (window as any).Chart.getChart(canvasId);
          if (existingChart) {
            console.log(`🧹 [PREVIEW] Destroying old Chart instance: ${canvasId}`);
            existingChart.destroy();
          }
        }
      });

      // Find all script tags within this embed
      const scriptTags = Array.from(container.querySelectorAll('script:not([data-executed="true"])'));
      
      // Separate external and inline scripts
      const externalScripts = scriptTags.filter(s => s.hasAttribute('src'));
      const inlineScripts = scriptTags.filter(s => !s.hasAttribute('src'));
      
      console.log(`📦 [PREVIEW] Found ${externalScripts.length} external, ${inlineScripts.length} inline scripts in ${embedId}`);

      // Execute external scripts first
      const loadPromises = externalScripts.map((oldScript) => {
        return new Promise<void>((resolve, reject) => {
          const newScript = document.createElement('script');
          
          // Copy attributes
          Array.from(oldScript.attributes).forEach((attr) => {
            newScript.setAttribute(attr.name, attr.value);
          });
          
          // Mark as executed
          newScript.setAttribute('data-executed', 'true');
          
          // Add load event listener
          newScript.onload = () => {
            console.log(`✅ [PREVIEW] External script loaded: ${newScript.src}`);
            resolve();
          };
          
          newScript.onerror = () => {
            console.error(`❌ [PREVIEW] Failed to load: ${newScript.src}`);
            reject();
          };
          
          // Replace and trigger load
          oldScript.parentNode?.replaceChild(newScript, oldScript);
        });
      });

      // After all external scripts loaded, execute inline scripts
      Promise.all(loadPromises).then(() => {
        console.log(`⏳ [PREVIEW] All external scripts loaded for ${embedId}, executing inline scripts...`);
        
        // Small delay to ensure Chart.js is fully initialized
        setTimeout(() => {
          inlineScripts.forEach((oldScript) => {
            const newScript = document.createElement('script');
            
            // Copy inline script content
            if (oldScript.textContent) {
              newScript.textContent = oldScript.textContent;
            }
            
            // Mark as executed
            newScript.setAttribute('data-executed', 'true');
            
            // Replace old script with new one
            oldScript.parentNode?.replaceChild(newScript, oldScript);
            
            console.log(`✅ [PREVIEW] Inline script executed in ${embedId}`);
          });
        }, 100);
      }).catch((error) => {
        console.error(`❌ [PREVIEW] Script loading failed for ${embedId}:`, error);
      });
    });
    }, 300); // 300ms debounce

    // Cleanup timer on unmount or dependency change
    return () => clearTimeout(timer);
  }, [formData.content, formData.media]); // Re-run when content or media changes

  // Enhanced Markdown Parser für Preview
  const parseMarkdownToHTML = (markdown: string): string => {
    let html = markdown;

    // 0. ABSATZ-TRENNER (---) PARSEN
    html = html.replace(/^---$/gm, '<hr style="border: none; border-top: 1px solid var(--lyd-line); margin: var(--spacing-lg) 0;" />');

    // 1. TABELLEN PARSEN (Markdown Tables)
    html = html.replace(/(\|.+\|[\r\n]+\|[-:\s|]+\|[\r\n]+(?:\|.+\|[\r\n]*)+)/g, (match) => {
      const lines = match.trim().split('\n');
      const headers = lines[0].split('|').filter(cell => cell.trim());
      const rows = lines.slice(2).map(row => row.split('|').filter(cell => cell.trim()));
      
      let table = '<table style="width: 100%; border-collapse: collapse; margin: var(--spacing-md) 0; font-size: 0.875rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">';
      
      // Header - Deutlich sichtbar mit Primary Color
      table += '<thead style="background: linear-gradient(135deg, var(--lyd-primary) 0%, var(--lyd-deep-blue) 100%); border-bottom: 3px solid var(--lyd-primary);"><tr>';
      headers.forEach(header => {
        table += `<th style="
          padding: var(--spacing-sm) var(--spacing-md);
          text-align: left;
          font-weight: 700;
          font-size: 0.875rem;
          color: white;
          border: 1px solid rgba(255,255,255,0.2);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        ">${header.trim()}</th>`;
      });
      table += '</tr></thead>';
      
      // Body
      table += '<tbody>';
      rows.forEach((row, idx) => {
        const bgColor = idx % 2 === 0 ? 'white' : 'var(--lyd-accent)';
        table += `<tr style="background: ${bgColor}; transition: background 0.2s ease;">`;
        row.forEach(cell => {
          table += `<td style="
            padding: var(--spacing-sm) var(--spacing-md);
            border: 1px solid var(--lyd-line);
            color: var(--lyd-text);
          ">${cell.trim()}</td>`;
        });
        table += '</tr>';
      });
      table += '</tbody></table>';
      
      return table;
    });

    // 2. CHECKBOXEN PARSEN (- [ ] und - [x])
    html = html.replace(/^- \[([ x])\]\s+(.+)$/gm, (match, checked, text) => {
      const isChecked = checked.toLowerCase() === 'x';
      const svgCheckmark = isChecked 
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" style="width: 12px; height: 12px;"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" /></svg>'
        : '';
      
      return `
        <div style="display: flex; align-items: center; gap: var(--spacing-xs); margin: 8px 0;">
          <span style="
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 18px;
            height: 18px;
            border: 2px solid var(--lyd-primary);
            border-radius: 4px;
            background: ${isChecked ? 'var(--lyd-primary)' : 'transparent'};
            flex-shrink: 0;
          ">
            ${svgCheckmark}
          </span>
          <span style="flex: 1; ${isChecked ? 'text-decoration: line-through; color: var(--lyd-gray-600);' : ''}">${text}</span>
        </div>
      `;
    });

    // 3. BULLETPOINTS PARSEN (- Text ohne Checkbox)
    const bulletLines: string[] = [];
    let inList = false;
    
    html.split('\n').forEach(line => {
      const bulletMatch = line.match(/^- ([^[].*)/); // Matches "- Text" but not "- [" (checkbox)
      
      if (bulletMatch) {
        if (!inList) {
        bulletLines.push('<ul style="list-style: none; padding-left: 0; margin: var(--spacing-md) 0;">');
        inList = true;
      }
      bulletLines.push(`
        <li style="display: flex; gap: var(--spacing-xs); margin-bottom: 8px; padding-left: var(--spacing-sm);">
          <span style="color: var(--lyd-primary); font-weight: 700; flex-shrink: 0;">•</span>
          <span style="flex: 1;">${bulletMatch[1]}</span>
        </li>
      `);
      } else {
        if (inList) {
          bulletLines.push('</ul>');
          inList = false;
        }
        bulletLines.push(line);
      }
    });
    
    if (inList) bulletLines.push('</ul>');
    html = bulletLines.join('\n');

    // 4. HEADLINES
    html = html.replace(/^#{1,6}\s(.+)$/gm, (match, p1) => {
      const level = match.split(' ')[0].length;
      let topMargin = 'var(--spacing-md)';
      if (level === 1) topMargin = 'var(--spacing-lg)';
      if (level >= 3) topMargin = 'var(--spacing-lg)';  // H3+ brauchen mehr Abstand
      const bottomMargin = 'var(--spacing-sm)';
      return `<h${level} style="font-weight: 600; margin-top: ${topMargin}; margin-bottom: ${bottomMargin}; color: var(--lyd-primary); text-align: left;">${p1}</h${level}>`;
    });

    // 5. BOLD & ITALIC
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // 6. PARAGRAPH BREAKS
    html = html.replace(/\n\n/g, '<div style="margin: var(--spacing-md) 0;"></div>');

    return html;
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
      title="Artikel bearbeiten"
      subtitle={post.title}
      breadcrumbLink="/dashboard/blog"
      breadcrumbLabel="Blog Übersicht"
      fullWidth={true}
    >
      {/* Split-View Container */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr', 
        gap: 'var(--spacing-md)',
        height: 'calc(100vh - var(--header-height) - 40px)',
        overflow: 'hidden'
      }}>
        
        {/* EDITOR (LEFT - 2/3) */}
        <div style={{ 
          overflowY: 'auto',
          paddingRight: 'var(--spacing-sm)'
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            
            {/* Unsaved Changes Warning */}
            {hasUnsavedChanges && (
              <div style={{
                padding: 'var(--spacing-md)',
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                border: '2px solid #f59e0b',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                boxShadow: '0 2px 4px rgba(245, 158, 11, 0.1)'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#92400e', marginBottom: 'var(--spacing-xs)' }}>
                    Nicht gespeicherte Änderungen
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#78350f' }}>
                    Ihre Media-Änderungen wurden vorgenommen, aber noch nicht in der Datenbank gespeichert. 
                    Klicken Sie auf <strong>"Veröffentlichen"</strong> oder <strong>"Als Entwurf speichern"</strong> unten, um die Änderungen dauerhaft zu speichern.
                  </div>
                </div>
              </div>
            )}

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
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                <button
                  type="submit"
                  className="lyd-button outline"
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
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>Basis-Informationen</h2>
          </div>
          <div className="lyd-card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <div>
                <label htmlFor="title" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600', fontSize: '0.875rem' }}>
                  Titel *
                </label>
                <input
                  id="title"
                  className="lyd-input"
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                  maxLength={120}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--spacing-xs)' }}>
                  <small style={{ color: 'var(--lyd-gray-600)' }}>
                    Slug wird automatisch generiert
                  </small>
                  <small style={{ color: (formData.title?.length || 0) > 100 ? 'var(--lyd-warning)' : 'var(--lyd-gray-600)' }}>
                    {formData.title?.length || 0}/120 Zeichen
                  </small>
                </div>
              </div>

              <div>
                <label htmlFor="slug" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600', fontSize: '0.875rem' }}>
                  Slug (URL) *
                </label>
                <input
                  id="slug"
                  className="lyd-input"
                  type="text"
                  value={formData.slug || ''}
                  onChange={(e) => updateField('slug', e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="excerpt" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600', fontSize: '0.875rem' }}>
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
                  style={{ width: '100%' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--spacing-xs)' }}>
                  <small style={{ color: 'var(--lyd-gray-600)' }}>
                    Wird in Suchergebnissen und Social Media angezeigt
                  </small>
                  <small style={{ color: (formData.excerpt?.length || 0) > 180 ? 'var(--lyd-warning)' : 'var(--lyd-gray-600)' }}>
                    {formData.excerpt?.length || 0}/200 Zeichen
                  </small>
                </div>
              </div>

              <div>
                <label htmlFor="content" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600', fontSize: '0.875rem' }}>
                  Inhalt (Markdown) *
                </label>
                <textarea
                  id="content"
                  className="lyd-input"
                  value={formData.content || ''}
                  onChange={(e) => updateField('content', e.target.value)}
                  required
                  rows={15}
                  style={{ fontFamily: 'monospace', fontSize: '0.875rem', width: '100%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category & Platforms */}
        <div className="lyd-card">
          <div className="lyd-card-header">
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>Kategorisierung</h2>
          </div>
          <div className="lyd-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
              <div>
                <label htmlFor="category" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600', fontSize: '0.875rem' }}>
                  Kategorie *
                </label>
                <input
                  id="category"
                  className="lyd-input"
                  type="text"
                  value={formData.category || ''}
                  onChange={(e) => updateField('category', e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="subcategory" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600', fontSize: '0.875rem' }}>
                  Unterkategorie
                </label>
                <input
                  id="subcategory"
                  className="lyd-input"
                  type="text"
                  value={formData.subcategory || ''}
                  onChange={(e) => updateField('subcategory', e.target.value)}
                />
              </div>
            </div>

            <div style={{ marginTop: 'var(--spacing-md)' }}>
              <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600', fontSize: '0.875rem' }}>
                Plattformen *
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {['WOHNEN', 'MAKLER', 'ENERGIE'].map(platform => (
                  <label 
                    key={platform} 
                    className={`lyd-checkbox-group ${formData.platforms?.includes(platform) ? 'active' : ''}`}
                  >
                    <input
                      type="checkbox"
                      className="lyd-checkbox-input"
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
                    <span className="lyd-checkbox">
                      <svg className="lyd-checkbox-checkmark" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="lyd-checkbox-label">{platform}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Status & Publishing */}
        <div className="lyd-card">
          <div className="lyd-card-header">
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>Status & Veröffentlichung</h2>
          </div>
          <div className="lyd-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
              <div>
                <label htmlFor="status" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600', fontSize: '0.875rem' }}>
                  Status *
                </label>
                <CustomSelect
                  value={formData.status || 'DRAFT'}
                  onChange={(value) => updateField('status', value)}
                  options={[
                    { value: 'DRAFT', label: 'Entwurf' },
                    { value: 'REVIEW', label: 'Review' },
                    { value: 'SCHEDULED', label: 'Geplant' },
                    { value: 'PUBLISHED', label: 'Veröffentlicht' },
                    { value: 'ARCHIVED', label: 'Archiviert' }
                  ]}
                />
              </div>

              {formData.status === 'SCHEDULED' && (
                <div>
                  <label htmlFor="scheduledFor" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600', fontSize: '0.875rem' }}>
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
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>SEO & Meta-Daten</h2>
          </div>
          <div className="lyd-card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <div>
                <label htmlFor="metaTitle" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600', fontSize: '0.875rem' }}>
                  Meta Titel
                </label>
                <input
                  id="metaTitle"
                  className="lyd-input"
                  type="text"
                  value={formData.metaTitle || ''}
                  onChange={(e) => updateField('metaTitle', e.target.value)}
                  maxLength={120}
                />
              </div>

              <div>
                <label htmlFor="metaDescription" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600', fontSize: '0.875rem' }}>
                  Meta Beschreibung
                </label>
                <textarea
                  id="metaDescription"
                  className="lyd-input"
                  value={formData.metaDescription || ''}
                  onChange={(e) => updateField('metaDescription', e.target.value)}
                  maxLength={200}
                  rows={3}
                  style={{ width: '100%' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--spacing-xs)' }}>
                  <small style={{ color: 'var(--lyd-gray-600)' }}>
                    Leer = Zusammenfassung wird verwendet • Optimal: 150-160 Zeichen
                  </small>
                  <small style={{ color: (formData.metaDescription?.length || 0) > 180 ? 'var(--lyd-warning)' : 'var(--lyd-gray-600)' }}>
                    {formData.metaDescription?.length || 0}/200 Zeichen
                  </small>
                </div>
              </div>

              <div>
                <label htmlFor="focusKeyword" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600', fontSize: '0.875rem' }}>
                  Focus Keyword
                </label>
                <input
                  id="focusKeyword"
                  className="lyd-input"
                  type="text"
                  value={formData.focusKeyword || ''}
                  onChange={(e) => updateField('focusKeyword', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Media Management */}
        <MediaManager
          content={formData.content || ''}
          media={formData.media || null}
          onMediaUpdate={(media) => updateField('media', media)}
        />

      </form>
        </div>

        {/* PREVIEW (RIGHT - 1/3) */}
        <div style={{ 
          position: 'sticky',
          top: 0,
          height: 'calc(100vh - var(--header-height) - 40px)',
          overflowY: 'auto',
          backgroundColor: 'var(--lyd-accent)',
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-md)'
        }}>
          <div className="lyd-card">
            <div className="lyd-card-header">
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>Live Preview</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--lyd-gray-600)', marginTop: 'var(--spacing-xs)' }}>
                Vorschau des Blog-Artikels
              </p>
            </div>
            <div className="lyd-card-body">
              {/* Article Preview */}
              <article style={{
                fontFamily: 'var(--font-family-primary)',
                color: 'var(--lyd-text)',
                lineHeight: 1.6
              }}>
                {/* Title */}
                <h1 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700', 
                  marginBottom: 'var(--spacing-sm)',
                  color: 'var(--lyd-primary)'
                }}>
                  {formData.title || 'Titel des Artikels'}
                </h1>

                {/* Meta Info */}
                <div style={{ 
                  display: 'flex', 
                  gap: 'var(--spacing-sm)', 
                  fontSize: '0.75rem', 
                  color: 'var(--lyd-gray-600)',
                  marginBottom: 'var(--spacing-md)',
                  borderBottom: '1px solid var(--lyd-line)',
                  paddingBottom: 'var(--spacing-sm)'
                }}>
                  <span>{formData.category || 'Kategorie'}</span>
                  {formData.subcategory && <span>• {formData.subcategory}</span>}
                </div>

                {/* Excerpt */}
                {formData.excerpt && (
                  <p style={{ 
                    fontSize: '1rem', 
                    fontWeight: '500',
                    fontStyle: 'italic',
                    color: 'var(--lyd-gray-700)',
                    marginBottom: 'var(--spacing-md)',
                    padding: 'var(--spacing-sm)',
                    borderLeft: '3px solid var(--lyd-primary)',
                    backgroundColor: 'var(--lyd-accent)'
                  }}>
                    {formData.excerpt}
                  </p>
                )}

                {/* Content Preview */}
                <div 
                  ref={previewRef}
                  style={{ 
                    fontSize: '1rem',
                    color: 'var(--lyd-text)',
                    lineHeight: 1.6
                  }}
                >
                  {formData.content ? (
                    <div dangerouslySetInnerHTML={{ 
                      __html: renderMediaInContent(
                        parseMarkdownToHTML(formData.content),
                        formData.media || null
                      )
                    }} />
                  ) : (
                    <p style={{ color: 'var(--lyd-gray-500)', fontStyle: 'italic' }}>
                      Inhalt wird hier in der Vorschau angezeigt...
                    </p>
                  )}
                </div>
              </article>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
