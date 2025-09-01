'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { LdsCard, LdsCardHeader, LdsCardTitle, LdsCardContent } from '@liveyourdreams/design-system-react';

interface RoomMedia {
  id: string;
  cdnUrl: string;
  alt?: string | null;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
  variants?: any;
}

interface Room {
  id: string;
  name: string;
  type: string;
  area?: number | null;
  description?: string | null;
  images: RoomMedia[];
}

interface RoomShowcaseProps {
  rooms: Room[];
}

export function RoomShowcase({ rooms }: RoomShowcaseProps) {
  const [selectedRoom, setSelectedRoom] = useState(rooms[0]?.id);

  const getRoomTypeLabel = (type: string) => {
    const labels = {
      WOHNZIMMER: '🛋️ Wohnzimmer',
      SCHLAFZIMMER: '🛏️ Schlafzimmer', 
      KUECHE: '👩‍🍳 Küche',
      BADEZIMMER: '🛀 Badezimmer',
      GAESTE_WC: '🚽 Gäste-WC',
      FLUR: '🚪 Flur',
      BALKON: '🌸 Balkon',
      TERRASSE: '🪴 Terrasse',
      GARTEN: '🌳 Garten',
      KELLER: '⬇️ Keller',
      DACHBODEN: '⬆️ Dachboden',
      GARAGE: '🚗 Garage',
      SONSTIGES: '📦 Sonstiges'
    };
    return labels[type as keyof typeof labels] || `🏠 ${type}`;
  };

  const selectedRoomData = rooms.find(r => r.id === selectedRoom);

  if (rooms.length === 0) return null;

  return (
    <LdsCard>
      <LdsCardHeader>
        <LdsCardTitle>🏠 Raumaufteilung</LdsCardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Entdecken Sie jeden Raum dieser Immobilie im Detail
        </p>
      </LdsCardHeader>
      <LdsCardContent>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Room List */}
          <div className="lg:col-span-1 space-y-2">
            {rooms.map(room => (
              <button
                key={room.id}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedRoom === room.id
                    ? 'bg-blue-50 border-2 border-blue-200'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }`}
                onClick={() => setSelectedRoom(room.id)}
              >
                <div className="font-medium">
                  {getRoomTypeLabel(room.type)}
                </div>
                <div className="text-sm text-gray-600">
                  {room.name}
                </div>
                {room.area && (
                  <div className="text-xs text-gray-500">
                    {room.area}m²
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Room Content */}
          <div className="lg:col-span-3">
            {selectedRoomData && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedRoomData.name}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <span>{getRoomTypeLabel(selectedRoomData.type)}</span>
                    {selectedRoomData.area && (
                      <span>📐 {selectedRoomData.area}m²</span>
                    )}
                  </div>
                </div>

                {selectedRoomData.description && (
                  <p className="text-gray-700">
                    {selectedRoomData.description}
                  </p>
                )}

                {/* Room Images */}
                {selectedRoomData.images.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedRoomData.images.slice(0, 4).map(image => (
                      <div key={image.id} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={image.cdnUrl}
                          alt={image.alt || selectedRoomData.name}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </LdsCardContent>
    </LdsCard>
  );
}
