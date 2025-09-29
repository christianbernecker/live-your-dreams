/**
 * OpenGraph Preview Component
 * 
 * Zeigt eine Social Media Card Preview gemäß Briefing §5.4, §8.1
 * Design System konform, keine Emojis
 */

'use client';

import React from 'react';
import Image from 'next/image';

interface OpenGraphPreviewProps {
  title: string;
  description: string;
  image?: string;
  domain?: string;
}

export function OpenGraphPreview({ 
  title, 
  description,
  image,
  domain = 'liveyourdreams.online'
}: OpenGraphPreviewProps) {
  // Truncate title to 70 characters (OG optimal)
  const truncatedTitle = title.length > 70 ? title.substring(0, 67) + '...' : title;
  
  // Truncate description to 200 characters (OG optimal)
  const truncatedDescription = description.length > 200 ? description.substring(0, 197) + '...' : description;

  return (
    <div className="lyd-card" style={{ maxWidth: '600px' }}>
      <div className="lyd-card-header" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
        <h3 style={{ margin: 0, fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-semibold)' }}>
          OpenGraph Preview
        </h3>
      </div>
      <div className="lyd-card-body">
        <div style={{
          border: '1px solid var(--lyd-border)',
          borderRadius: 'var(--border-radius-md)',
          overflow: 'hidden',
          background: 'var(--lyd-bg)'
        }}>
          {/* OG Image */}
          {image ? (
            <div style={{
              position: 'relative',
              width: '100%',
              paddingTop: '52.5%', // 1.91:1 aspect ratio (OG standard)
              background: 'var(--lyd-bg-secondary)',
              overflow: 'hidden'
            }}>
              <Image
                src={image}
                alt={title}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          ) : (
            <div style={{
              width: '100%',
              paddingTop: '52.5%',
              background: 'linear-gradient(135deg, var(--lyd-primary) 0%, var(--lyd-deep-blue) 100%)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                color: 'white'
              }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21,15 16,10 5,21"/>
                </svg>
              </div>
            </div>
          )}
          
          {/* OG Content */}
          <div style={{ padding: 'var(--spacing-md)' }}>
            {/* Domain */}
            <div style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--lyd-gray-500)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 'var(--spacing-xs)'
            }}>
              {domain}
            </div>
            
            {/* Title */}
            <div style={{
              fontSize: 'var(--font-size-md)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--lyd-text)',
              lineHeight: '1.4',
              marginBottom: 'var(--spacing-xs)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}>
              {truncatedTitle}
            </div>
            
            {/* Description */}
            <div style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--lyd-gray-600)',
              lineHeight: '1.5',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}>
              {truncatedDescription}
            </div>
          </div>
        </div>
        
        {/* Warnings */}
        {(title.length > 70 || description.length > 200 || !image) && (
          <div style={{
            marginTop: 'var(--spacing-sm)',
            padding: 'var(--spacing-sm)',
            background: '#fef3cd',
            border: '1px solid #fdd668',
            borderRadius: 'var(--border-radius-sm)',
            fontSize: 'var(--font-size-xs)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--spacing-xs)'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#856404" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div style={{ color: '#856404' }}>
              {!image && 'Kein Bild vorhanden (empfohlen: 1200x630px). '}
              {title.length > 70 && 'Titel zu lang (optimal: 60-70 Zeichen). '}
              {description.length > 200 && 'Beschreibung zu lang (optimal: 150-200 Zeichen).'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
