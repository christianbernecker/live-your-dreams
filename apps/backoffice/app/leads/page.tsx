import { 
  LdsCard, 
  LdsCardHeader, 
  LdsCardTitle, 
  LdsTable,
  LdsTableHeader,
  LdsTableBody,
  LdsTableRow,
  LdsTableHeaderCell,
  LdsTableCell,
  LdsBadge
} from '@liveyourdreams/design-system-react';

// Mock data for development
const mockLeads = [
  {
    id: '1',
    email: 'max.mustermann@email.com',
    name: 'Max Mustermann',
    phone: '+49 89 123456',
    message: 'Interesse an der 3-Zimmer-Wohnung. Wann kann ich besichtigen?',
    source: 'MICROSITE',
    status: 'NEW',
    property: { title: '3-Zimmer-Wohnung in Schwabing', city: 'München' },
    createdAt: new Date('2024-12-19T10:30:00'),
  },
  {
    id: '2',
    email: 'anna.schmidt@email.com', 
    name: 'Anna Schmidt',
    phone: '+49 89 987654',
    message: 'Ist das Haus noch verfügbar? Finanzierung steht bereits.',
    source: 'IMMOSCOUT24',
    status: 'CONTACTED',
    property: { title: 'Reihenmittelhaus in Aubing', city: 'München' },
    createdAt: new Date('2024-12-18T14:15:00'),
  }
];

function getStatusVariant(status: string) {
  switch (status) {
    case 'NEW': return 'warning';
    case 'CONTACTED': return 'info';
    case 'QUALIFIED': return 'success';
    case 'LOST': return 'error';
    default: return 'default';
  }
}

function getSourceVariant(source: string) {
  switch (source) {
    case 'MICROSITE': return 'success';
    case 'IMMOSCOUT24': return 'info';
    case 'PORTAL': return 'default';
    default: return 'default';
  }
}

export default function LeadsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Interessenten</h1>
            <p className="text-gray-600 mt-2">Verwalten Sie eingehende Anfragen</p>
          </div>
          
          <LdsCard>
            <LdsCardHeader>
              <LdsCardTitle>Aktuelle Anfragen</LdsCardTitle>
            </LdsCardHeader>
            
            <LdsTable>
              <LdsTableHeader>
                <LdsTableRow>
                  <LdsTableHeaderCell>Kontakt</LdsTableHeaderCell>
                  <LdsTableHeaderCell>Immobilie</LdsTableHeaderCell>
                  <LdsTableHeaderCell>Nachricht</LdsTableHeaderCell>
                  <LdsTableHeaderCell>Quelle</LdsTableHeaderCell>
                  <LdsTableHeaderCell>Status</LdsTableHeaderCell>
                  <LdsTableHeaderCell>Eingegangen</LdsTableHeaderCell>
                </LdsTableRow>
              </LdsTableHeader>
              <LdsTableBody>
                {mockLeads.map((lead) => (
                  <LdsTableRow key={lead.id}>
                    <LdsTableCell>
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-sm text-gray-500">{lead.email}</div>
                      {lead.phone && (
                        <div className="text-sm text-gray-500">{lead.phone}</div>
                      )}
                    </LdsTableCell>
                    <LdsTableCell>
                      <div className="font-medium">{lead.property.title}</div>
                      <div className="text-sm text-gray-500">{lead.property.city}</div>
                    </LdsTableCell>
                    <LdsTableCell>
                      <div className="text-sm max-w-xs truncate">
                        {lead.message}
                      </div>
                    </LdsTableCell>
                    <LdsTableCell>
                      <LdsBadge variant={getSourceVariant(lead.source) as any}>
                        {lead.source}
                      </LdsBadge>
                    </LdsTableCell>
                    <LdsTableCell>
                      <LdsBadge variant={getStatusVariant(lead.status) as any}>
                        {lead.status}
                      </LdsBadge>
                    </LdsTableCell>
                    <LdsTableCell>
                      <div className="text-sm">
                        {lead.createdAt.toLocaleDateString('de-DE')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {lead.createdAt.toLocaleTimeString('de-DE', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </LdsTableCell>
                  </LdsTableRow>
                ))}
              </LdsTableBody>
            </LdsTable>
          </LdsCard>
        </div>
      </div>
    </div>
  );
}
