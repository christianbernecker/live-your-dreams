'use client';

import { useState } from 'react';

interface ImagePreviewProps {
  url: string;
  alt: string;
  onDelete?: () => void;
  onUpdateAlt?: (alt: string) => void;
  showAltEditor?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ImagePreview({
  url,
  alt,
  onDelete,
  onUpdateAlt,
  showAltEditor = true,
  size = 'md'
}: ImagePreviewProps) {
  const [editingAlt, setEditingAlt] = useState(false);
  const [tempAlt, setTempAlt] = useState(alt);
  const [deleting, setDeleting] = useState(false);

  const sizeStyles = {
    sm: { width: '100px', height: '100px' },
    md: { width: '200px', height: '150px' },
    lg: { width: '300px', height: '225px' }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setDeleting(true);
    try {
      // Optional: Delete from Vercel Blob
      await fetch(`/api/media/upload?url=${encodeURIComponent(url)}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      onDelete();
      setDeleting(false);
    }
  };

  const handleSaveAlt = () => {
    if (onUpdateAlt && tempAlt !== alt) {
      onUpdateAlt(tempAlt);
    }
    setEditingAlt(false);
  };

  return (
    <div style={{
      border: '1px solid var(--lyd-line)',
      borderRadius: 'var(--border-radius-md)',
      padding: 'var(--spacing-sm)',
      backgroundColor: 'white'
    }}>
      {/* Image Thumbnail */}
      <div style={{
        ...sizeStyles[size],
        position: 'relative',
        borderRadius: 'var(--border-radius-sm)',
        overflow: 'hidden',
        backgroundColor: 'var(--lyd-accent)',
        marginBottom: 'var(--spacing-sm)'
      }}>
        <img
          src={url}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        
        {/* Delete Button Overlay */}
        {onDelete && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              position: 'absolute',
              top: 'var(--spacing-xs)',
              right: 'var(--spacing-xs)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              cursor: deleting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              opacity: deleting ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (!deleting) e.currentTarget.style.backgroundColor = 'var(--lyd-error)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            }}
          >
            {deleting ? (
              <span style={{ fontSize: '12px' }}>...</span>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3,6 5,6 21,6"/>
                <path d="m19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Alt Text Editor */}
      {showAltEditor && (
        <div>
          {editingAlt ? (
            <div>
              <textarea
                className="lyd-input"
                value={tempAlt}
                onChange={(e) => setTempAlt(e.target.value)}
                rows={2}
                placeholder="Alt-Text für Barrierefreiheit..."
                style={{ 
                  width: '100%', 
                  fontSize: '0.875rem',
                  marginBottom: 'var(--spacing-xs)'
                }}
              />
              <div style={{ display: 'flex', gap: 'var(--spacing-xs)', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => {
                    setTempAlt(alt);
                    setEditingAlt(false);
                  }}
                  className="lyd-button outline sm"
                  style={{ fontSize: '0.75rem' }}
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleSaveAlt}
                  className="lyd-button primary sm"
                  style={{ fontSize: '0.75rem' }}
                >
                  Speichern
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => onUpdateAlt && setEditingAlt(true)}
              style={{
                fontSize: '0.875rem',
                color: alt ? 'var(--lyd-text)' : 'var(--lyd-gray-500)',
                fontStyle: alt ? 'normal' : 'italic',
                cursor: onUpdateAlt ? 'pointer' : 'default',
                padding: 'var(--spacing-xs)',
                borderRadius: 'var(--border-radius-sm)',
                backgroundColor: onUpdateAlt ? 'var(--lyd-accent)' : 'transparent',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (onUpdateAlt) e.currentTarget.style.backgroundColor = 'var(--lyd-line)';
              }}
              onMouseLeave={(e) => {
                if (onUpdateAlt) e.currentTarget.style.backgroundColor = 'var(--lyd-accent)';
              }}
            >
              <strong style={{ fontSize: '0.75rem', color: 'var(--lyd-gray-600)' }}>Alt:</strong> {alt || 'Klicken zum Bearbeiten'}
            </div>
          )}
        </div>
      )}

      {/* URL Info */}
      <div style={{
        marginTop: 'var(--spacing-xs)',
        fontSize: '0.7rem',
        color: 'var(--lyd-gray-500)',
        wordBreak: 'break-all'
      }}>
        {url.length > 50 ? `${url.substring(0, 50)}...` : url}
      </div>
    </div>
  );
}
