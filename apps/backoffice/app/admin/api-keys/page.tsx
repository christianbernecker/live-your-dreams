/**
 * API Key Monitoring & Cost Management Dashboard
 * 
 * DUMMY VERSION - UI Only, keine Backend-Anbindung
 * 
 * Features:
 * - Quick Stats (Heute/Monat/Tokens)
 * - API Keys Table mit Provider/Status/Kosten
 * - Recent Activity Log (letzte 10 Calls)
 * 
 * Design: Harmonisch mit /admin/users
 */

'use client';

import React from 'react';
import { AdminTabs } from '@/components/ui/AdminTabs';

// ============================================================================
// DUMMY DATA
// ============================================================================

const DUMMY_STATS = {
  todayCost: 12.47,
  todayCalls: 342,
  monthCost: 487.92,
  monthCalls: 12458,
  monthTokens: 24_567_891
};

const DUMMY_API_KEYS = [
  {
    id: '1',
    provider: 'ANTHROPIC',
    name: 'Claude Sonnet 4.5 Production',
    keyMasked: 'sk-ant-****5k3p',
    isActive: true,
    calls: 8234,
    monthlyCost: 312.45,
    lastUsedAt: '03.10.2025 14:32'
  },
  {
    id: '2',
    provider: 'OPENAI',
    name: 'GPT-5 Mini Fallback',
    keyMasked: 'sk-proj-****9x2q',
    isActive: true,
    calls: 4224,
    monthlyCost: 175.47,
    lastUsedAt: '03.10.2025 14:28'
  },
  {
    id: '3',
    provider: 'ANTHROPIC',
    name: 'Claude Opus 4 Testing',
    keyMasked: 'sk-ant-****7m4c',
    isActive: false,
    calls: 0,
    monthlyCost: 0,
    lastUsedAt: 'Nie'
  }
];

const DUMMY_RECENT_CALLS = [
  {
    id: '1',
    timestamp: '03.10. 14:32',
    feature: 'blog-generator',
    model: 'claude-sonnet-4.5',
    tokens: 4521,
    cost: 0.0342,
    status: 'SUCCESS',
    durationMs: 2345
  },
  {
    id: '2',
    timestamp: '03.10. 14:28',
    feature: 'image-analyzer',
    model: 'gpt-5-mini',
    tokens: 1234,
    cost: 0.0089,
    status: 'SUCCESS',
    durationMs: 1876
  },
  {
    id: '3',
    timestamp: '03.10. 14:15',
    feature: 'content-optimizer',
    model: 'claude-sonnet-4.5',
    tokens: 3456,
    cost: 0.0267,
    status: 'SUCCESS',
    durationMs: 2112
  },
  {
    id: '4',
    timestamp: '03.10. 13:58',
    feature: 'blog-generator',
    model: 'gpt-5-mini',
    tokens: 2345,
    cost: 0.0178,
    status: 'ERROR',
    durationMs: 456,
    errorMessage: 'Rate limit exceeded'
  },
  {
    id: '5',
    timestamp: '03.10. 13:42',
    feature: 'seo-optimizer',
    model: 'claude-sonnet-4.5',
    tokens: 1987,
    cost: 0.0156,
    status: 'SUCCESS',
    durationMs: 1934
  }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AdminApiKeysPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      {/* Admin Tab Navigation */}
      <AdminTabs />
      
      {/* Page Header */}
      <div className="lyd-card">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>
            API Key Monitoring
          </h1>
          <span className="lyd-badge warning" style={{ fontSize: '12px', padding: '4px 8px' }}>
            DUMMY UI
          </span>
        </div>
        <p style={{ margin: 0, color: 'var(--lyd-text-secondary)' }}>
          Kosten-Monitoring und Verwaltung von AI-API Keys (Anthropic Claude, OpenAI GPT)
        </p>
      </div>

      {/* Quick Stats - 3 Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'var(--spacing-lg)',
      }}>
        {/* Heute - Deep Blue (Primary) */}
        <div className="lyd-card" style={{
          background: 'var(--lyd-primary, #000066)',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Heute
            </h3>
          </div>
          <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '8px', lineHeight: '1' }}>
            €{DUMMY_STATS.todayCost.toFixed(2)}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            {DUMMY_STATS.todayCalls.toLocaleString('de-DE')} API Calls
          </div>
        </div>

        {/* Monat - Royal Blue */}
        <div className="lyd-card" style={{
          background: 'var(--lyd-royal-blue, #3366CC)',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Laufender Monat
            </h3>
          </div>
          <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '8px', lineHeight: '1' }}>
            €{DUMMY_STATS.monthCost.toFixed(2)}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            {DUMMY_STATS.monthCalls.toLocaleString('de-DE')} API Calls
          </div>
        </div>

        {/* Tokens - Success Green */}
        <div className="lyd-card" style={{
          background: 'var(--lyd-success, #10b981)',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Tokens (Monat)
            </h3>
          </div>
          <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '8px', lineHeight: '1' }}>
            {(DUMMY_STATS.monthTokens / 1_000_000).toFixed(2)}M
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            Input + Output kombiniert
          </div>
        </div>
      </div>

      {/* API Keys Table */}
      <div className="lyd-card">
        <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>
          Verwaltete API Keys
        </h2>
        <p style={{ margin: '0 0 16px 0', color: 'var(--lyd-text-secondary)', fontSize: '14px' }}>
          Übersicht aller konfigurierten API Keys mit Nutzungsstatistiken und Kosten.
        </p>

        <table className="api-table striped">
          <thead>
            <tr>
              <th>Provider</th>
              <th>Name</th>
              <th>API Key</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Calls</th>
              <th style={{ textAlign: 'right' }}>Kosten (Monat)</th>
              <th>Zuletzt verwendet</th>
            </tr>
          </thead>
          <tbody>
            {DUMMY_API_KEYS.map((key) => (
              <tr key={key.id}>
                <td>
                  <span className={`lyd-badge ${key.provider === 'ANTHROPIC' ? 'info' : 'success'}`}>
                    {key.provider}
                  </span>
                </td>
                <td style={{ fontWeight: '600' }}>{key.name}</td>
                <td>
                  <code style={{ 
                    fontSize: '13px', 
                    color: 'var(--lyd-text-secondary)',
                    fontFamily: 'monospace'
                  }}>
                    {key.keyMasked}
                  </code>
                </td>
                <td>
                  <span className={`lyd-badge ${key.isActive ? 'success' : 'secondary'}`}>
                    {key.isActive ? 'AKTIV' : 'INAKTIV'}
                  </span>
                </td>
                <td style={{ textAlign: 'right', fontWeight: '600' }}>
                  {key.calls.toLocaleString('de-DE')}
                </td>
                <td style={{ textAlign: 'right', fontWeight: '600', color: 'var(--lyd-primary)' }}>
                  €{key.monthlyCost.toFixed(2)}
                </td>
                <td style={{ fontSize: '14px', color: 'var(--lyd-text-secondary)' }}>
                  {key.lastUsedAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Info-Box unter Tabelle */}
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          background: 'var(--lyd-info-bg, #dbeafe)',
          border: '1px solid var(--lyd-info, #3b82f6)',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--lyd-info)" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <div style={{ fontSize: '14px', color: 'var(--lyd-text)' }}>
            <strong>Hinweis:</strong> API Keys werden aus Sicherheitsgründen nur über CLI verwaltet. 
            Verwenden Sie <code style={{ 
              padding: '2px 6px', 
              background: 'white', 
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '13px'
            }}>npm run add-api-key</code> zum Hinzufügen neuer Keys.
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="lyd-card">
        <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>
          Letzte API Calls
        </h2>
        <p style={{ margin: '0 0 16px 0', color: 'var(--lyd-text-secondary)', fontSize: '14px' }}>
          Die 10 aktuellsten API-Aufrufe mit Status, Kosten und Performance-Metriken.
        </p>

        <table className="api-table striped">
          <thead>
            <tr>
              <th>Zeitstempel</th>
              <th>Feature</th>
              <th>Model</th>
              <th style={{ textAlign: 'right' }}>Tokens</th>
              <th style={{ textAlign: 'right' }}>Kosten</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Dauer</th>
            </tr>
          </thead>
          <tbody>
            {DUMMY_RECENT_CALLS.map((call) => (
              <tr key={call.id}>
                <td style={{ fontSize: '14px', color: 'var(--lyd-text-secondary)' }}>
                  {call.timestamp}
                </td>
                <td>
                  <span style={{ 
                    fontFamily: 'monospace', 
                    fontSize: '13px',
                    background: 'var(--lyd-gray-50, #f9fafb)',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    {call.feature}
                  </span>
                </td>
                <td style={{ fontSize: '14px' }}>{call.model}</td>
                <td style={{ textAlign: 'right', fontWeight: '600' }}>
                  {call.tokens.toLocaleString('de-DE')}
                </td>
                <td style={{ textAlign: 'right', fontWeight: '600', color: 'var(--lyd-primary)' }}>
                  €{call.cost.toFixed(4)}
                </td>
                <td>
                  {call.status === 'SUCCESS' ? (
                    <span className="lyd-badge success">SUCCESS</span>
                  ) : (
                    <span 
                      className="lyd-badge error" 
                      title={call.errorMessage || 'Unbekannter Fehler'}
                      style={{ cursor: 'help' }}
                    >
                      ERROR
                    </span>
                  )}
                </td>
                <td style={{ textAlign: 'right', fontSize: '14px', color: 'var(--lyd-text-secondary)' }}>
                  {call.durationMs}ms
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chart Placeholder */}
      <div className="lyd-card">
        <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>
          Kosten-Verlauf (30 Tage)
        </h2>
        <p style={{ margin: '0 0 16px 0', color: 'var(--lyd-text-secondary)', fontSize: '14px' }}>
          Tägliche API-Kosten aufgeschlüsselt nach Provider.
        </p>

        {/* Chart Placeholder */}
        <div style={{
          height: '300px',
          background: 'var(--lyd-gray-50, #f9fafb)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px dashed var(--lyd-border)',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--lyd-text-secondary)" strokeWidth="2">
            <line x1="12" y1="20" x2="12" y2="10"/>
            <line x1="18" y1="20" x2="18" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="16"/>
          </svg>
          <div style={{ fontSize: '16px', color: 'var(--lyd-text-secondary)', fontWeight: '600' }}>
            Chart wird nach Backend-Integration implementiert
          </div>
          <div style={{ fontSize: '14px', color: 'var(--lyd-text-secondary)' }}>
            Balkendiagramm mit Anthropic (Rot) vs. OpenAI (Orange)
          </div>
        </div>
      </div>

    </div>
  );
}

