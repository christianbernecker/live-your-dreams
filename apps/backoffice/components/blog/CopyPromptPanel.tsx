/**
 * LYD Blog System v1.1 - Copy Prompt Panel
 * 
 * Stellt JSON Template und Agent-Briefing für KI-Integration bereit
 * Basierend auf technischem Briefing v1.0 - Sektion 6
 */

'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/Toast';

export function CopyPromptPanel() {
  const [activeTab, setActiveTab] = useState<'template' | 'briefing'>('template');
  const { showSuccess } = useToast();

  // Generate current timestamp for template
  const currentTimestamp = new Date().toISOString();
  
  // JSON Template v1.1
  const jsonTemplate = {
    "version": "1.1",
    "source": {
      "agent": "chatgpt",
      "model": "gpt-4.1",
      "timestamp": currentTimestamp
    },
    "content": {
      "platforms": ["WOHNEN"],
      "category": "",
      "subcategory": "",
      "tags": [],
      "title": "",
      "slug": "",
      "excerpt": "",
      "seo": {
        "metaTitle": "",
        "metaDescription": "",
        "focusKeyword": "",
        "keywords": [],
        "canonicalUrl": "",
        "og": {
          "title": "",
          "description": "",
          "image": "",
          "type": "article"
        }
      },
      "format": "mdx",
      "body": "# Titel...",
      "htmlBlocks": [],
      "featuredImage": {
        "src": "",
        "alt": ""
      },
      "images": [],
      "jsonLd": {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "",
        "datePublished": currentTimestamp.slice(0, 10)
      }
    },
    "assets": []
  };

  // Agent Briefing
  const agentBriefing = `Du schreibst für Live Your Dreams. Wähle je Inhalt passende Plattformen: WOHNEN | MAKLER | ENERGIE.
Liefere **immer** valides JSON v1.1 gemäß Template.

## PLATTFORM-GUIDE:

**WOHNEN** (Privatverkäufer/Käufer München, DIY-affin, preissensibel):
- Kategorien: Ratgeber, Markt, Recht, DIY, Verkauf, Kauf
- Ton: informativ, vertrauensbildend
- Beispiel: "Immobilie ohne Makler verkaufen München 2025"

**MAKLER** (Premium-Segment 45+, hoher Objektwert):
- Kategorien: Premium, Investment, Referenz, Luxury, Off-Market  
- Ton: premium, professionell
- Beispiel: "Luxusimmobilien München - Investment-Strategien"

**ENERGIE** (Eigentümer, Vermieter, Modernisierer):
- Kategorien: GEG, Förderung, Technik, Modernisierung, Energieausweis, Sanierung
- Ton: technisch fundiert, verständlich
- Beispiel: "GEG 2024 - Neue Heizungspflichten für Eigentümer"

## PFLICHT-FELDER:
- title (≤120 Zeichen), slug (kebab-case), excerpt (≤200 Zeichen)
- platforms (1-3 aus Liste), category, format (md|mdx|html), body **oder** htmlBlocks
- jsonLd (BlogPosting/Article mindestens mit headline, datePublished)
- Für Bilder: Alt-Text obligatorisch

## SEO-VORGABEN:
- metaTitle/metaDescription, focusKeyword, keywords[]
- canonicalUrl nach Muster: https://[plattform].liveyourdreams.online/blog/[slug]
- Struktur: H2/H3 alle ~150-200 Wörter, FAQ-Block, interne Links
- JSON-LD Schema mit headline, datePublished, author/publisher

## CONTENT-FORMAT:
- **mdx** bevorzugt für normale Artikel
- **htmlBlocks** für komplexe Grafiken/Interaktivität (YouTube-NoCookie erlaubt)
- Assets als URLs **oder** Base64 im assets[] Array
- Maximale Längen: JSON ≤2MB, einzelnes Asset ≤10MB

## QUALITÄTS-CHECKLISTE:
- [ ] Plattform-Kategorie passt zusammen
- [ ] Slug ist unique und SEO-freundlich  
- [ ] Meta-Daten für Suchmaschinen optimiert
- [ ] Mindestens 1 interner Link zu anderen LYD-Seiten
- [ ] Barrierefreiheit: Alt-Texte, sinnvolle Headings
- [ ] Mobile-optimiert: Kurze Absätze, scanbare Struktur

**BEISPIEL ERFOLGREICHER SLUG:**
- ❌ "Immobilien verkaufen"  → zu generisch
- ✅ "immobilie-ohne-makler-verkaufen-muenchen-2025" → spezifisch, lokal, aktuell

Antworte ausschließlich mit validem JSON v1.1. Keine Erklärungen drumherum.`;

  const copyToClipboard = async (content: string, type: string) => {
    try {
      await navigator.clipboard.writeText(content);
      showSuccess('Kopiert', `${type} wurde in die Zwischenablage kopiert`);
    } catch (error) {
      console.error('Copy failed:', error);
      
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      showSuccess('Kopiert', `${type} wurde in die Zwischenablage kopiert`);
    }
  };

  return (
    <div className="lyd-card">
      <div className="lyd-card-header">
        <h2 className="lyd-heading-2">KI-Agent Integration</h2>
        <p className="lyd-text-secondary">
          Kopieren Sie diese Vorlagen in Ihren KI-Agenten für optimale Inhalte
        </p>
      </div>
      <div className="lyd-card-body">
        
        {/* Tabs */}
        <div className="lyd-tabs" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div className="lyd-tabs-list">
            <button
              className={`lyd-tab ${activeTab === 'template' ? 'active' : ''}`}
              onClick={() => setActiveTab('template')}
            >
              <span className="lyd-tab-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                JSON Template v1.1
              </span>
            </button>
            <button
              className={`lyd-tab ${activeTab === 'briefing' ? 'active' : ''}`}
              onClick={() => setActiveTab('briefing')}
            >
              <span className="lyd-tab-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Agent-Briefing
              </span>
            </button>
          </div>
        </div>

        {/* Template Tab */}
        {activeTab === 'template' && (
          <div className="lyd-copy-prompt">
            <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
              <div>
                <h3 style={{ margin: 0, marginBottom: '4px' }}>JSON Template v1.1</h3>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--lyd-gray-600)' }}>
                  Kopieren Sie dieses Template in Ihren KI-Agenten als Ausgabeformat
                </p>
              </div>
              <button
                className="lyd-button primary"
                onClick={() => copyToClipboard(JSON.stringify(jsonTemplate, null, 2), 'JSON Template')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                </svg>
                Template kopieren
              </button>
            </div>
            
            <pre style={{ 
              maxHeight: '400px', 
              overflow: 'auto',
              fontSize: '0.8125rem',
              lineHeight: '1.4'
            }}>
              {JSON.stringify(jsonTemplate, null, 2)}
            </pre>

            {/* Usage Instructions */}
            <div style={{ 
              marginTop: 'var(--spacing-md)',
              padding: 'var(--spacing-md)',
              background: 'var(--lyd-info)10',
              borderRadius: 'var(--border-radius-md)',
              border: '1px solid var(--lyd-info)30'
            }}>
              <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--lyd-info)', marginTop: '2px', flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4"/>
                  <path d="M12 8h.01"/>
                </svg>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>Verwendung im KI-Agenten:</div>
                  <div style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                    1. Kopieren Sie das JSON Template<br/>
                    2. Fügen Sie es in Ihren KI-Agenten als "Output Format" ein<br/>
                    3. Verwenden Sie das Agent-Briefing als System-Prompt<br/>
                    4. Die KI liefert dann automatisch das korrekte v1.1 Format
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Briefing Tab */}
        {activeTab === 'briefing' && (
          <div className="lyd-copy-prompt">
            <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
              <div>
                <h3 style={{ margin: 0, marginBottom: '4px' }}>Agent-Briefing</h3>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--lyd-gray-600)' }}>
                  Vollständige Anweisungen für optimale Content-Erstellung
                </p>
              </div>
              <button
                className="lyd-button primary"
                onClick={() => copyToClipboard(agentBriefing, 'Agent-Briefing')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                </svg>
                Briefing kopieren
              </button>
            </div>
            
            <pre style={{ 
              maxHeight: '400px', 
              overflow: 'auto',
              fontSize: '0.8125rem',
              lineHeight: '1.4',
              whiteSpace: 'pre-wrap'
            }}>
              {agentBriefing}
            </pre>

            {/* Platform Quick Reference */}
            <div style={{ 
              marginTop: 'var(--spacing-md)',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'var(--spacing-md)'
            }}>
              <div style={{ 
                padding: 'var(--spacing-sm)',
                background: '#10b98110',
                borderRadius: 'var(--border-radius-sm)',
                border: '1px solid #10b98130'
              }}>
                <div style={{ fontWeight: '600', color: '#10b981', marginBottom: '4px' }}>WOHNEN</div>
                <div style={{ fontSize: '0.75rem' }}>Privatverkäufer, DIY, preissensibel</div>
              </div>
              <div style={{ 
                padding: 'var(--spacing-sm)',
                background: '#3b82f610',
                borderRadius: 'var(--border-radius-sm)',
                border: '1px solid #3b82f630'
              }}>
                <div style={{ fontWeight: '600', color: '#3b82f6', marginBottom: '4px' }}>MAKLER</div>
                <div style={{ fontSize: '0.75rem' }}>Premium-Segment, 45+, hoher Wert</div>
              </div>
              <div style={{ 
                padding: 'var(--spacing-sm)',
                background: '#f59e0b10',
                borderRadius: 'var(--border-radius-sm)',
                border: '1px solid #f59e0b30'
              }}>
                <div style={{ fontWeight: '600', color: '#f59e0b', marginBottom: '4px' }}>ENERGIE</div>
                <div style={{ fontSize: '0.75rem' }}>Eigentümer, Modernisierer, GEG</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
