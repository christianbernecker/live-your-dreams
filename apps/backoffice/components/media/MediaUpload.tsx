'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface MediaFile {
  id: string
  filename: string
  originalName: string
  url: string
  mimeType: string
  size: number
  altText: string
  description: string
  createdAt: string
}

interface MediaUploadProps {
  onUploadSuccess?: (files: MediaFile[]) => void
  maxFiles?: number
  accept?: string[]
  maxSize?: number
}

export default function MediaUpload({ 
  onUploadSuccess, 
  maxFiles = 5, 
  accept = ['image/*'],
  maxSize = 10 * 1024 * 1024 // 10MB
}: MediaUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null)
    setUploading(true)
    
    const uploadPromises = acceptedFiles.map(async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('alt', `${file.name}`)
      formData.append('description', `Uploaded ${file.name}`)

      try {
        const response = await fetch('/api/media/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Upload failed')
        }

        const result = await response.json()
        return result.media
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error)
        throw error
      }
    })

    try {
      const uploadedFiles = await Promise.all(uploadPromises)
      onUploadSuccess?.(uploadedFiles)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
      setUploadProgress({})
    }
  }, [onUploadSuccess])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles,
    maxSize,
    disabled: uploading,
  })

  return (
    <div className="lyd-card">
      <div 
        {...getRootProps()} 
        className={`
          p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${uploading ? 'cursor-not-allowed opacity-50' : ''}
        `}
        style={{
          backgroundColor: isDragActive ? 'var(--lyd-accent)' : 'transparent',
          borderColor: isDragActive ? 'var(--lyd-primary)' : 'var(--lyd-line)',
        }}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <div style={{
            width: '48px',
            height: '48px',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--lyd-accent)',
            borderRadius: '8px',
          }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          
          {uploading ? (
            <div>
              <p style={{
                fontSize: 'var(--font-size-md)',
                color: 'var(--lyd-text)',
                fontFamily: 'var(--font-family-primary)',
                marginBottom: '8px'
              }}>
                Uploading...
              </p>
              <div style={{
                width: '100%',
                height: '4px',
                backgroundColor: 'var(--lyd-line)',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div
                  style={{
                    width: '30%',
                    height: '100%',
                    backgroundColor: 'var(--lyd-primary)',
                    animation: 'pulse 2s infinite'
                  }}
                />
              </div>
            </div>
          ) : isDragActive ? (
            <p style={{
              fontSize: 'var(--font-size-md)',
              color: 'var(--lyd-text)',
              fontFamily: 'var(--font-family-primary)'
            }}>
              Drop the files here...
            </p>
          ) : (
            <div>
              <p style={{
                fontSize: 'var(--font-size-md)',
                color: 'var(--lyd-text)',
                fontFamily: 'var(--font-family-primary)',
                marginBottom: '8px'
              }}>
                Drag & drop files here, or click to select
              </p>
              <p style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--lyd-grey)',
                fontFamily: 'var(--font-family-primary)'
              }}>
                Max {maxFiles} files, up to {Math.round(maxSize / 1024 / 1024)}MB each
              </p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }}>
          <p style={{
            fontSize: 'var(--font-size-sm)',
            color: '#dc2626',
            fontFamily: 'var(--font-family-primary)',
            margin: 0
          }}>
            {error}
          </p>
        </div>
      )}
    </div>
  )
}
