/**
 * SERP Preview Component
 * 
 * Zeigt eine Google Search Result Preview gemäß Briefing §5.4, §8.1
 * Design System konform, keine Emojis
 */

'use client';

import React from 'react';

interface SERPPreviewProps {
  title: string;
  slug: string;
  description: string;
  domain?: string;
}

export function SERPPreview({ 
  title, 
  slug, 
  description,
  domain = 'liveyourdreams.online'
}: SERPPreviewProps) {
  // Truncate title to 60 characters (Google SERP limit)
  const truncatedTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;
  
  // Truncate description to 160 characters (Google SERP limit)
  const truncatedDescription = description.length > 160 ? description.substring(0, 157) + '...' : description;
  
  // Build URL path
  const urlPath = `${domain} › blog › ${slug}`;

  return (
    <div className="lyd-card" style={{ maxWidth: '600px' }}>
      <div className="lyd-card-header" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <h3 style={{ margin: 0, fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-semibold)' }}>
          SERP Preview
        </h3>
      </div>
      <div className="lyd-card-body">
        <div style={{
          padding: 'var(--spacing-md)',
          background: 'var(--lyd-bg-secondary)',
          borderRadius: 'var(--border-radius-md)',
          border: '1px solid var(--lyd-border)'
        }}>
          {/* Google-Style Title */}
          <div style={{
            color: '#1a0dab',
            fontSize: '20px',
            lineHeight: '1.3',
            fontWeight: '400',
            marginBottom: '4px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontFamily: 'Arial, sans-serif'
          }}>
            {truncatedTitle}
          </div>
          
          {/* Google-Style URL */}
          <div style={{
            color: '#006621',
            fontSize: '14px',
            lineHeight: '1.3',
            marginBottom: '4px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontFamily: 'Arial, sans-serif'
          }}>
            {urlPath}
          </div>
          
          {/* Google-Style Description */}
          <div style={{
            color: '#545454',
            fontSize: '14px',
            lineHeight: '1.6',
            fontFamily: 'Arial, sans-serif'
          }}>
            {truncatedDescription}
          </div>
        </div>
        
        {/* Warnings */}
        {(title.length > 60 || description.length > 160) && (
          <div style={{
            marginTop: 'var(--spacing-sm)',
            padding: 'var(--spacing-sm)',
            background: '#fef3cd',
            border: '1px solid #fdd668',
            borderRadius: 'var(--border-radius-sm)',
            fontSize: 'var(--font-size-xs)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#856404" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span style={{ color: '#856404' }}>
              {title.length > 60 && 'Titel zu lang (max. 60 Zeichen). '}
              {description.length > 160 && 'Beschreibung zu lang (max. 160 Zeichen).'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
