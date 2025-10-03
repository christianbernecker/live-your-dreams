'use client';

import { DailyUsageChart } from '@/components/admin/DailyUsageChart';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdminTabs } from '@/components/ui/AdminTabs';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface ApiStats {
  keys: any[];
  stats: {
    today: { totalCost: number; totalCalls: number; totalTokens: number };
    month: { totalCost: number; totalCalls: number; totalTokens: number };
  };
  dailyUsage: any[];
  recentCalls: any[];
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [data, setData] = useState<ApiStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Auth wird über authorized() Callback in lib/auth.ts gehandelt
    // Hier nur noch Daten laden
    fetch('/api/admin/api-stats')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Failed to load API stats:', error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading || !data) {
    return (
      <DashboardLayout
        title="API Keys & Monitoring"
        subtitle="API-Nutzung und Kosten überwachen"
        userEmail={session?.user?.email ?? undefined}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
          <AdminTabs />
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh'
          }}>
            <div className="lyd-loading-spinner">Laden...</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const { keys, stats, dailyUsage, recentCalls } = data;

  return (
    <DashboardLayout
      title="API Keys & Monitoring"
      subtitle="Überwache API-Nutzung, Kosten und Performance"
      userEmail={session?.user?.email ?? undefined}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
        {/* Tab Navigation */}
        <AdminTabs />
        
        {/* Quick Stats Header */}
        <div className="lyd-card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: 'var(--spacing-xs)' }}>
            API Monitoring Dashboard
          </h2>
          <p style={{ color: 'var(--lyd-text-secondary)', fontSize: '0.875rem', margin: 0 }}>
            Echtzeit-Überwachung Ihrer API-Nutzung und Kosten
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
          {/* Cost Overview Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-md)' }}>
            <div style={{
              padding: 'var(--spacing-lg)',
              backgroundColor: 'var(--lyd-bg-elevated)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--lyd-border)'
            }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--lyd-text-muted)', marginBottom: 'var(--spacing-xs)' }}>
                Gesamtkosten (Heute)
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--lyd-primary)' }}>
                €{stats.today.totalCost.toFixed(2)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--lyd-text-muted)', marginTop: 'var(--spacing-xs)' }}>
                {stats.today.totalCalls} API Calls
              </div>
            </div>

            <div style={{
              padding: 'var(--spacing-lg)',
              backgroundColor: 'var(--lyd-bg-elevated)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--lyd-border)'
            }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--lyd-text-muted)', marginBottom: 'var(--spacing-xs)' }}>
                Gesamtkosten (Monat)
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--lyd-accent)' }}>
                €{stats.month.totalCost.toFixed(2)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--lyd-text-muted)', marginTop: 'var(--spacing-xs)' }}>
                {stats.month.totalCalls} API Calls
              </div>
            </div>

            <div style={{
              padding: 'var(--spacing-lg)',
              backgroundColor: 'var(--lyd-bg-elevated)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--lyd-border)'
            }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--lyd-text-muted)', marginBottom: 'var(--spacing-xs)' }}>
                Tokens (Monat)
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 600 }}>
                {stats.month.totalTokens.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--lyd-text-muted)', marginTop: 'var(--spacing-xs)' }}>
                Input/Output kombiniert
              </div>
            </div>
          </div>

          {/* API Keys Table */}
          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>
              API Keys
            </h2>
            <div style={{
              border: '1px solid var(--lyd-border)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              backgroundColor: 'var(--lyd-bg-elevated)'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: 'var(--lyd-bg)', borderBottom: '1px solid var(--lyd-border)' }}>
                  <tr>
                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Provider</th>
                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Name</th>
                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>API Key</th>
                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Status</th>
                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Calls</th>
                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Kosten (Monat)</th>
                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Zuletzt verwendet</th>
                  </tr>
                </thead>
                <tbody>
                  {keys.map((key: any) => (
                    <tr key={key.id} style={{ borderBottom: '1px solid var(--lyd-border)' }}>
                      <td style={{ padding: 'var(--spacing-md)', fontSize: '0.875rem' }}>
                        <span style={{
                          padding: '4px 8px',
                          backgroundColor: key.provider === 'ANTHROPIC' ? 'var(--lyd-primary-light)' : 'var(--lyd-accent-light)',
                          color: key.provider === 'ANTHROPIC' ? 'var(--lyd-primary)' : 'var(--lyd-accent)',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 500
                        }}>
                          {key.provider}
                        </span>
                      </td>
                      <td style={{ padding: 'var(--spacing-md)', fontSize: '0.875rem', fontWeight: 500 }}>{key.name}</td>
                      <td style={{ padding: 'var(--spacing-md)', fontSize: '0.875rem', fontFamily: 'monospace', color: 'var(--lyd-text-muted)' }}>
                        {key.maskedKey}
                      </td>
                      <td style={{ padding: 'var(--spacing-md)', fontSize: '0.875rem' }}>
                        <span style={{
                          padding: '4px 8px',
                          backgroundColor: key.isActive ? 'var(--lyd-success-light)' : 'var(--lyd-error-light)',
                          color: key.isActive ? 'var(--lyd-success)' : 'var(--lyd-error)',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 500
                        }}>
                          {key.isActive ? 'Aktiv' : 'Inaktiv'}
                        </span>
                      </td>
                      <td style={{ padding: 'var(--spacing-md)', fontSize: '0.875rem' }}>{key.callCount}</td>
                      <td style={{ padding: 'var(--spacing-md)', fontSize: '0.875rem', fontWeight: 500 }}>
                        €{key.monthlyCost.toFixed(2)}
                      </td>
                      <td style={{ padding: 'var(--spacing-md)', fontSize: '0.875rem', color: 'var(--lyd-text-muted)' }}>
                        {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleString('de-DE', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Nie'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 30-Day Usage Chart */}
          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>
              Kosten-Verlauf (30 Tage)
            </h2>
            <div style={{
              border: '1px solid var(--lyd-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-lg)',
              backgroundColor: 'var(--lyd-bg-elevated)',
              overflowX: 'auto'
            }}>
              <DailyUsageChart data={dailyUsage} />
            </div>
          </section>

          {/* Recent API Calls */}
          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>
              Letzte API Calls
            </h2>
            <div style={{
              border: '1px solid var(--lyd-border)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              backgroundColor: 'var(--lyd-bg-elevated)'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: 'var(--lyd-bg)', borderBottom: '1px solid var(--lyd-border)' }}>
                  <tr>
                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Zeitstempel</th>
                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Feature</th>
                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Model</th>
                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Tokens</th>
                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Kosten</th>
                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Status</th>
                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Dauer</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCalls.map((call: any) => (
                    <tr key={call.id} style={{ borderBottom: '1px solid var(--lyd-border)' }}>
                      <td style={{ padding: 'var(--spacing-md)', fontSize: '0.875rem', color: 'var(--lyd-text-muted)' }}>
                        {new Date(call.createdAt).toLocaleString('de-DE', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td style={{ padding: 'var(--spacing-md)', fontSize: '0.875rem' }}>{call.feature}</td>
                      <td style={{ padding: 'var(--spacing-md)', fontSize: '0.875rem', fontFamily: 'monospace' }}>{call.model}</td>
                      <td style={{ padding: 'var(--spacing-md)', fontSize: '0.875rem' }}>{call.totalTokens.toLocaleString()}</td>
                      <td style={{ padding: 'var(--spacing-md)', fontSize: '0.875rem', fontWeight: 500 }}>€{call.totalCost.toFixed(4)}</td>
                      <td style={{ padding: 'var(--spacing-md)', fontSize: '0.875rem' }}>
                        <span style={{
                          padding: '4px 8px',
                          backgroundColor: call.status === 'SUCCESS' ? 'var(--lyd-success-light)' : 'var(--lyd-error-light)',
                          color: call.status === 'SUCCESS' ? 'var(--lyd-success)' : 'var(--lyd-error)',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 500
                        }}>
                          {call.status}
                        </span>
                      </td>
                      <td style={{ padding: 'var(--spacing-md)', fontSize: '0.875rem', color: 'var(--lyd-text-muted)' }}>
                        {call.durationMs}ms
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
