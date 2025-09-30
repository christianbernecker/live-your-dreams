'use client';

import { validateHTMLEmbed } from '@/lib/media-validator';
import { useState } from 'react';

interface HTMLEmbedEditorProps {
  html: string | null;
  description: string;
  onSave: (html: string) => void;
  onCancel: () => void;
}

export function HTMLEmbedEditor({
  html,
  description,
  onSave,
  onCancel
}: HTMLEmbedEditorProps) {
  const [code, setCode] = useState(html || '');
  const [error, setError] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);

  const handleValidate = () => {
    setValidating(true);
    setError(null);

    const validation = validateHTMLEmbed(code);
    
    if (!validation.valid) {
      setError(validation.error || 'Validation fehlgeschlagen');
      setValidating(false);
      return;
    }

    // Save sanitized HTML
    setTimeout(() => {
      onSave(validation.sanitized || code);
      setValidating(false);
    }, 300);
  };

  return (
    <div style={{
      border: '1px solid var(--lyd-line)',
      borderRadius: 'var(--border-radius-md)',
      padding: 'var(--spacing-md)',
      backgroundColor: 'white'
    }}>
      <div style={{ marginBottom: 'var(--spacing-md)' }}>
        <h4 style={{ 
          fontSize: '1rem', 
          fontWeight: '600', 
          marginBottom: 'var(--spacing-xs)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-xs)'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
            <path d="M18 20V10"/>
            <path d="M12 20V4"/>
            <path d="M6 20v-6"/>
          </svg>
          HTML Embed: {description}
        </h4>
        <p style={{ 
          fontSize: '0.875rem', 
          color: 'var(--lyd-gray-600)',
          margin: 0
        }}>
          Fügen Sie iframe-Code oder HTML ein (z.B. YouTube, Datawrapper, Google Maps)
        </p>
      </div>

      {/* Code Textarea */}
      <div style={{ marginBottom: 'var(--spacing-md)' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '0.875rem', 
          fontWeight: '600', 
          marginBottom: 'var(--spacing-xs)' 
        }}>
          HTML/iframe Code:
        </label>
        <textarea
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(null);
          }}
          rows={8}
          className="lyd-input"
          placeholder='<iframe src="https://youtube.com/embed/..." width="560" height="315"></iframe>'
          style={{ 
            width: '100%',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            backgroundColor: 'var(--lyd-accent)'
          }}
        />
        {error && (
          <div style={{
            marginTop: 'var(--spacing-xs)',
            padding: 'var(--spacing-sm)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid var(--lyd-error)',
            borderRadius: 'var(--border-radius-sm)',
            fontSize: '0.875rem',
            color: 'var(--lyd-error)'
          }}>
            <strong>⚠️ Validation Fehler:</strong> {error}
          </div>
        )}
      </div>

      {/* Security Info */}
      <div style={{
        padding: 'var(--spacing-sm)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid var(--lyd-primary)',
        borderRadius: 'var(--border-radius-sm)',
        fontSize: '0.75rem',
        color: 'var(--lyd-gray-700)',
        marginBottom: 'var(--spacing-md)'
      }}>
        <strong>Sicherheit:</strong> Nur iframes von whitelisted Domains erlaubt:
        <br/>
        YouTube, Vimeo, Datawrapper, Google Maps, liveyourdreams.online
      </div>

      {/* Actions */}
      <div style={{ 
        display: 'flex', 
        gap: 'var(--spacing-sm)', 
        justifyContent: 'flex-end' 
      }}>
        <button
          onClick={onCancel}
          className="lyd-button outline"
          disabled={validating}
        >
          Abbrechen
        </button>
        <button
          onClick={handleValidate}
          className="lyd-button primary"
          disabled={!code.trim() || validating}
        >
          {validating ? 'Validiere...' : 'Speichern & Validieren'}
        </button>
      </div>

      {/* Preview (wenn HTML vorhanden) */}
      {html && !error && (
        <div style={{ marginTop: 'var(--spacing-md)' }}>
          <div style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            marginBottom: 'var(--spacing-xs)',
            color: 'var(--lyd-gray-700)'
          }}>
            Aktuelle Vorschau:
          </div>
          <div 
            style={{
              border: '1px solid var(--lyd-line)',
              borderRadius: 'var(--border-radius-sm)',
              padding: 'var(--spacing-md)',
              backgroundColor: 'var(--lyd-accent)',
              overflow: 'auto'
            }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      )}
    </div>
  );
}
