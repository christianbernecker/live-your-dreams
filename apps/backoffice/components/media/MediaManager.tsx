'use client';

import { HTMLMediaItem, ImageMediaItem, MediaItem, extractPlaceholders } from '@/types/media';
import { useState } from 'react';
import { FileUpload } from './FileUpload';
import { HTMLEmbedEditor } from './HTMLEmbedEditor';
import { ImagePreview } from './ImagePreview';

interface MediaManagerProps {
  content: string;
  media: MediaItem[] | null;
  onMediaUpdate: (media: MediaItem[]) => void;
}

export function MediaManager({
  content,
  media,
  onMediaUpdate
}: MediaManagerProps) {
  const [editingHTML, setEditingHTML] = useState<string | null>(null);
  const placeholders = extractPlaceholders(content);
  const currentMedia = media || [];

  // Featured Image Helper
  const featuredImage = currentMedia.find(m => m.type === 'image' && m.isFeatured) as ImageMediaItem | undefined;

  // Update or Add Media Item
  const updateMedia = (item: MediaItem) => {
    const existing = currentMedia.find(m => m.id === item.id);
    if (existing) {
      onMediaUpdate(currentMedia.map(m => m.id === item.id ? item : m));
    } else {
      onMediaUpdate([...currentMedia, item]);
    }
  };

  // Delete Media Item
  const deleteMedia = (id: string) => {
    onMediaUpdate(currentMedia.filter(m => m.id !== id));
  };

  // Get Media for Placeholder
  const getMediaForPlaceholder = (id: string, type: string) => {
    return currentMedia.find(m => m.id === id && m.type === type);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
      
      {/* Featured Image */}
      <div className="lyd-card">
        <div className="lyd-card-header">
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
            <span style={{ fontSize: '1.5rem' }}>🖼️</span>
            Featured Image
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--lyd-gray-600)', marginTop: 'var(--spacing-xs)' }}>
            Haupt-Bild für Artikel-Header und Social Media
          </p>
        </div>
        <div className="lyd-card-body">
          {featuredImage?.url ? (
            <ImagePreview
              url={featuredImage.url}
              alt={featuredImage.alt}
              onDelete={() => deleteMedia('featured')}
              onUpdateAlt={(alt) => updateMedia({ ...featuredImage, alt })}
              size="lg"
            />
          ) : (
            <FileUpload
              onUpload={(url) => updateMedia({
                id: 'featured',
                type: 'image',
                url,
                alt: 'Featured Image',
                description: 'Haupt-Bild des Artikels',
                isFeatured: true,
                position: 'header'
              } as ImageMediaItem)}
              onError={(error) => alert(error)}
              label="Featured Image hochladen"
            />
          )}
        </div>
      </div>

      {/* Content Placeholders */}
      {placeholders.length > 0 && (
        <div className="lyd-card">
          <div className="lyd-card-header">
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
              <span style={{ fontSize: '1.5rem' }}>📎</span>
              Content Medien ({placeholders.length})
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--lyd-gray-600)', marginTop: 'var(--spacing-xs)' }}>
              Erkannte Placeholders im Artikel-Content
            </p>
          </div>
          <div className="lyd-card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              {placeholders.map(placeholder => {
                const mediaItem = getMediaForPlaceholder(placeholder.id, placeholder.type);
                
                if (placeholder.type === 'image') {
                  const imageItem = mediaItem as ImageMediaItem | undefined;
                  return (
                    <div key={placeholder.id} style={{
                      padding: 'var(--spacing-md)',
                      border: '1px solid var(--lyd-line)',
                      borderRadius: 'var(--border-radius-md)',
                      backgroundColor: 'var(--lyd-accent)'
                    }}>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        marginBottom: 'var(--spacing-sm)',
                        fontFamily: 'monospace',
                        color: 'var(--lyd-primary)'
                      }}>
                        {`{{image:${placeholder.id}}}`}
                      </div>
                      {imageItem?.url ? (
                        <ImagePreview
                          url={imageItem.url}
                          alt={imageItem.alt}
                          onDelete={() => deleteMedia(placeholder.id)}
                          onUpdateAlt={(alt) => updateMedia({ ...imageItem, alt })}
                          size="md"
                        />
                      ) : (
                        <FileUpload
                          onUpload={(url) => updateMedia({
                            id: placeholder.id,
                            type: 'image',
                            url,
                            alt: `Bild ${placeholder.id}`,
                            description: imageItem?.description || `Bild ${placeholder.id}`,
                            isFeatured: false,
                            position: 'content'
                          } as ImageMediaItem)}
                          onError={(error) => alert(error)}
                          label={`Bild für ${placeholder.id} hochladen`}
                        />
                      )}
                    </div>
                  );
                } else {
                  const htmlItem = mediaItem as HTMLMediaItem | undefined;
                  return (
                    <div key={placeholder.id}>
                      {editingHTML === placeholder.id ? (
                        <HTMLEmbedEditor
                          html={htmlItem?.html || null}
                          description={placeholder.id}
                          onSave={(html) => {
                            updateMedia({
                              id: placeholder.id,
                              type: 'html',
                              html,
                              description: htmlItem?.description || `HTML Embed ${placeholder.id}`,
                              data: htmlItem?.data,
                              position: 'content'
                            } as HTMLMediaItem);
                            setEditingHTML(null);
                          }}
                          onCancel={() => setEditingHTML(null)}
                        />
                      ) : (
                        <div style={{
                          padding: 'var(--spacing-md)',
                          border: '1px solid var(--lyd-line)',
                          borderRadius: 'var(--border-radius-md)',
                          backgroundColor: htmlItem?.html ? 'rgba(34, 197, 94, 0.1)' : 'var(--lyd-accent)'
                        }}>
                          <div style={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            marginBottom: 'var(--spacing-sm)',
                            fontFamily: 'monospace',
                            color: 'var(--lyd-primary)'
                          }}>
                            {`{{html:${placeholder.id}}}`}
                          </div>
                          <button
                            onClick={() => setEditingHTML(placeholder.id)}
                            className="lyd-button secondary sm"
                            style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}
                          >
                            <span style={{ fontSize: '1rem' }}>📊</span>
                            {htmlItem?.html ? 'HTML bearbeiten' : 'HTML einfügen'}
                          </button>
                          {htmlItem?.html && (
                            <div style={{ marginTop: 'var(--spacing-sm)', fontSize: '0.875rem', color: 'var(--lyd-success)' }}>
                              ✓ HTML-Code vorhanden
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
