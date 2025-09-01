'use client';

import React, { useState } from 'react';
import { notFound } from 'next/navigation';
import {
  LdsCard,
  LdsCardHeader,
  LdsCardTitle,
  LdsCardContent,
  LdsButton,
  LdsInput,
  LdsSelect,
  LdsBadge
} from '@liveyourdreams/design-system-react';

import { EnergyCertificateForm } from '@/components/properties/EnergyCertificateForm';
import { MediaUploader, type MediaFile } from '@/components/media/MediaUploader';
import { Viewer360 } from '@/components/media/Viewer360';
import { RoomsManagement } from '@/components/properties/RoomsManagement';
import { IS24Publisher } from '@/components/properties/IS24Publisher';

// Mock data - in production, fetch from API
const mockProperty = {
  id: '1',
  title: '3-Zimmer-Wohnung in Schwabing',
  description: 'Schöne Wohnung im Herzen von München',
  city: 'München',
  postcode: '80804',
  address: 'Musterstraße 123',
  price: 89000000, // in cents
  livingArea: 85,
  totalArea: 95,
  roomCount: 3,
  bedrooms: 2,
  bathrooms: 1,
  buildYear: 1995,
  status: 'DRAFT',
  type: 'WOHNUNG',
  
  // Energy Certificate Data
  energyType: 'Verbrauch',
  energyValue: 125.5,
  energyClass: 'D',
  energyCarrier: 'Gas',
  energyCertType: 'Wohnung',
  energyCertIssueYear: 2022,
  energyCertValidUntil: new Date('2032-05-15'),
  heatingConsumption: 110.0,
  hotWaterConsumption: 15.5,
  consumptionYears: '2019-2021',
  
  createdAt: new Date('2024-12-01'),
  updatedAt: new Date('2024-12-15')
};

interface PropertyDetailPageProps {
  params: { id: string };
}

export default function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'energy' | 'media' | 'rooms' | 'portal'>('details');
  const [property] = useState(mockProperty);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([
    // Mock existing media
    {
      id: 'existing-1',
      file: new File([], 'wohnzimmer.jpg'),
      type: 'image',
      preview: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600',
      status: 'success',
      progress: 100,
      metadata: { width: 1920, height: 1440, size: 850000 }
    },
    {
      id: 'existing-2', 
      file: new File([], 'kueche_360.jpg'),
      type: '360',
      preview: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400',
      status: 'success',
      progress: 100,
      metadata: { width: 4096, height: 2048, size: 2800000 }
    }
  ]);

  const [rooms, setRooms] = useState([
    {
      id: '1',
      name: 'Wohnzimmer',
      type: 'WOHNZIMMER' as const,
      area: 25.5,
      description: 'Großzügiges Wohnzimmer mit Südausrichtung und Zugang zum Balkon',
      mediaCount: 8,
      order: 0
    },
    {
      id: '2',
      name: 'Küche',
      type: 'KUECHE' as const,
      area: 12.0,
      description: 'Moderne Einbauküche mit hochwertigen Geräten',
      mediaCount: 5,
      order: 1
    },
    {
      id: '3',
      name: 'Hauptschlafzimmer',
      type: 'SCHLAFZIMMER' as const,
      area: 18.5,
      description: 'Ruhiges Schlafzimmer mit Einbauschränken',
      mediaCount: 4,
      order: 2
    },
    {
      id: '4',
      name: 'Badezimmer',
      type: 'BADEZIMMER' as const,
      area: 8.5,
      description: 'Vollbad mit Badewanne und separater Dusche',
      mediaCount: 3,
      order: 3
    }
  ]);

  // In production: fetch property data
  if (!property) {
    notFound();
  }

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(priceInCents / 100);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'success';
      case 'DRAFT': return 'warning';
      case 'SOLD': return 'info';
      default: return 'default';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
          <p className="text-gray-600 mt-1">{property.city} {property.postcode}</p>
          <div className="flex items-center gap-3 mt-3">
            <LdsBadge variant={getStatusVariant(property.status) as any}>
              {property.status}
            </LdsBadge>
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(property.price)}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <LdsButton variant="outline">
            Vorschau
          </LdsButton>
          <LdsButton variant="primary">
            Speichern
          </LdsButton>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'details', label: 'Details' },
            { id: 'energy', label: 'Energieausweis' },
            { id: 'media', label: 'Medien' },
            { id: 'rooms', label: 'Räume' },
            { id: 'portal', label: 'Portale' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Grunddaten */}
          <LdsCard>
            <LdsCardHeader>
              <LdsCardTitle>Grunddaten</LdsCardTitle>
            </LdsCardHeader>
            <LdsCardContent>
              <div className="grid grid-cols-1 gap-4">
                <LdsInput
                  label="Titel"
                  value={property.title}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <LdsInput
                    label="Stadt"
                    value={property.city}
                    required
                  />
                  <LdsInput
                    label="PLZ"
                    value={property.postcode}
                    required
                  />
                </div>
                <LdsInput
                  label="Adresse"
                  value={property.address || ''}
                  placeholder="Optional für Exposé"
                />
                <div className="grid grid-cols-2 gap-4">
                  <LdsSelect
                    label="Typ"
                    value={property.type}
                    options={[
                      { value: 'WOHNUNG', label: 'Wohnung' },
                      { value: 'HAUS', label: 'Haus' },
                      { value: 'REIHENHAUS', label: 'Reihenhaus' },
                      { value: 'DOPPELHAUS', label: 'Doppelhaus' },
                      { value: 'MEHRFAMILIENHAUS', label: 'Mehrfamilienhaus' },
                      { value: 'GEWERBE', label: 'Gewerbe' }
                    ]}
                    required
                  />
                  <LdsSelect
                    label="Status"
                    value={property.status}
                    options={[
                      { value: 'DRAFT', label: 'Entwurf' },
                      { value: 'REVIEW', label: 'Prüfung' },
                      { value: 'PUBLISHED', label: 'Veröffentlicht' },
                      { value: 'SOLD', label: 'Verkauft' },
                      { value: 'ARCHIVED', label: 'Archiviert' }
                    ]}
                    required
                  />
                </div>
              </div>
            </LdsCardContent>
          </LdsCard>

          {/* Flächenangaben */}
          <LdsCard>
            <LdsCardHeader>
              <LdsCardTitle>Flächenangaben</LdsCardTitle>
            </LdsCardHeader>
            <LdsCardContent>
              <div className="grid grid-cols-1 gap-4">
                <LdsInput
                  type="number"
                  label="Kaufpreis (€)"
                  value={property.price / 100}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <LdsInput
                    type="number"
                    label="Wohnfläche (m²)"
                    value={property.livingArea}
                    step="0.1"
                    required
                  />
                  <LdsInput
                    type="number"
                    label="Grundstücksfläche (m²)"
                    value={property.totalArea}
                    step="0.1"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <LdsInput
                    type="number"
                    label="Zimmer"
                    value={property.roomCount}
                    step="0.5"
                    min="1"
                    required
                  />
                  <LdsInput
                    type="number"
                    label="Schlafzimmer"
                    value={property.bedrooms}
                    min="0"
                  />
                  <LdsInput
                    type="number"
                    label="Badezimmer"
                    value={property.bathrooms}
                    min="1"
                  />
                </div>
                <LdsInput
                  type="number"
                  label="Baujahr"
                  value={property.buildYear}
                  min="1800"
                  max={new Date().getFullYear()}
                />
              </div>
            </LdsCardContent>
          </LdsCard>
        </div>
      )}

      {activeTab === 'energy' && (
        <LdsCard>
          <LdsCardHeader>
            <LdsCardTitle>Energieausweis (GEG § 87 Pflichtangaben)</LdsCardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Alle Angaben sind für die Veröffentlichung gemäß Gebäudeenergiegesetz erforderlich.
            </p>
          </LdsCardHeader>
          <LdsCardContent>
            <EnergyCertificateForm
              initialData={{
                energyType: property.energyType,
                energyValue: property.energyValue,
                energyClass: property.energyClass,
                energyCarrier: property.energyCarrier,
                energyCertType: property.energyCertType,
                energyCertIssueYear: property.energyCertIssueYear,
                energyCertValidUntil: property.energyCertValidUntil,
                heatingConsumption: property.heatingConsumption,
                hotWaterConsumption: property.hotWaterConsumption,
                consumptionYears: property.consumptionYears,
              }}
              onSubmit={(data) => {
                console.log('Energy certificate data:', data);
                // TODO: Submit to API
              }}
            />
          </LdsCardContent>
        </LdsCard>
      )}

      {activeTab === 'media' && (
        <div className="space-y-6">
          {/* Media Upload */}
          <MediaUploader
            acceptedTypes={['image', '360', 'floorplan']}
            maxFiles={50}
            maxFileSize={50 * 1024 * 1024} // 50MB
            existingMedia={mediaFiles}
            propertyId={property.id}
            onUpload={async (files) => {
              console.log('Uploading files:', files);
              
              // Mock upload process
              for (const file of files) {
                setMediaFiles(prev => 
                  prev.map(f => 
                    f.id === file.id 
                      ? { ...f, status: 'uploading', progress: 0 }
                      : f
                  )
                );
                
                // Simulate upload progress
                for (let progress = 0; progress <= 100; progress += 20) {
                  await new Promise(resolve => setTimeout(resolve, 200));
                  setMediaFiles(prev => 
                    prev.map(f => 
                      f.id === file.id 
                        ? { ...f, progress }
                        : f
                    )
                  );
                }
                
                // Mark as success
                setMediaFiles(prev => 
                  prev.map(f => 
                    f.id === file.id 
                      ? { ...f, status: 'success', progress: 100 }
                      : f
                  )
                );
              }
              
              // TODO: Real upload to /api/properties/[id]/media
              /*
              const formData = new FormData();
              files.forEach((file, index) => {
                formData.append(`file${index}`, file.file);
              });
              
              const response = await fetch(`/api/properties/${property.id}/media`, {
                method: 'POST',
                body: formData
              });
              
              if (!response.ok) {
                throw new Error('Upload failed');
              }
              */
            }}
            onRemove={(fileId) => {
              setMediaFiles(prev => prev.filter(f => f.id !== fileId));
              // TODO: Delete from server
            }}
          />
          
          {/* 360° Viewer Demo */}
          {mediaFiles.some(f => f.type === '360') && (
            <LdsCard>
              <LdsCardHeader>
                <LdsCardTitle>360°-Rundgang Vorschau</LdsCardTitle>
                <p className="text-sm text-gray-600 mt-2">
                  Interaktiver 360°-Viewer für Immobilien-Rundgänge
                </p>
              </LdsCardHeader>
              <LdsCardContent>
                <Viewer360
                  panoramaUrl="https://pannellum.org/images/alma.jpg"
                  previewUrl={mediaFiles.find(f => f.type === '360')?.preview}
                  height={500}
                  autoLoad={true}
                  showFullscreen={true}
                  showZoomControls={true}
                  showCompass={true}
                  initialView={{
                    yaw: 0,
                    pitch: 0,
                    hfov: 90
                  }}
                  hotSpots={[
                    {
                      type: 'info',
                      pitch: 10,
                      yaw: 20,
                      text: 'Küche mit modernen Geräten'
                    },
                    {
                      type: 'info',
                      pitch: -10,
                      yaw: -45,
                      text: 'Zugang zum Wohnzimmer'
                    }
                  ]}
                  onLoad={(viewer) => {
                    console.log('360° Viewer loaded:', viewer);
                  }}
                  onError={(error) => {
                    console.error('360° Viewer error:', error);
                  }}
                />
                <div className="mt-4 text-sm text-gray-600">
                  <p><strong>💡 Tipp:</strong> Verwenden Sie die Maus oder Touch-Gesten zum Navigieren.</p>
                  <p><strong>🎯 Hotspots:</strong> Klicken Sie auf die Informationspunkte für Details.</p>
                </div>
              </LdsCardContent>
            </LdsCard>
          )}
        </div>
      )}

      {activeTab === 'rooms' && (
        <RoomsManagement
          propertyId={property.id}
          rooms={rooms}
          onUpdateRooms={async (updatedRooms) => {
            console.log('Updating rooms:', updatedRooms);
            setRooms(updatedRooms);
            
            // TODO: API call to update room order
            /*
            const response = await fetch(`/api/properties/${property.id}/rooms/reorder`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                rooms: updatedRooms.map((room, index) => ({
                  id: room.id,
                  order: index
                }))
              })
            });
            
            if (!response.ok) {
              throw new Error('Failed to update room order');
            }
            */
          }}
          onCreateRoom={async (roomData) => {
            console.log('Creating room:', roomData);
            
            // Mock new room creation
            const newRoom = {
              id: `room-${Date.now()}`,
              ...roomData,
              mediaCount: 0
            };
            
            setRooms(prev => [...prev, newRoom]);
            
            // TODO: API call to create room
            /*
            const response = await fetch(`/api/properties/${property.id}/rooms`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(roomData)
            });
            
            if (!response.ok) {
              throw new Error('Failed to create room');
            }
            
            const createdRoom = await response.json();
            return createdRoom;
            */
            
            return newRoom;
          }}
          onDeleteRoom={async (roomId) => {
            console.log('Deleting room:', roomId);
            setRooms(prev => prev.filter(r => r.id !== roomId));
            
            // TODO: API call to delete room
            /*
            const response = await fetch(`/api/properties/${property.id}/rooms/${roomId}`, {
              method: 'DELETE'
            });
            
            if (!response.ok) {
              throw new Error('Failed to delete room');
            }
            */
          }}
        />
      )}

      {activeTab === 'portal' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Portal-Integration
            </h2>
            <p className="text-gray-600">
              Veröffentlichen Sie Ihre Immobilie auf verschiedenen Portalen und verwalten Sie alle Listings zentral.
            </p>
          </div>

          {/* ImmobilienScout24 Integration */}
          <IS24Publisher
            propertyId={property.id}
            propertyTitle={property.title}
            isPublished={property.published}
            hasRequiredFields={!!(
              property.energyType && 
              property.energyValue && 
              property.energyClass && 
              property.livingArea && 
              property.roomCount
            )}
            existingListing={{
              id: 'mock-listing-1',
              externalId: 'IS24-12345678',
              status: 'PUBLISHED',
              publishedAt: new Date('2024-12-15'),
              lastSyncAt: new Date('2024-12-19')
            }}
          />

          {/* Future Portal Integrations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Immowelt */}
            <LdsCard className="opacity-50">
              <LdsCardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">🏘️</div>
                    <div>
                      <LdsCardTitle>Immowelt</LdsCardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Portal-Integration geplant
                      </p>
                    </div>
                  </div>
                  <LdsBadge variant="default">Coming Soon</LdsBadge>
                </div>
              </LdsCardHeader>
              <LdsCardContent>
                <div className="text-center py-8 text-gray-500">
                  <p>Integration wird entwickelt</p>
                </div>
              </LdsCardContent>
            </LdsCard>

            {/* eBay Kleinanzeigen */}
            <LdsCard className="opacity-50">
              <LdsCardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">📦</div>
                    <div>
                      <LdsCardTitle>eBay Kleinanzeigen</LdsCardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Zusätzliche Reichweite
                      </p>
                    </div>
                  </div>
                  <LdsBadge variant="default">Coming Soon</LdsBadge>
                </div>
              </LdsCardHeader>
              <LdsCardContent>
                <div className="text-center py-8 text-gray-500">
                  <p>Integration wird entwickelt</p>
                </div>
              </LdsCardContent>
            </LdsCard>
          </div>

          {/* Portal Statistics */}
          <LdsCard>
            <LdsCardHeader>
              <LdsCardTitle>📊 Portal-Statistiken</LdsCardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Übersicht der Performance auf verschiedenen Portalen
              </p>
            </LdsCardHeader>
            <LdsCardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">1</div>
                  <div className="text-sm text-gray-600">Aktive Portale</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">24</div>
                  <div className="text-sm text-gray-600">Aufrufe (7 Tage)</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">3</div>
                  <div className="text-sm text-gray-600">Interessenten</div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <div className="text-xs text-gray-500">
                  💡 <strong>Tipp:</strong> Veröffentlichen Sie auf mehreren Portalen, um die maximale Reichweite zu erzielen.
                </div>
              </div>
            </LdsCardContent>
          </LdsCard>
        </div>
      )}
    </div>
  );
}
