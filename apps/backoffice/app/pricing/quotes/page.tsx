'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  LdsCard, 
  LdsCardHeader, 
  LdsCardTitle, 
  LdsCardContent,
  LdsButton,
  LdsBadge,
  LdsInput,
  LdsSelect
} from '@liveyourdreams/design-system-react';

interface Quote {
  quote_number: string;
  tier: string;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  valid_until: string;
  estimated_delivery_min: number;
  estimated_delivery_max: number;
  status: string;
  created_at: string;
  updated_at: string;
  quote_data: any;
}

interface QuotesResponse {
  quotes: Quote[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Saved Quotes Management Page
 * 
 * Allows users to:
 * - View all saved pricing quotes
 * - Filter and search quotes
 * - Edit/duplicate quotes
 * - Send quotes to clients
 * - Track quote status
 */
export default function SavedQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [pagination, setPagination] = useState<QuotesResponse['pagination'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadQuotes();
  }, [currentPage, statusFilter, tierFilter, searchQuery]);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });

      if (statusFilter) params.append('status', statusFilter);
      if (tierFilter) params.append('tier', tierFilter);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/pricing/quotes?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to load quotes');
      }

      const data: QuotesResponse = await response.json();
      setQuotes(data.quotes);
      setPagination(data.pagination);

    } catch (err) {
      console.error('Failed to load quotes:', err);
      setError(err instanceof Error ? err.message : 'Failed to load quotes');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(priceInCents / 100);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { variant: 'secondary' as const, label: '📝 Entwurf' },
      SENT: { variant: 'info' as const, label: '📤 Versendet' },
      VIEWED: { variant: 'warning' as const, label: '👁️ Angesehen' },
      ACCEPTED: { variant: 'success' as const, label: '✅ Angenommen' },
      REJECTED: { variant: 'destructive' as const, label: '❌ Abgelehnt' },
      EXPIRED: { variant: 'secondary' as const, label: '⏰ Abgelaufen' }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || 
           { variant: 'default' as const, label: status };
  };

  const getTierBadge = (tier: string) => {
    const tierConfig = {
      BASIC: { variant: 'info' as const, label: '📦 Basis' },
      PREMIUM: { variant: 'warning' as const, label: '⭐ Premium' },
      ENTERPRISE: { variant: 'success' as const, label: '🚀 Enterprise' }
    };
    
    return tierConfig[tier as keyof typeof tierConfig] || 
           { variant: 'default' as const, label: tier };
  };

  const isExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date();
  };

  if (loading && quotes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-600">Angebote werden geladen...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <Link 
                href="/pricing"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-2 inline-block"
              >
                ← Zurück zum Preiskalkulator
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                📄 Gespeicherte Angebote
              </h1>
              <p className="text-gray-600 mt-1">
                Verwalten Sie alle Ihre erstellten Preisangebote
              </p>
            </div>
            
            <Link href="/pricing">
              <LdsButton>
                ➕ Neues Angebot erstellen
              </LdsButton>
            </Link>
          </div>

          {/* Stats */}
          {pagination && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <LdsCard>
                <LdsCardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Gesamt</p>
                      <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
                      <p className="text-xs text-gray-500">Angebote</p>
                    </div>
                    <div className="text-3xl">📄</div>
                  </div>
                </LdsCardContent>
              </LdsCard>
              
              <LdsCard>
                <LdsCardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Entwürfe</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {quotes.filter(q => q.status === 'DRAFT').length}
                      </p>
                      <p className="text-xs text-gray-500">Noch nicht versendet</p>
                    </div>
                    <div className="text-3xl">📝</div>
                  </div>
                </LdsCardContent>
              </LdsCard>
              
              <LdsCard>
                <LdsCardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Versendet</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {quotes.filter(q => ['SENT', 'VIEWED'].includes(q.status)).length}
                      </p>
                      <p className="text-xs text-gray-500">Warten auf Antwort</p>
                    </div>
                    <div className="text-3xl">📤</div>
                  </div>
                </LdsCardContent>
              </LdsCard>
              
              <LdsCard>
                <LdsCardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Angenommen</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {quotes.filter(q => q.status === 'ACCEPTED').length}
                      </p>
                      <p className="text-xs text-gray-500">Erfolgreich</p>
                    </div>
                    <div className="text-3xl">✅</div>
                  </div>
                </LdsCardContent>
              </LdsCard>
            </div>
          )}

          {/* Filters */}
          <LdsCard>
            <LdsCardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <LdsInput
                  placeholder="🔍 Suche nach Angebotsnummer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                
                <LdsSelect
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={[
                    { value: '', label: 'Alle Status' },
                    { value: 'DRAFT', label: '📝 Entwurf' },
                    { value: 'SENT', label: '📤 Versendet' },
                    { value: 'VIEWED', label: '👁️ Angesehen' },
                    { value: 'ACCEPTED', label: '✅ Angenommen' },
                    { value: 'REJECTED', label: '❌ Abgelehnt' },
                    { value: 'EXPIRED', label: '⏰ Abgelaufen' }
                  ]}
                />
                
                <LdsSelect
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value)}
                  options={[
                    { value: '', label: 'Alle Pakete' },
                    { value: 'BASIC', label: '📦 Basis' },
                    { value: 'PREMIUM', label: '⭐ Premium' },
                    { value: 'ENTERPRISE', label: '🚀 Enterprise' }
                  ]}
                />
                
                <LdsButton variant="outline" onClick={loadQuotes}>
                  🔄 Aktualisieren
                </LdsButton>
              </div>
            </LdsCardContent>
          </LdsCard>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="text-red-600 text-xl mr-3">⚠️</div>
                <div>
                  <h4 className="font-semibold text-red-800">Fehler beim Laden</h4>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Quotes List */}
          {quotes.length > 0 ? (
            <LdsCard>
              <LdsCardHeader>
                <LdsCardTitle>
                  Alle Angebote ({pagination?.total || 0})
                </LdsCardTitle>
              </LdsCardHeader>
              <LdsCardContent>
                <div className="space-y-4">
                  {quotes.map((quote) => (
                    <div
                      key={quote.quote_number}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {quote.quote_number}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Erstellt am {new Date(quote.created_at).toLocaleDateString('de-DE')}
                            </p>
                          </div>
                          
                          <div className="flex space-x-2">
                            <LdsBadge variant={getTierBadge(quote.tier).variant}>
                              {getTierBadge(quote.tier).label}
                            </LdsBadge>
                            <LdsBadge variant={getStatusBadge(quote.status).variant}>
                              {getStatusBadge(quote.status).label}
                            </LdsBadge>
                            {isExpired(quote.valid_until) && quote.status !== 'EXPIRED' && (
                              <LdsBadge variant="destructive">
                                ⏰ Abgelaufen
                              </LdsBadge>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900">
                            {formatPrice(quote.total)}
                          </div>
                          <p className="text-sm text-gray-600">
                            Gültig bis {new Date(quote.valid_until).toLocaleDateString('de-DE')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {quote.estimated_delivery_min}-{quote.estimated_delivery_max} Werktage
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div className="text-sm text-gray-600">
                          Subtotal: {formatPrice(quote.subtotal)} • 
                          MwSt.: {formatPrice(quote.tax)} • 
                          Module: {quote.quote_data?.modules?.length || 0}
                        </div>
                        
                        <div className="flex space-x-2">
                          <LdsButton variant="outline" size="sm">
                            👁️ Ansehen
                          </LdsButton>
                          <LdsButton variant="outline" size="sm">
                            📧 Versenden
                          </LdsButton>
                          <LdsButton variant="outline" size="sm">
                            📄 Duplizieren
                          </LdsButton>
                          {quote.status === 'DRAFT' && (
                            <LdsButton variant="outline" size="sm">
                              ✏️ Bearbeiten
                            </LdsButton>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </LdsCardContent>
            </LdsCard>
          ) : !loading && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Noch keine Angebote erstellt
              </h3>
              <p className="text-gray-600 mb-6">
                Erstellen Sie Ihr erstes Angebot mit unserem Preiskalkulator
              </p>
              <Link href="/pricing">
                <LdsButton>
                  ➕ Erstes Angebot erstellen
                </LdsButton>
              </Link>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Seite {pagination.page} von {pagination.totalPages} 
                ({pagination.total} Angebote insgesamt)
              </div>
              
              <div className="flex space-x-2">
                <LdsButton
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPrev}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                >
                  ← Vorherige
                </LdsButton>
                
                {/* Page numbers */}
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, pagination.page - 2) + i;
                    if (pageNum > pagination.totalPages) return null;
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 text-sm rounded ${
                          pageNum === pagination.page
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <LdsButton
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNext}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  Nächste →
                </LdsButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
