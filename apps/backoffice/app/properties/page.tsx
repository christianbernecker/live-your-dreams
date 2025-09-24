'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Property {
  id: string;
  title: string;
  type: 'APARTMENT' | 'HOUSE' | 'PENTHOUSE' | 'COMMERCIAL';
  status: 'DRAFT' | 'PUBLISHED' | 'SOLD' | 'RENTED';
  address: string;
  city: string;
  postcode: string;
  price: number;
  livingArea: number;
  roomCount: number;
  bathrooms: number;
  hasBalcony: boolean;
  hasGarden: boolean;
  hasParking: boolean;
  energyClass: string;
  constructionYear: number;
  availableFrom: string;
  description: string;
  images: { id: string; url: string; title: string; isPrimary: boolean }[];
  leads: { count: number; new: number };
  microsite: { views: number; slug: string };
  is24Id?: string;
  createdAt: string;
  updatedAt: string;
}

const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Moderne 3-Zimmer-Wohnung in Schwabing',
    type: 'APARTMENT',
    status: 'PUBLISHED',
    address: 'Leopoldstraße 123',
    city: 'München',
    postcode: '80804',
    price: 750000,
    livingArea: 85,
    roomCount: 3,
    bathrooms: 1,
    hasBalcony: true,
    hasGarden: false,
    hasParking: true,
    energyClass: 'B',
    constructionYear: 2018,
    availableFrom: '2024-11-01',
    description: 'Hochwertige Wohnung in Top-Lage',
    images: [
      { id: '1', url: '/img1.jpg', title: 'Wohnzimmer', isPrimary: true }
    ],
    leads: { count: 12, new: 3 },
    microsite: { views: 234, slug: '3-zimmer-schwabing' },
    is24Id: 'IS24-123456',
    createdAt: '2024-01-15',
    updatedAt: '2024-09-20'
  },
  {
    id: '2',
    title: 'Penthouse mit Dachterrasse in Bogenhausen',
    type: 'PENTHOUSE',
    status: 'PUBLISHED',
    address: 'Prinzregentenstraße 45',
    city: 'München',
    postcode: '81675',
    price: 2500000,
    livingArea: 180,
    roomCount: 5,
    bathrooms: 3,
    hasBalcony: true,
    hasGarden: false,
    hasParking: true,
    energyClass: 'A',
    constructionYear: 2022,
    availableFrom: 'sofort',
    description: 'Luxus-Penthouse mit spektakulärer Aussicht',
    images: [
      { id: '2', url: '/img2.jpg', title: 'Außenansicht', isPrimary: true }
    ],
    leads: { count: 8, new: 2 },
    microsite: { views: 567, slug: 'penthouse-bogenhausen' },
    createdAt: '2024-02-20',
    updatedAt: '2024-09-22'
  },
  {
    id: '3',
    title: '2-Zimmer-Wohnung in Maxvorstadt',
    type: 'APARTMENT',
    status: 'DRAFT',
    address: 'Augustenstraße 78',
    city: 'München',
    postcode: '80333',
    price: 450000,
    livingArea: 65,
    roomCount: 2,
    bathrooms: 1,
    hasBalcony: false,
    hasGarden: false,
    hasParking: false,
    energyClass: 'C',
    constructionYear: 1965,
    availableFrom: '2024-12-01',
    description: 'Zentral gelegene Wohnung in beliebter Lage',
    images: [],
    leads: { count: 0, new: 0 },
    microsite: { views: 0, slug: '' },
    createdAt: '2024-09-15',
    updatedAt: '2024-09-15'
  }
];

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simuliere API-Call
    setTimeout(() => {
      setProperties(mockProperties);
      setLoading(false);
    }, 500);
  }, []);

  const filteredProperties = properties.filter(property => {
    const matchesFilter = filter === 'all' || 
      (filter === 'published' && property.status === 'PUBLISHED') ||
      (filter === 'draft' && property.status === 'DRAFT');
    
    const matchesSearch = searchTerm === '' || 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, any> = {
      PUBLISHED: { bg: '#d1fae5', color: '#065f46', label: 'Veröffentlicht' },
      DRAFT: { bg: '#f3f4f6', color: '#6b7280', label: 'Entwurf' },
      SOLD: { bg: '#dbeafe', color: '#1e40af', label: 'Verkauft' },
      RENTED: { bg: '#fef3c7', color: '#92400e', label: 'Vermietet' }
    };
    const style = styles[status] || styles.DRAFT;
    
    return (
      <span style={{
        padding: '4px 8px',
        borderRadius: 'var(--radius-sm)',
        fontSize: 'var(--font-size-sm)',
        backgroundColor: style.bg,
        color: style.color,
        fontWeight: 'var(--font-weight-medium)'
      }}>
        {style.label}
      </span>
    );
  };

  const getPropertyTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      APARTMENT: '🏢',
      HOUSE: '🏠',
      PENTHOUSE: '🏙️',
      COMMERCIAL: '🏪'
    };
    return icons[type] || '🏠';
  };

  return (
    <div className="backoffice-layout">
      {/* Sidebar Navigation */}
      <aside className="backoffice-sidebar">
        <div style={{ marginBottom: '32px' }}>
          <img src="/shared/lyd-logo.svg" alt="Live Your Dreams" style={{ height: '48px', marginBottom: '8px' }} />
          <div style={{ fontSize: '14px', opacity: '0.8' }}>Backoffice</div>
        </div>
        
        <nav>
          <a href="/dashboard" className="backoffice-nav-item">
            <span>📊</span> Dashboard
          </a>
          <a href="/properties" className="backoffice-nav-item active">
            <span>🏠</span> Immobilien
          </a>
          <a href="/leads" className="backoffice-nav-item">
            <span>👥</span> Interessenten
          </a>
          <a href="/pricing" className="backoffice-nav-item">
            <span>💰</span> Preisrechner
          </a>
          <a href="/media" className="backoffice-nav-item">
            <span>🖼️</span> Medien
          </a>
          <a href="/microsite" className="backoffice-nav-item">
            <span>🌐</span> Microsites
          </a>
          <a href="/integrations" className="backoffice-nav-item">
            <span>🔗</span> Integrationen
          </a>
          <a href="/settings" className="backoffice-nav-item">
            <span>⚙️</span> Einstellungen
          </a>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="backoffice-main">
        <header className="backoffice-header">
          <div>
            <h1 style={{ margin: '0', fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>
              Immobilien
            </h1>
            <p style={{ margin: '8px 0 0 0', color: 'var(--lyd-grey)' }}>
              Verwalten Sie Ihre Immobilienangebote
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
            <button className="lyd-button lyd-button-secondary">
              📥 Import
            </button>
            <Link href="/properties/new" className="lyd-button lyd-button-primary">
              ➕ Neue Immobilie
            </Link>
          </div>
        </header>

        {/* Filter Bar */}
        <div className="component-card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ flex: '1', minWidth: '200px' }}>
              <input
                type="text"
                placeholder="🔍 Suche nach Titel, Stadt oder Adresse..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--lyd-line)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-sm)',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--lyd-primary)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--lyd-line)'}
              />
            </div>

            {/* Status Filter */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => setFilter('all')}
                style={{
                  padding: '8px 16px',
                  border: '1px solid',
                  borderColor: filter === 'all' ? 'var(--lyd-primary)' : 'var(--lyd-line)',
                  backgroundColor: filter === 'all' ? 'var(--lyd-primary)' : 'transparent',
                  color: filter === 'all' ? 'white' : 'var(--lyd-text)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Alle ({properties.length})
              </button>
              <button
                onClick={() => setFilter('published')}
                style={{
                  padding: '8px 16px',
                  border: '1px solid',
                  borderColor: filter === 'published' ? 'var(--lyd-primary)' : 'var(--lyd-line)',
                  backgroundColor: filter === 'published' ? 'var(--lyd-primary)' : 'transparent',
                  color: filter === 'published' ? 'white' : 'var(--lyd-text)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Veröffentlicht ({properties.filter(p => p.status === 'PUBLISHED').length})
              </button>
              <button
                onClick={() => setFilter('draft')}
                style={{
                  padding: '8px 16px',
                  border: '1px solid',
                  borderColor: filter === 'draft' ? 'var(--lyd-primary)' : 'var(--lyd-line)',
                  backgroundColor: filter === 'draft' ? 'var(--lyd-primary)' : 'transparent',
                  color: filter === 'draft' ? 'white' : 'var(--lyd-text)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Entwürfe ({properties.filter(p => p.status === 'DRAFT').length})
              </button>
            </div>

            {/* Sort */}
            <select 
              style={{
                padding: '8px 12px',
                border: '1px solid var(--lyd-line)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-sm)',
                cursor: 'pointer',
                background: 'white'
              }}
            >
              <option>Neueste zuerst</option>
              <option>Älteste zuerst</option>
              <option>Preis aufsteigend</option>
              <option>Preis absteigend</option>
              <option>Meiste Leads</option>
            </select>
          </div>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '24px', marginBottom: '16px' }}>⏳</div>
            <p style={{ color: 'var(--lyd-grey)' }}>Lade Immobilien...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
            <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: '8px' }}>Keine Immobilien gefunden</p>
            <p style={{ color: 'var(--lyd-grey)' }}>Passen Sie Ihre Suchkriterien an oder erstellen Sie eine neue Immobilie.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
            gap: 'var(--spacing-lg)'
          }}>
            {filteredProperties.map(property => (
              <div 
                key={property.id} 
                className="component-card" 
                style={{ 
                  padding: 0, 
                  overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
                }}
              >
                {/* Image */}
                <div style={{
                  height: '200px',
                  background: property.images.length > 0 
                    ? `url(${property.images[0].url}) center/cover`
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  position: 'relative'
                }}>
                  {property.images.length === 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: '48px',
                      opacity: 0.3
                    }}>
                      {getPropertyTypeIcon(property.type)}
                    </div>
                  )}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    display: 'flex',
                    gap: '8px'
                  }}>
                    {getStatusBadge(property.status)}
                    {property.is24Id && (
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '12px',
                        backgroundColor: 'white',
                        color: 'var(--lyd-deep)',
                        fontWeight: 'var(--font-weight-medium)'
                      }}>
                        IS24 ✓
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: 'var(--spacing-lg)' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: 'var(--font-size-lg)' }}>
                    {property.title}
                  </h3>
                  
                  <p style={{ 
                    color: 'var(--lyd-grey)', 
                    fontSize: 'var(--font-size-sm)',
                    marginBottom: '16px'
                  }}>
                    📍 {property.address}, {property.postcode} {property.city}
                  </p>

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <div style={{ fontSize: '24px', fontWeight: 'var(--font-weight-bold)', color: 'var(--lyd-primary)' }}>
                        {formatPrice(property.price)}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--lyd-grey)' }}>
                        {Math.round(property.price / property.livingArea).toLocaleString('de-DE')} €/m²
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '18px', fontWeight: 'var(--font-weight-medium)' }}>
                        {property.livingArea} m²
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--lyd-grey)' }}>
                        {property.roomCount} Zimmer
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div style={{ 
                    display: 'flex', 
                    gap: '8px',
                    flexWrap: 'wrap',
                    marginBottom: '16px'
                  }}>
                    {property.hasBalcony && (
                      <span style={{ fontSize: '14px' }}>🌅 Balkon</span>
                    )}
                    {property.hasGarden && (
                      <span style={{ fontSize: '14px' }}>🌳 Garten</span>
                    )}
                    {property.hasParking && (
                      <span style={{ fontSize: '14px' }}>🚗 Stellplatz</span>
                    )}
                    <span style={{ fontSize: '14px' }}>⚡ {property.energyClass}</span>
                  </div>

                  {/* Stats */}
                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--lyd-line)'
                  }}>
                    <div style={{ fontSize: 'var(--font-size-sm)' }}>
                      <span style={{ color: 'var(--lyd-grey)' }}>Leads:</span>{' '}
                      <strong>{property.leads.count}</strong>
                      {property.leads.new > 0 && (
                        <span style={{ color: '#16a34a', marginLeft: '4px' }}>
                          (+{property.leads.new})
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-sm)' }}>
                      <span style={{ color: 'var(--lyd-grey)' }}>Views:</span>{' '}
                      <strong>{property.microsite.views}</strong>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginTop: '16px'
                  }}>
                    <Link 
                      href={`/properties/${property.id}`}
                      className="lyd-button lyd-button-secondary"
                      style={{ flex: 1, textAlign: 'center', fontSize: 'var(--font-size-sm)' }}
                    >
                      Bearbeiten
                    </Link>
                    {property.microsite.slug && (
                      <a 
                        href={`https://liveyourdreams.online/${property.microsite.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="lyd-button lyd-button-primary"
                        style={{ flex: 1, textAlign: 'center', fontSize: 'var(--font-size-sm)' }}
                      >
                        Microsite →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}