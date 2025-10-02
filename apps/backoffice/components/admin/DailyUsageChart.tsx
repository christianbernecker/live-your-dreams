'use client';

interface DailyUsageData {
  date: string;
  totalCost: number;
  totalCalls: number;
}

export function DailyUsageChart({ data }: { data: DailyUsageData[] }) {
  const maxCost = Math.max(...data.map(d => d.totalCost), 0);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', minWidth: '800px', height: '200px' }}>
      {data.map((day) => {
        const height = maxCost > 0 ? (day.totalCost / maxCost) * 100 : 0;

        return (
          <div key={day.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div
              title={`${day.date}: ¬${day.totalCost.toFixed(2)} (${day.totalCalls} calls)`}
              style={{
                width: '100%',
                backgroundColor: 'var(--lyd-primary)',
                opacity: 0.8,
                borderRadius: '4px 4px 0 0',
                height: `${height}%`,
                minHeight: day.totalCost > 0 ? '2px' : '0',
                transition: 'opacity 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
            />
            <div style={{ fontSize: '0.625rem', color: 'var(--lyd-text-muted)', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
              {new Date(day.date).toLocaleDateString('de-DE', { month: 'short', day: 'numeric' })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
