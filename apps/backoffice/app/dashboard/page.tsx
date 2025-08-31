import { 
  LdsCard, 
  LdsCardHeader, 
  LdsCardTitle, 
  LdsButton,
  LdsBadge
} from '@lifeyourdreams/design-system-react';

// Mock dashboard data
const dashboardData = {
  properties: {
    total: 2,
    published: 1,
    draft: 1,
    sold: 0
  },
  leads: {
    total: 7,
    new: 3,
    contacted: 2,
    qualified: 2
  },
  recentActivity: [
    {
      id: '1',
      type: 'lead',
      message: 'Neue Anfrage für 3-Zimmer-Wohnung Schwabing',
      timestamp: new Date('2024-12-19T10:30:00')
    },
    {
      id: '2', 
      type: 'property',
      message: 'Immobilie "Reihenmittelhaus Aubing" erstellt',
      timestamp: new Date('2024-12-18T16:45:00')
    }
  ]
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Überblick über Ihre Immobilienvermarktung</p>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <LdsCard>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Immobilien gesamt</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.properties.total}</p>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <LdsBadge variant="success" size="sm">{dashboardData.properties.published} veröffentlicht</LdsBadge>
                  <LdsBadge variant="warning" size="sm">{dashboardData.properties.draft} Entwurf</LdsBadge>
                </div>
              </div>
            </LdsCard>
            
            <LdsCard>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Interessenten</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.leads.total}</p>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <LdsBadge variant="warning" size="sm">{dashboardData.leads.new} neu</LdsBadge>
                  <LdsBadge variant="info" size="sm">{dashboardData.leads.contacted} kontaktiert</LdsBadge>
                </div>
              </div>
            </LdsCard>
          </div>
          
          {/* Recent Activity */}
          <LdsCard>
            <LdsCardHeader>
              <LdsCardTitle>Letzte Aktivitäten</LdsCardTitle>
            </LdsCardHeader>
            <div className="p-6 pt-0">
              <div className="space-y-4">
                {dashboardData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <LdsBadge variant={activity.type === 'lead' ? 'info' : 'success'}>
                        {activity.type === 'lead' ? 'Lead' : 'Property'}
                      </LdsBadge>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">
                        {activity.timestamp.toLocaleString('de-DE')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </LdsCard>
          
          {/* Quick Actions */}
          <div className="flex space-x-4">
            <LdsButton variant="primary">
              Neue Immobilie anlegen
            </LdsButton>
            <LdsButton variant="outline">
              Leads verwalten
            </LdsButton>
            <LdsButton variant="outline">
              Medien hochladen
            </LdsButton>
          </div>
        </div>
      </div>
    </div>
  );
}
