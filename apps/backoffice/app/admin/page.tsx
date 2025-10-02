import { ApiKeyService } from '@/lib/services/apiKeyService';
import { ApiUsageService } from '@/lib/services/apiUsageService';
import { DailyUsageChart } from '@/components/admin/DailyUsageChart';

export default async function AdminDashboard() {
  // Lade alle Daten parallel
  const [keys, stats, dailyUsage, recentCalls] = await Promise.all([
    ApiKeyService.listKeys(),
    ApiUsageService.getOverallStats(),
    ApiUsageService.getDailyUsage(30),
    ApiUsageService.getRecentCalls(10),
  ]);

  return (
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
            Tokens (Heute)
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 600 }}>
            {(stats.today.totalTokens / 1000).toFixed(1)}K
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--lyd-text-muted)', marginTop: 'var(--spacing-xs)' }}>
            Input: {(stats.today.inputTokens / 1000).toFixed(1)}K | Output: {(stats.today.outputTokens / 1000).toFixed(1)}K
          </div>
        </div>
      </div>

      {/* API Keys Overview */}
      <section>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>
          Aktive API Keys
        </h2>
        <div style={{ 
          backgroundColor: 'var(--lyd-bg-elevated)', 
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--lyd-border)',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--lyd-bg)', borderBottom: '1px solid var(--lyd-border)' }}>
                <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontSize: '0.875rem', fontWeight: 500 }}>Provider</th>
                <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontSize: '0.875rem', fontWeight: 500 }}>Name</th>
                <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontSize: '0.875rem', fontWeight: 500 }}>Key</th>
                <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontSize: '0.875rem', fontWeight: 500 }}>Status</th>
                <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontSize: '0.875rem', fontWeight: 500 }}>Limit</th>
                <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontSize: '0.875rem', fontWeight: 500 }}>Kosten (Monat)</th>
                <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontSize: '0.875rem', fontWeight: 500 }}>Zuletzt verwendet</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((key) => (
                <tr key={key.id} style={{ borderBottom: '1px solid var(--lyd-border)' }}>
                  <td style={{ padding: 'var(--spacing-md)' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: 'var(--radius-sm)', 
                      fontSize: '0.75rem',
                      backgroundColor: key.provider === 'ANTHROPIC' ? '#f0f4ff' : '#fff0f4',
                      color: key.provider === 'ANTHROPIC' ? '#2563eb' : '#dc2626'
                    }}>
                      {key.provider}
                    </span>
                  </td>
                  <td style={{ padding: 'var(--spacing-md)', fontSize: '0.875rem' }}>{key.name}</td>
                  <td style={{ padding: 'var(--spacing-md)', fontFamily: 'monospace', fontSize: '0.875rem', color: 'var(--lyd-text-muted)' }}>
                    {key.maskedKey}
                  </td>
                  <td style={{ padding: 'var(--spacing-md)' }}>
                    <span style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      display: 'inline-block',
                      backgroundColor: key.isActive ? '#10b981' : '#ef4444',
                      marginRight: '6px'
                    }} />
                    <span style={{ fontSize: '0.875rem' }}>{key.isActive ? 'Aktiv' : 'Inaktiv'}</span>
                  </td>
                  <td style={{ padding: 'var(--spacing-md)', fontSize: '0.875rem', color: 'var(--lyd-text-muted)' }}>
                    {key.monthlyLimit ? `€${key.monthlyLimit}/Monat` : 'Kein Limit'}
                  </td>
                  <td style={{ padding: 'var(--spacing-md)', fontSize: '0.875rem', fontWeight: 500 }}>
                    €{key.monthlyCost.toFixed(2)}
                  </td>
                  <td style={{ padding: 'var(--spacing-md)', fontSize: '0.875rem', color: 'var(--lyd-text-muted)' }}>
                    {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleString('de-DE', { 
                      dateStyle: 'short', 
                      timeStyle: 'short' 
                    }) : 'Noch nie'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent API Calls */}
      <section>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>
          Letzte API Calls
        </h2>
        <div style={{ 
          backgroundColor: 'var(--lyd-bg-elevated)', 
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--lyd-border)',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--lyd-bg)', borderBottom: '1px solid var(--lyd-border)' }}>
                <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontSize: '0.875rem', fontWeight: 500 }}>Zeit</th>
                <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontSize: '0.875rem', fontWeight: 500 }}>Feature</th>
                <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontSize: '0.875rem', fontWeight: 500 }}>Model</th>
                <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontSize: '0.875rem', fontWeight: 500 }}>Tokens</th>
                <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontSize: '0.875rem', fontWeight: 500 }}>Kosten</th>
                <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontSize: '0.875rem', fontWeight: 500 }}>Dauer</th>
                <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontSize: '0.875rem', fontWeight: 500 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentCalls.map((call) => (
                <tr key={call.id} style={{ borderBottom: '1px solid var(--lyd-border)' }}>
                  <td style={{ padding: 'var(--spacing-md)', fontSize: '0.875rem', color: 'var(--lyd-text-muted)' }}>
                    {new Date(call.createdAt).toLocaleString('de-DE', { 
                      dateStyle: 'short', 
                      timeStyle: 'short' 
                    })}
                  </td>
                  <td style={{ padding: 'var(--spacing-md)', fontSize: '0.875rem' }}>{call.feature}</td>
                  <td style={{ padding: 'var(--spacing-md)', fontSize: '0.875rem', fontFamily: 'monospace', color: 'var(--lyd-text-muted)' }}>
                    {call.model}
                  </td>
                  <td style={{ padding: 'var(--spacing-md)', fontSize: '0.875rem' }}>
                    <div>{call.totalTokens.toLocaleString()}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--lyd-text-muted)' }}>
                      In: {call.inputTokens} | Out: {call.outputTokens}
                    </div>
                  </td>
                  <td style={{ padding: 'var(--spacing-md)', fontSize: '0.875rem', fontWeight: 500 }}>
                    €{call.totalCost.toFixed(4)}
                  </td>
                  <td style={{ padding: 'var(--spacing-md)', fontSize: '0.875rem', color: 'var(--lyd-text-muted)' }}>
                    {call.durationMs}ms
                  </td>
                  <td style={{ padding: 'var(--spacing-md)' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: 'var(--radius-sm)', 
                      fontSize: '0.75rem',
                      backgroundColor: call.status === 'SUCCESS' ? '#f0fdf4' : '#fef2f2',
                      color: call.status === 'SUCCESS' ? '#16a34a' : '#dc2626'
                    }}>
                      {call.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Daily Usage Chart */}
      <section>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>
          Kosten der letzten 30 Tage
        </h2>
        <div style={{
          backgroundColor: 'var(--lyd-bg-elevated)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--lyd-border)',
          padding: 'var(--spacing-lg)',
          overflowX: 'auto'
        }}>
          <DailyUsageChart data={dailyUsage} />
        </div>
      </section>
    </div>
  );
}
