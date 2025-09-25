'use client'

import React, { useState, useEffect } from 'react'

interface MetricData {
  label: string
  value: string
  change: number
  trend: 'up' | 'down' | 'stable'
  icon: React.ReactNode
  color: string
}

interface DashboardMetricsProps {
  className?: string
}

export default function DashboardMetrics({ className }: DashboardMetricsProps) {
  const [metrics, setMetrics] = useState<MetricData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to get metrics
    const fetchMetrics = async () => {
      try {
        // In real implementation, fetch from API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockMetrics: MetricData[] = [
          {
            label: 'Gesamt Benutzer',
            value: '1,234',
            change: 12.5,
            trend: 'up',
            color: '#3b82f6',
            icon: (
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            )
          },
          {
            label: 'Aktive Sessions',
            value: '89',
            change: -3.2,
            trend: 'down',
            color: '#10b981',
            icon: (
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )
          },
          {
            label: 'Neue Posts',
            value: '42',
            change: 8.1,
            trend: 'up',
            color: '#f59e0b',
            icon: (
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )
          },
          {
            label: 'Media Dateien',
            value: '2,156',
            change: 0,
            trend: 'stable',
            color: '#8b5cf6',
            icon: (
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )
          }
        ]
        
        setMetrics(mockMetrics)
      } catch (error) {
        console.error('Failed to fetch metrics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return (
          <svg width="16" height="16" fill="none" stroke="#10b981" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l6-6 6 6" />
          </svg>
        )
      case 'down':
        return (
          <svg width="16" height="16" fill="none" stroke="#ef4444" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-6 6-6-6" />
          </svg>
        )
      default:
        return (
          <svg width="16" height="16" fill="none" stroke="#6b7280" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        )
    }
  }

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return '#10b981'
      case 'down': return '#ef4444'
      default: return '#6b7280'
    }
  }

  if (loading) {
    return (
      <div className={className}>
        <div style={{
          display: 'grid',
          gap: 'var(--spacing-lg)',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
        }}>
          {[...Array(4)].map((_, index) => (
            <div key={index} className="lyd-card" style={{ padding: 'var(--spacing-lg)' }}>
              <div style={{
                height: '80px',
                backgroundColor: 'var(--lyd-accent)',
                borderRadius: '8px',
                animation: 'pulse 2s infinite'
              }} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div style={{
        display: 'grid',
        gap: 'var(--spacing-lg)',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
      }}>
        {metrics.map((metric, index) => (
          <div key={index} className="lyd-card" style={{
            padding: 'var(--spacing-lg)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'var(--lyd-shadow)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: 'var(--spacing-md)'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: `${metric.color}15`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: metric.color
              }}>
                {metric.icon}
              </div>
              
              {metric.change !== 0 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: 'var(--font-size-sm)',
                  color: getTrendColor(metric.trend),
                  fontWeight: 'var(--font-weight-medium)'
                }}>
                  {getTrendIcon(metric.trend)}
                  {Math.abs(metric.change)}%
                </div>
              )}
            </div>

            <div>
              <div style={{
                fontSize: 'var(--font-size-2xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--lyd-text)',
                marginBottom: '4px',
                fontFamily: 'var(--font-family-primary)'
              }}>
                {metric.value}
              </div>
              
              <div style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--lyd-grey)',
                fontFamily: 'var(--font-family-primary)'
              }}>
                {metric.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
