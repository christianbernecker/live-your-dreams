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
  const [isValid, setIsValid] = useState(false);
  const [sanitizedHTML, setSanitizedHTML] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);

  const handleValidate = () => {
    setValidating(true);
    setError(null);
    setIsValid(false);

    // Kleine Verzögerung für visuelles Feedback
    setTimeout(() => {
      const validation = validateHTMLEmbed(code);
      
      if (!validation.valid) {
        setError(validation.error || 'Validation fehlgeschlagen');
        setValidating(false);
        return;
      }

      // Validation erfolgreich
      setSanitizedHTML(validation.sanitized || code);
      setIsValid(true);
      setValidating(false);
    }, 100);
  };

  const handleSave = () => {
    if (isValid && sanitizedHTML) {
      onSave(sanitizedHTML);
    }
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
            setIsValid(false); // Bei Änderung Validierung zurücksetzen
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
            color: 'var(--lyd-error)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <div>
              <strong>Validation Fehler:</strong> {error}
            </div>
          </div>
        )}
        {isValid && !error && (
          <div style={{
            marginTop: 'var(--spacing-xs)',
            padding: 'var(--spacing-sm)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid var(--lyd-success)',
            borderRadius: 'var(--border-radius-sm)',
            fontSize: '0.875rem',
            color: 'var(--lyd-success)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <div>
              <strong>Validierung erfolgreich!</strong> Sie können jetzt speichern.
            </div>
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
        <br/><br/>
        <strong>Scripts:</strong> Chart.js, D3.js und andere CDN-Scripts (cdn.jsdelivr.net, cdnjs.cloudflare.com, unpkg.com) sind erlaubt.
        <br/>
        Inline Scripts werden auf gefährliche Patterns (eval, document.write, localStorage) geprüft.
      </div>

      {/* Actions */}
      <div style={{ 
        display: 'flex', 
        gap: 'var(--spacing-sm)', 
        justifyContent: 'flex-end' 
      }}>
        <button
          type="button"
          onClick={onCancel}
          className="lyd-button outline"
          disabled={validating}
        >
          Abbrechen
        </button>
        <button
          type="button"
          onClick={handleValidate}
          className="lyd-button secondary"
          disabled={!code.trim() || validating}
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {validating ? 'Validiere...' : 'Validieren'}
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="lyd-button primary"
          disabled={!isValid}
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
            <polyline points="7 3 7 8 15 8"/>
          </svg>
          Speichern
        </button>
      </div>

      {/* Preview (validiertes HTML) */}
      {isValid && sanitizedHTML && !error && (
        <div style={{ marginTop: 'var(--spacing-md)' }}>
          <div style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            marginBottom: 'var(--spacing-xs)',
            color: 'var(--lyd-gray-700)'
          }}>
            Vorschau (validiertes HTML):
          </div>
          <div 
            style={{
              border: '1px solid var(--lyd-line)',
              borderRadius: 'var(--border-radius-sm)',
              padding: 'var(--spacing-md)',
              backgroundColor: 'var(--lyd-accent)',
              overflow: 'auto'
            }}
            dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
          />
        </div>
      )}
    </div>
  );
}
