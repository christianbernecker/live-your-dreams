import { 
  LdsCard, 
  LdsCardHeader, 
  LdsCardTitle, 
  LdsButton,
  LdsTable,
  LdsTableHeader,
  LdsTableBody,
  LdsTableRow,
  LdsTableHeaderCell,
  LdsTableCell,
  LdsBadge
} from '@liveyourdreams/design-system-react';

// Mock data for development
const mockProperties = [
  {
    id: '1',
    title: '3-Zimmer-Wohnung in Schwabing',
    city: 'München',
    postcode: '80804',
    price: 89000000, // in cents
    livingArea: 85,
    roomCount: 3,
    status: 'PUBLISHED',
    createdAt: new Date('2024-12-01'),
    _count: { leads: 5, media: 12 }
  },
  {
    id: '2', 
    title: 'Reihenmittelhaus in Aubing',
    city: 'München',
    postcode: '81243',
    price: 75000000, // in cents
    livingArea: 120,
    roomCount: 4,
    status: 'DRAFT',
    createdAt: new Date('2024-12-15'),
    _count: { leads: 0, media: 3 }
  }
];

function formatPrice(priceInCents: number) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceInCents / 100);
}

function getStatusVariant(status: string) {
  switch (status) {
    case 'PUBLISHED': return 'success';
    case 'DRAFT': return 'warning';
    case 'SOLD': return 'info';
    default: return 'default';
  }
}

export default function PropertiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Immobilien</h1>
          <p className="text-gray-600 mt-2">Verwalten Sie Ihre Immobilienangebote</p>
        </div>
        <LdsButton variant="primary">
          Neue Immobilie
        </LdsButton>
      </div>
      
      <LdsCard>
        <LdsCardHeader>
          <LdsCardTitle>Aktuelle Angebote</LdsCardTitle>
        </LdsCardHeader>
        
        <LdsTable>
          <LdsTableHeader>
            <LdsTableRow>
              <LdsTableHeaderCell>Titel</LdsTableHeaderCell>
              <LdsTableHeaderCell>Ort</LdsTableHeaderCell>
              <LdsTableHeaderCell>Preis</LdsTableHeaderCell>
              <LdsTableHeaderCell>Details</LdsTableHeaderCell>
              <LdsTableHeaderCell>Status</LdsTableHeaderCell>
              <LdsTableHeaderCell>Leads</LdsTableHeaderCell>
              <LdsTableHeaderCell>Aktionen</LdsTableHeaderCell>
            </LdsTableRow>
          </LdsTableHeader>
          <LdsTableBody>
            {mockProperties.map((property) => (
              <LdsTableRow key={property.id}>
                <LdsTableCell>
                  <div className="font-medium">{property.title}</div>
                  <div className="text-sm text-gray-500">
                    Erstellt: {property.createdAt.toLocaleDateString('de-DE')}
                  </div>
                </LdsTableCell>
                <LdsTableCell>
                  {property.city} {property.postcode}
                </LdsTableCell>
                <LdsTableCell>
                  <div className="font-medium">{formatPrice(property.price)}</div>
                </LdsTableCell>
                <LdsTableCell>
                  <div className="text-sm">
                    {property.livingArea}m² • {property.roomCount} Zimmer
                  </div>
                </LdsTableCell>
                <LdsTableCell>
                  <LdsBadge variant={getStatusVariant(property.status) as any}>
                    {property.status}
                  </LdsBadge>
                </LdsTableCell>
                <LdsTableCell>
                  <div className="text-sm">
                    {property._count.leads} Interessenten
                  </div>
                </LdsTableCell>
                <LdsTableCell>
                  <div className="flex space-x-2">
                    <LdsButton variant="outline" size="sm">
                      Bearbeiten
                    </LdsButton>
                    <LdsButton variant="outline" size="sm">
                      Ansehen
                    </LdsButton>
                  </div>
                </LdsTableCell>
              </LdsTableRow>
            ))}
          </LdsTableBody>
        </LdsTable>
      </LdsCard>
    </div>
  );
}
