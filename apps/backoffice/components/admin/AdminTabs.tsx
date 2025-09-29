/**
 * AdminTabs - Funktionale Tab-Navigation für Admin-Bereiche
 * Client-Komponente mit interaktiver Tab-Funktionalität
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';

interface AdminTabsProps {
  stats: {
    activeUsers: number;
    totalUsers: number;
    totalRoles: number;
  };
}

export default function AdminTabs({ stats }: AdminTabsProps) {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="lyd-tabs">
      <div className="lyd-tabs-list">
        <button 
          className={`lyd-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
          type="button"
        >
          <span className="lyd-tab-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            Benutzer-Verwaltung
          </span>
        </button>
        <button 
          className={`lyd-tab ${activeTab === 'roles' ? 'active' : ''}`}
          onClick={() => setActiveTab('roles')}
          type="button"
        >
          <span className="lyd-tab-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <circle cx="12" cy="16" r="1"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Rollen & Berechtigungen
          </span>
        </button>
      </div>
      
      <div className="lyd-tab-panels">
        <div className={`lyd-tab-panel ${activeTab === 'users' ? 'active' : ''}`}>
          <div style={{ padding: 'var(--spacing-lg, 24px) 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <h3>Benutzer-Verwaltung</h3>
            </div>
            <p style={{ marginBottom: 'var(--spacing-md)', color: 'var(--lyd-grey)' }}>
              Benutzer, Rollen und Berechtigungen verwalten
            </p>
            <div style={{ fontSize: '0.875rem', color: 'var(--lyd-text-secondary)', marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
              </svg>
              {stats.activeUsers} aktive von {stats.totalUsers} Benutzern
            </div>
            <Link 
              href="/admin/users" 
              className="lyd-button primary"
              style={{ textDecoration: 'none' }}
            >
              Benutzer verwalten →
            </Link>
          </div>
        </div>
        
        <div className={`lyd-tab-panel ${activeTab === 'roles' ? 'active' : ''}`}>
          <div style={{ padding: 'var(--spacing-lg, 24px) 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <circle cx="12" cy="16" r="1"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <h3>Rollen & Berechtigungen</h3>
            </div>
            <p style={{ marginBottom: 'var(--spacing-md)', color: 'var(--lyd-grey)' }}>
              Zugriffsrechte und Rollen konfigurieren
            </p>
            <div style={{ fontSize: '0.875rem', color: 'var(--lyd-text-secondary)', marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
              </svg>
              {stats.totalRoles} aktive Rollen
            </div>
            <Link 
              href="/admin/roles" 
              className="lyd-button primary"
              style={{ textDecoration: 'none' }}
            >
              Rollen verwalten →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
