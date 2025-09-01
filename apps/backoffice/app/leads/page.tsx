'use client';

import React, { useState } from 'react';
import { 
  LdsCard, 
  LdsCardHeader, 
  LdsCardTitle, 
  LdsCardContent,
  LdsBadge,
  LdsButton,
  LdsInput,
  LdsSelect
} from '@liveyourdreams/design-system-react';

import { LeadQualification } from '@/components/leads/LeadQualification';
import { ViewingScheduler } from '@/components/leads/ViewingScheduler';
import { LeadTimeline, mockTimelineEvents } from '@/components/leads/LeadTimeline';

// Mock data for development
const mockLeads = [
  {
    id: '1',
    name: 'Anna Müller',
    email: 'anna.mueller@email.com',
    phone: '+49 123 456789',
    property: {
      id: 'prop-1',
      title: '3-Zimmer-Wohnung in Schwabing',
      address: 'Leopoldstraße 123, 80804 München',
      price: 75000000 // in cents
    },
    source: 'MICROSITE',
    status: 'NEW',
    score: null,
    message: 'Ich interessiere mich für die Wohnung und würde gerne einen Besichtigungstermin vereinbaren.',
    createdAt: '2024-01-15T10:30:00Z',
    gdprConsent: true,
    qualification: null,
    viewing: null
  },
  {
    id: '2',
    name: 'Thomas Schmidt',
    email: 'thomas.schmidt@email.com',
    phone: '+49 987 654321',
    property: {
      id: 'prop-2',
      title: '2-Zimmer-Wohnung in Maxvorstadt',
      address: 'Augustenstraße 45, 80333 München',
      price: 65000000
    },
    source: 'IMMOSCOUT24',
    status: 'QUALIFIED',
    score: 85,
    message: 'Suche eine Wohnung für meine Familie. Budget bis 800.000€.',
    createdAt: '2024-01-14T14:20:00Z',
    gdprConsent: true,
    qualification: {
      budget: 800000,
      financing: 'MORTGAGE',
      timeframe: 'WEEKS'
    },
    viewing: null
  },
  {
    id: '3',
    name: 'Maria Weber',
    email: 'maria.weber@email.com',
    phone: '+49 555 123456',
    property: {
      id: 'prop-3',
      title: '4-Zimmer-Haus in Sendling',
      address: 'Mittererstraße 78, 81379 München',
      price: 120000000
    },
    source: 'REFERRAL',
    status: 'CONTACTED',
    score: 72,
    message: 'Empfehlung von Frau Bauer. Interessiert an einem Haus mit Garten.',
    createdAt: '2024-01-13T09:15:00Z',
    gdprConsent: true,
    qualification: {
      budget: 1200000,
      financing: 'MIXED',
      timeframe: 'MONTHS'
    },
    viewing: {
      id: 'view-1',
      status: 'SCHEDULED',
      dateTime: '2024-01-20T14:00:00Z'
    }
  }
];

const mockAgents = [
  { id: 'agent-1', name: 'Max Mustermann', email: 'max@lyd.com', specialties: ['Luxusimmobilien'] },
  { id: 'agent-2', name: 'Anna Schmidt', email: 'anna@lyd.com', specialties: ['Familienhäuser'] },
  { id: 'agent-3', name: 'Tom Fischer', email: 'tom@lyd.com', specialties: ['Eigentumswohnungen'] }
];

/**
 * Enhanced Leads Management Page
 * 
 * Erweiterte Lead-Verwaltung mit:
 * - Lead Qualification
 * - Viewing Scheduling
 * - Activity Timeline
 * - Advanced Filtering
 */
export default function LeadsPage() {
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'list' | 'qualify' | 'schedule' | 'timeline'>('list');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterSource, setFilterSource] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter leads based on current filters
  const filteredLeads = mockLeads.filter(lead => {
    const matchesStatus = filterStatus === 'ALL' || lead.status === filterStatus;
    const matchesSource = filterSource === 'ALL' || lead.source === filterSource;
    const matchesSearch = !searchQuery || 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.property.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSource && matchesSearch;
  });

  const getStatusBadge = (status: string, score?: number | null) => {
    const statusConfig = {
      NEW: { variant: 'info' as const, label: '🆕 Neu' },
      CONTACTED: { variant: 'warning' as const, label: '📞 Kontaktiert' },
      QUALIFIED: { variant: 'success' as const, label: '⭐ Qualifiziert' },
      VIEWING: { variant: 'secondary' as const, label: '🏠 Besichtigung' },
      OFFER: { variant: 'warning' as const, label: '💰 Angebot' },
      CLOSED: { variant: 'success' as const, label: '✅ Abgeschlossen' },
      LOST: { variant: 'destructive' as const, label: '❌ Verloren' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || 
                  { variant: 'default' as const, label: status };
                  
    return (
      <div className="flex items-center space-x-2">
        <LdsBadge variant={config.variant}>{config.label}</LdsBadge>
        {score && (
          <LdsBadge variant={score >= 80 ? 'success' : score >= 60 ? 'warning' : 'default'}>
            {score}
          </LdsBadge>
        )}
      </div>
    );
  };

  const getSourceBadge = (source: string) => {
    const sourceConfig = {
      MICROSITE: { variant: 'info' as const, label: '🌐 Microsite' },
      IMMOSCOUT24: { variant: 'secondary' as const, label: '🏠 IS24' },
      PHONE: { variant: 'warning' as const, label: '📞 Telefon' },
      EMAIL: { variant: 'default' as const, label: '📧 E-Mail' },
      REFERRAL: { variant: 'success' as const, label: '👥 Empfehlung' },
      PORTAL: { variant: 'secondary' as const, label: '🌐 Portal' }
    };
    
    return sourceConfig[source as keyof typeof sourceConfig] || 
           { variant: 'default' as const, label: source };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLeadAction = (leadId: string, action: 'qualify' | 'schedule' | 'timeline') => {
    setSelectedLead(leadId);
    setActiveView(action);
  };

  const handleBackToList = () => {
    setSelectedLead(null);
    setActiveView('list');
  };

  // Get selected lead data
  const selectedLeadData = selectedLead ? mockLeads.find(l => l.id === selectedLead) : null;

  // Stats calculation
  const stats = {
    new: mockLeads.filter(l => l.status === 'NEW').length,
    qualified: mockLeads.filter(l => l.status === 'QUALIFIED').length,
    viewing: mockLeads.filter(l => l.viewing?.status === 'SCHEDULED').length,
    closed: mockLeads.filter(l => l.status === 'CLOSED').length
  };

  // Single lead view (qualification, scheduling, timeline)
  if (activeView !== 'list' && selectedLeadData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <LdsButton variant="outline" onClick={handleBackToList}>
                ← Zurück zur Liste
              </LdsButton>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {selectedLeadData.name} - {selectedLeadData.property.title}
                </h1>
                <p className="text-gray-600">{selectedLeadData.email}</p>
              </div>
            </div>

            {activeView === 'qualify' && (
              <LeadQualification
                leadId={selectedLeadData.id}
                leadName={selectedLeadData.name}
                leadEmail={selectedLeadData.email}
                propertyTitle={selectedLeadData.property.title}
                propertyPrice={selectedLeadData.property.price}
                existingQualification={selectedLeadData.qualification}
                onSave={async (qualification, score) => {
                  console.log('Qualification saved:', { qualification, score });
                  alert(`Lead erfolgreich qualifiziert! Score: ${score}`);
                  handleBackToList();
                }}
                onCancel={handleBackToList}
              />
            )}

            {activeView === 'schedule' && (
              <ViewingScheduler
                leadId={selectedLeadData.id}
                leadName={selectedLeadData.name}
                leadEmail={selectedLeadData.email}
                propertyId={selectedLeadData.property.id}
                propertyTitle={selectedLeadData.property.title}
                propertyAddress={selectedLeadData.property.address}
                existingViewing={selectedLeadData.viewing}
                availableAgents={mockAgents}
                onSchedule={async (viewing) => {
                  console.log('Viewing scheduled:', viewing);
                  alert('Besichtigung erfolgreich geplant!');
                  handleBackToList();
                }}
                onCancel={handleBackToList}
              />
            )}

            {activeView === 'timeline' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Aktivitätsverlauf</h2>
                <LeadTimeline events={mockTimelineEvents} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main leads list view
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lead-Management</h1>
              <p className="text-gray-600 mt-1">
                Erweiterte Verwaltung aller Interessenten-Anfragen
              </p>
            </div>
            
            <div className="flex space-x-3">
              <LdsButton variant="outline">
                📥 Import
              </LdsButton>
              <LdsButton variant="outline">
                📊 Analytics
              </LdsButton>
              <LdsButton variant="primary">
                ➕ Manueller Lead
              </LdsButton>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <LdsCard>
              <LdsCardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Neue Leads</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.new}</p>
                    <p className="text-xs text-gray-500 mt-1">Benötigen Aufmerksamkeit</p>
                  </div>
                  <div className="text-4xl">🆕</div>
                </div>
              </LdsCardContent>
            </LdsCard>
            
            <LdsCard>
              <LdsCardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Qualifiziert</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.qualified}</p>
                    <p className="text-xs text-gray-500 mt-1">Hohes Potenzial</p>
                  </div>
                  <div className="text-4xl">⭐</div>
                </div>
              </LdsCardContent>
            </LdsCard>
            
            <LdsCard>
              <LdsCardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Besichtigungen</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.viewing}</p>
                    <p className="text-xs text-gray-500 mt-1">Geplante Termine</p>
                  </div>
                  <div className="text-4xl">🏠</div>
                </div>
              </LdsCardContent>
            </LdsCard>
            
            <LdsCard>
              <LdsCardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Abgeschlossen</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.closed}</p>
                    <p className="text-xs text-gray-500 mt-1">Erfolgreich verkauft</p>
                  </div>
                  <div className="text-4xl">✅</div>
                </div>
              </LdsCardContent>
            </LdsCard>
          </div>

          {/* Filters */}
          <LdsCard>
            <LdsCardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <LdsInput
                  placeholder="🔍 Suche nach Name, E-Mail, Immobilie..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                
                <LdsSelect
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  options={[
                    { value: 'ALL', label: 'Alle Status' },
                    { value: 'NEW', label: '🆕 Neu' },
                    { value: 'CONTACTED', label: '📞 Kontaktiert' },
                    { value: 'QUALIFIED', label: '⭐ Qualifiziert' },
                    { value: 'VIEWING', label: '🏠 Besichtigung' },
                    { value: 'OFFER', label: '💰 Angebot' },
                    { value: 'CLOSED', label: '✅ Abgeschlossen' },
                    { value: 'LOST', label: '❌ Verloren' }
                  ]}
                />
                
                <LdsSelect
                  value={filterSource}
                  onChange={(e) => setFilterSource(e.target.value)}
                  options={[
                    { value: 'ALL', label: 'Alle Quellen' },
                    { value: 'MICROSITE', label: '🌐 Microsite' },
                    { value: 'IMMOSCOUT24', label: '🏠 ImmobilienScout24' },
                    { value: 'REFERRAL', label: '👥 Empfehlung' },
                    { value: 'PHONE', label: '📞 Telefon' },
                    { value: 'EMAIL', label: '📧 E-Mail' },
                    { value: 'PORTAL', label: '🌐 Portal' }
                  ]}
                />
                
                <LdsButton variant="outline">
                  📋 Export ({filteredLeads.length})
                </LdsButton>
              </div>
            </LdsCardContent>
          </LdsCard>

          {/* Enhanced Leads Table */}
          <LdsCard>
            <LdsCardHeader>
              <LdsCardTitle>
                Alle Leads ({filteredLeads.length} von {mockLeads.length})
              </LdsCardTitle>
            </LdsCardHeader>
            <LdsCardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 font-semibold text-gray-900">Lead</th>
                      <th className="pb-3 font-semibold text-gray-900">Immobilie</th>
                      <th className="pb-3 font-semibold text-gray-900">Quelle</th>
                      <th className="pb-3 font-semibold text-gray-900">Status & Score</th>
                      <th className="pb-3 font-semibold text-gray-900">Eingegangen</th>
                      <th className="pb-3 font-semibold text-gray-900">Aktionen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="py-4">
                          <div>
                            <div className="font-semibold text-gray-900">{lead.name}</div>
                            <div className="text-sm text-gray-600">{lead.email}</div>
                            {lead.phone && (
                              <div className="text-sm text-gray-600">{lead.phone}</div>
                            )}
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="text-sm text-gray-900 font-medium">
                            {lead.property.title}
                          </div>
                          <div className="text-sm text-gray-600">
                            {(lead.property.price / 100).toLocaleString('de-DE')} €
                          </div>
                          {lead.message && (
                            <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {lead.message}
                            </div>
                          )}
                        </td>
                        <td className="py-4">
                          <LdsBadge variant={getSourceBadge(lead.source).variant}>
                            {getSourceBadge(lead.source).label}
                          </LdsBadge>
                        </td>
                        <td className="py-4">
                          {getStatusBadge(lead.status, lead.score)}
                          {lead.viewing?.status === 'SCHEDULED' && (
                            <div className="mt-1">
                              <LdsBadge variant="info">📅 Termin geplant</LdsBadge>
                            </div>
                          )}
                        </td>
                        <td className="py-4 text-sm text-gray-600">
                          {formatDate(lead.createdAt)}
                        </td>
                        <td className="py-4">
                          <div className="flex flex-col space-y-1">
                            <div className="flex space-x-1">
                              <LdsButton 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleLeadAction(lead.id, 'timeline')}
                              >
                                👁️ Timeline
                              </LdsButton>
                              <LdsButton 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleLeadAction(lead.id, 'qualify')}
                              >
                                ⭐ Qualifizieren
                              </LdsButton>
                            </div>
                            <div className="flex space-x-1">
                              <LdsButton 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleLeadAction(lead.id, 'schedule')}
                              >
                                📅 Besichtigung
                              </LdsButton>
                              <LdsButton 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.open(`mailto:${lead.email}?subject=Re: ${lead.property.title}`)}
                              >
                                📧 E-Mail
                              </LdsButton>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredLeads.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-4xl mb-4">📭</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Keine Leads gefunden
                    </h3>
                    <p className="text-gray-600">
                      {searchQuery || filterStatus !== 'ALL' || filterSource !== 'ALL' 
                        ? 'Versuchen Sie andere Filter oder Suchbegriffe'
                        : 'Noch keine Interessenten-Anfragen eingegangen'
                      }
                    </p>
                  </div>
                )}
              </div>
            </LdsCardContent>
          </LdsCard>
        </div>
      </div>
    </div>
  );
}