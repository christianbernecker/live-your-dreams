/**
 * Copy Prompt Panel Component
 * 
 * Stellt JSON Template und Agent-Briefing für KI-Agenten bereit
 * Gemäß Briefing §6.1, §6.2
 * Design System konform, keine Emojis
 */

'use client';

import React, { useState } from 'react';

interface CopyPromptPanelProps {
  platform?: 'WOHNEN' | 'MAKLER' | 'ENERGIE';
}

export function CopyPromptPanel({ platform = 'WOHNEN' }: CopyPromptPanelProps) {
  const [copied, setCopied] = useState<'template' | 'briefing' | null>(null);

  // JSON Template gemäß Briefing §6.1
  const jsonTemplate = {
    version: "1.1",
    source: {
      agent: "chatgpt",
      model: "gpt-4.1",
      timestamp: new Date().toISOString()
    },
    content: {
      platforms: [platform],
      category: "",
      subcategory: "",
      tags: [],
      title: "",
      slug: "",
      excerpt: "",
      seo: {
        metaTitle: "",
        metaDescription: "",
        focusKeyword: "",
        keywords: [],
        canonicalUrl: "",
        og: {
          title: "",
          description: "",
          image: "",
          type: "article"
        }
      },
      format: "mdx",
      body: "# Titel...\n\n## Einleitung\n\n...",
      htmlBlocks: [],
      featuredImage: {
        src: "",
        alt: ""
      },
      images: [],
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: "",
        datePublished: new Date().toISOString().slice(0, 10)
      }
    }
  };

  // Agent Briefing gemäß Briefing §6.2
  const agentBriefing = `Du schreibst für Live Your Dreams. Wähle je Inhalt passende Plattformen: WOHNEN | MAKLER | ENERGIE.
Liefere **immer** valides JSON v1.1 gemäß Template.

Pflicht:
- title (≤120), slug, excerpt (≤200), platforms (1..3), category, format (md|mdx|html), body **oder** htmlBlocks, jsonLd (BlogPosting/Article).
- Für Bilder: Alt-Text.
- Für HTML-Grafiken: htmlBlocks mit optionaler CSS/JS-Sektion; iFrames nur YouTube-NoCookie, Parameter angeben.

SEO:
- metaTitle/metaDescription, focusKeyword, keywords[], canonicalUrl.
- Struktur: H2/H3, FAQ-Block, interne Links.

Format:
- mdx bevorzugt; umfangreiche Interaktivität über htmlBlocks.
- Assets als URLs **oder** Base64-Assets im Paket.

Plattform-Guidelines:
- WOHNEN: Privatverkäufer/Käufer, informativ/vertrauensbildend, München-Fokus
- MAKLER: Premium-Segment, professionell, Investment-Fokus
- ENERGIE: Eigentümer/Vermieter, technisch fundiert, GEG/Förderungen`;

  const handleCopy = async (type: 'template' | 'briefing') => {
    const content = type === 'template' 
      ? JSON.stringify(jsonTemplate, null, 2)
      : agentBriefing;
    
    try {
      await navigator.clipboard.writeText(content);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  return (
    <div className="lyd-card">
      <div className="lyd-card-header" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 style={{ margin: 0, fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-semibold)', flex: 1 }}>
          KI-Agent Vorgaben
        </h3>
      </div>
      
      <div className="lyd-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
        
        {/* Agent Briefing */}
        <div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: 'var(--spacing-sm)'
          }}>
            <h4 style={{ 
              margin: 0, 
              fontSize: 'var(--font-size-sm)', 
              fontWeight: 'var(--font-weight-semibold)' 
            }}>
              Agent-Briefing
            </h4>
            <button 
              className="lyd-button primary"
              onClick={() => handleCopy('briefing')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--spacing-xs)',
                fontSize: 'var(--font-size-sm)',
                padding: 'var(--spacing-xs) var(--spacing-sm)'
              }}
            >
              {copied === 'briefing' ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                  Kopiert
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                  Kopieren
                </>
              )}
            </button>
          </div>
          <div style={{
            background: 'var(--lyd-bg-secondary)',
            border: '1px solid var(--lyd-border)',
            borderRadius: 'var(--border-radius-md)',
            padding: 'var(--spacing-md)',
            fontSize: 'var(--font-size-xs)',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            maxHeight: '200px',
            overflowY: 'auto',
            lineHeight: '1.6'
          }}>
            {agentBriefing}
          </div>
        </div>

        {/* JSON Template */}
        <div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: 'var(--spacing-sm)'
          }}>
            <h4 style={{ 
              margin: 0, 
              fontSize: 'var(--font-size-sm)', 
              fontWeight: 'var(--font-weight-semibold)' 
            }}>
              JSON Template v1.1
            </h4>
            <button 
              className="lyd-button secondary"
              onClick={() => handleCopy('template')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--spacing-xs)',
                fontSize: 'var(--font-size-sm)',
                padding: 'var(--spacing-xs) var(--spacing-sm)'
              }}
            >
              {copied === 'template' ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                  Kopiert
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                  Kopieren
                </>
              )}
            </button>
          </div>
          <div style={{
            background: 'var(--lyd-bg-secondary)',
            border: '1px solid var(--lyd-border)',
            borderRadius: 'var(--border-radius-md)',
            padding: 'var(--spacing-md)',
            fontSize: 'var(--font-size-xs)',
            fontFamily: 'monospace',
            whiteSpace: 'pre',
            maxHeight: '300px',
            overflowY: 'auto',
            overflowX: 'auto'
          }}>
            {JSON.stringify(jsonTemplate, null, 2)}
          </div>
        </div>

        {/* Info Text */}
        <div style={{
          padding: 'var(--spacing-sm)',
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 'var(--border-radius-sm)',
          fontSize: 'var(--font-size-xs)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 'var(--spacing-xs)'
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4"/>
            <path d="M12 8h.01"/>
          </svg>
          <span style={{ color: '#1e40af' }}>
            Nutze diese Vorgaben in deinem KI-Agenten (z.B. ChatGPT Custom Instructions). 
            Der Agent liefert dann Content im korrekten Format für den Import.
          </span>
        </div>
      </div>
    </div>
  );
}
