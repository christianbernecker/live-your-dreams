'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';

interface FileUploadProps {
  onUpload: (url: string) => void;
  onError: (error: string) => void;
  accept?: string;
  maxSize?: number;
  label?: string;
  currentUrl?: string | null;
  disabled?: boolean;
}

export function FileUpload({
  onUpload,
  onError,
  accept = 'image/jpeg,image/jpg,image/png,image/webp,image/gif',
  maxSize = 5 * 1024 * 1024, // 5MB
  label = 'Bild hochladen',
  currentUrl,
  disabled = false
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);
    setProgress(0);

    try {
      // Schritt 1: WebP-Transformation (0-30%)
      setProgress(10);
      console.log('Original file:', file.name, file.type, `${(file.size / 1024 / 1024).toFixed(2)}MB`);

      // Konvertiere alle Bilder zu WebP mit optimaler Kompression
      const webpFile = await imageCompression(file, {
        maxSizeMB: 1, // Maximale Größe 1MB
        maxWidthOrHeight: 2400, // Max 2400px Breite/Hööhe
        useWebWorker: true,
        fileType: 'image/webp', // Force WebP output
        initialQuality: 0.85, // Hohe Qualität für Blog-Bilder
      });

      setProgress(30);
      console.log('WebP file:', webpFile.name, webpFile.type, `${(webpFile.size / 1024 / 1024).toFixed(2)}MB`);

      // Schritt 2: Upload (30-100%)
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const formData = new FormData();
      // Stelle sicher dass die Datei .webp Extension hat
      const webpFileName = file.name.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '.webp');
      formData.append('file', webpFile, webpFileName);

      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload fehlgeschlagen');
      }

      const data = await response.json();
      onUpload(data.url);

    } catch (error) {
      console.error('Upload error:', error);
      onError(error instanceof Error ? error.message : 'Upload fehlgeschlagen');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [onUpload, onError]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: accept.split(',').reduce((acc, mime) => ({ ...acc, [mime]: [] }), {}),
    maxSize,
    multiple: false,
    disabled: disabled || uploading,
  });

  return (
    <div>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${
            isDragReject 
              ? 'var(--lyd-error)' 
              : isDragActive 
                ? 'var(--lyd-primary)' 
                : 'var(--lyd-line)'
          }`,
          borderRadius: 'var(--border-radius-md)',
          padding: 'var(--spacing-lg)',
          textAlign: 'center',
          cursor: disabled || uploading ? 'not-allowed' : 'pointer',
          backgroundColor: isDragActive ? 'var(--lyd-accent)' : 'transparent',
          transition: 'all 0.2s ease',
          opacity: disabled || uploading ? 0.6 : 1,
        }}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <div>
            <div style={{ marginBottom: 'var(--spacing-sm)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--lyd-primary)', display: 'block', margin: '0 auto' }}>
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div style={{ fontWeight: '600', marginBottom: 'var(--spacing-xs)' }}>
              Lädt hoch... {progress}%
            </div>
            <div style={{
              width: '100%',
              height: '4px',
              backgroundColor: 'var(--lyd-line)',
              borderRadius: '2px',
              overflow: 'hidden',
              marginTop: 'var(--spacing-sm)'
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--lyd-primary), var(--lyd-deep-blue))',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        ) : isDragActive ? (
          <div>
            <div style={{ marginBottom: 'var(--spacing-sm)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--lyd-primary)', display: 'block', margin: '0 auto' }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </div>
            <div style={{ fontWeight: '600', color: 'var(--lyd-primary)' }}>
              Loslassen zum Hochladen
            </div>
          </div>
        ) : currentUrl ? (
          <div>
            <div style={{ marginBottom: 'var(--spacing-sm)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--lyd-success)', display: 'block', margin: '0 auto' }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div style={{ fontWeight: '600', color: 'var(--lyd-success)' }}>
              Bild hochgeladen
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--lyd-gray-600)', marginTop: 'var(--spacing-xs)' }}>
              Klicken oder ziehen für neues Bild
            </div>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: 'var(--spacing-sm)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--lyd-gray-400)', display: 'block', margin: '0 auto' }}>
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <div style={{ fontWeight: '600', marginBottom: 'var(--spacing-xs)' }}>
              {label}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--lyd-gray-600)' }}>
              Klicken oder Drag & Drop
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--lyd-gray-500)', marginTop: 'var(--spacing-xs)' }}>
              Max {Math.round(maxSize / 1024 / 1024)}MB • JPG, PNG, WebP, GIF
            </div>
          </div>
        )}
      </div>

      {/* URL Input Alternative */}
      <div style={{ 
        marginTop: 'var(--spacing-sm)',
        padding: 'var(--spacing-sm)',
        backgroundColor: 'var(--lyd-accent)',
        borderRadius: 'var(--border-radius-md)'
      }}>
        <label style={{ 
          display: 'block', 
          fontSize: '0.75rem', 
          fontWeight: '600', 
          marginBottom: 'var(--spacing-xs)',
          color: 'var(--lyd-gray-700)'
        }}>
          Oder URL eingeben (Unsplash, Pexels, etc.):
        </label>
        <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
          <input
            type="url"
            className="lyd-input"
            placeholder="https://images.unsplash.com/..."
            disabled={disabled || uploading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value) {
                onUpload(e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
            style={{ flex: 1, fontSize: '0.875rem' }}
          />
          <button
            type="button"
            className="lyd-button secondary sm"
            disabled={disabled || uploading}
            onClick={(e) => {
              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
              if (input.value) {
                onUpload(input.value);
                input.value = '';
              }
            }}
          >
            Übernehmen
          </button>
        </div>
      </div>
    </div>
  );
}
