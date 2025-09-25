'use client'

import React, { useCallback, useState } from 'react'

interface FileUploadProps {
  onFileSelect: (files: File[]) => void
  accept?: string
  multiple?: boolean
  maxSize?: number // in MB
  maxFiles?: number
  className?: string
  disabled?: boolean
}

export function FileUpload({ 
  onFileSelect, 
  accept = "image/*", 
  multiple = false, 
  maxSize = 10,
  maxFiles = 5,
  className,
  disabled = false
}: FileUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [uploadProgress] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const validateFiles = useCallback((files: FileList) => {
    const fileArray = Array.from(files)
    const errors: string[] = []

    if (multiple && fileArray.length > maxFiles) {
      errors.push(`Maximal ${maxFiles} Dateien erlaubt`)
    }

    fileArray.forEach(file => {
      if (file.size > maxSize * 1024 * 1024) {
        errors.push(`${file.name} ist zu groß (max. ${maxSize}MB)`)
      }
    })

    return { valid: errors.length === 0, errors }
  }, [multiple, maxFiles, maxSize])

  const handleFiles = useCallback((files: FileList) => {
    const validation = validateFiles(files)
    
    if (!validation.valid) {
      setError(validation.errors.join(', '))
      return
    }

    setError(null)
    const fileArray = Array.from(files)
    onFileSelect(fileArray)
  }, [validateFiles, onFileSelect])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragActive(false)

    if (disabled) return

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFiles(files)
    }
  }, [disabled, handleFiles])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragActive(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragActive(false)
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFiles(files)
    }
  }, [handleFiles])

  return (
    <div className={className}>
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{
          border: `2px dashed ${
            error ? 'var(--lyd-error)' :
            isDragActive ? 'var(--lyd-primary)' : 
            'var(--lyd-line)'
          }`,
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-2xl)',
          textAlign: 'center',
          backgroundColor: isDragActive ? 'var(--lyd-accent)' : 'transparent',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          opacity: disabled ? 0.6 : 1
        }}
        onClick={() => {
          if (!disabled) {
            document.getElementById('file-input')?.click()
          }
        }}
      >
        <input
          id="file-input"
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          disabled={disabled}
          style={{ display: 'none' }}
        />

        {/* Upload Icon */}
        <div style={{ marginBottom: 'var(--spacing-md)' }}>
          <svg 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1"
            style={{ 
              color: error ? 'var(--lyd-error)' : 
                     isDragActive ? 'var(--lyd-primary)' : 
                     'var(--lyd-grey)',
              margin: '0 auto'
            }}
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17,8 12,3 7,8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        </div>

        {/* Upload Text */}
        <div style={{ marginBottom: 'var(--spacing-sm)' }}>
          <p style={{
            fontSize: 'var(--font-size-md)',
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--lyd-text)',
            margin: 0,
            fontFamily: 'var(--font-family-primary)'
          }}>
            {isDragActive ? 'Dateien hier ablegen...' : 'Dateien hochladen'}
          </p>
        </div>

        <div>
          <p style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--lyd-grey)',
            margin: 0,
            fontFamily: 'var(--font-family-primary)'
          }}>
            Ziehen Sie Dateien hierher oder{' '}
            <span style={{ 
              color: 'var(--lyd-primary)',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}>
              klicken Sie zum Auswählen
            </span>
          </p>
          
          <p style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--lyd-grey)',
            margin: '4px 0 0 0',
            fontFamily: 'var(--font-family-primary)'
          }}>
            {accept === 'image/*' ? 'Nur Bilder' : accept} • Max. {maxSize}MB{multiple ? ` • Bis zu ${maxFiles} Dateien` : ''}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      {uploadProgress !== null && (
        <div style={{
          marginTop: 'var(--spacing-md)',
          backgroundColor: 'var(--lyd-accent)',
          borderRadius: 'var(--border-radius-full)',
          height: '8px',
          overflow: 'hidden'
        }}>
          <div
            style={{
              height: '100%',
              backgroundColor: 'var(--lyd-primary)',
              width: `${uploadProgress}%`,
              transition: 'width 0.3s ease',
              borderRadius: 'var(--border-radius-full)'
            }}
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{
          marginTop: 'var(--spacing-md)',
          padding: 'var(--spacing-sm) var(--spacing-md)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderRadius: 'var(--border-radius-md)',
          color: 'var(--lyd-error)',
          fontSize: 'var(--font-size-sm)',
          borderLeft: '4px solid var(--lyd-error)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-sm)'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          {error}
        </div>
      )}
    </div>
  )
}

// Preview Component for uploaded files
interface FilePreviewProps {
  files: File[]
  onRemove: (index: number) => void
}

export function FilePreview({ files, onRemove }: FilePreviewProps) {
  if (files.length === 0) return null

  return (
    <div style={{
      marginTop: 'var(--spacing-lg)',
      display: 'grid',
      gap: 'var(--spacing-md)'
    }}>
      <h4 style={{
        fontSize: 'var(--font-size-sm)',
        fontWeight: 'var(--font-weight-medium)',
        color: 'var(--lyd-text)',
        margin: 0,
        fontFamily: 'var(--font-family-primary)'
      }}>
        Ausgewählte Dateien ({files.length})
      </h4>

      <div style={{
        display: 'grid',
        gap: 'var(--spacing-sm)'
      }}>
        {files.map((file, index) => (
          <div
            key={`${file.name}-${index}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              padding: 'var(--spacing-sm)',
              border: '1px solid var(--lyd-line)',
              borderRadius: 'var(--border-radius-md)',
              backgroundColor: 'var(--lyd-accent)'
            }}
          >
            {/* File Icon */}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--border-radius-sm)',
              backgroundColor: 'var(--lyd-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
              </svg>
            </div>

            {/* File Info */}
            <div style={{ flex: 1 }}>
              <p style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--lyd-text)',
                margin: 0,
                fontFamily: 'var(--font-family-primary)',
                lineHeight: '1.2'
              }}>
                {file.name}
              </p>
              <p style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--lyd-grey)',
                margin: '2px 0 0 0',
                fontFamily: 'var(--font-family-primary)'
              }}>
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => onRemove(index)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--lyd-error)',
                cursor: 'pointer',
                padding: 'var(--spacing-xs)',
                borderRadius: 'var(--border-radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Datei entfernen"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3,6 5,6 21,6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
