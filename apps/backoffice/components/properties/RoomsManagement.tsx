'use client';

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

/**
 * Room Interface (matches Prisma schema)
 */
interface Room {
  id: string;
  name: string;
  type: 'WOHNZIMMER' | 'SCHLAFZIMMER' | 'KUECHE' | 'BADEZIMMER' | 'GAESTE_WC' | 
        'FLUR' | 'BALKON' | 'TERRASSE' | 'GARTEN' | 'KELLER' | 'DACHBODEN' | 
        'GARAGE' | 'SONSTIGES';
  area?: number;
  description?: string;
  mediaCount: number;
  order?: number;
}

/**
 * RoomsManagement Props
 */
interface RoomsManagementProps {
  /**
   * Property ID
   */
  propertyId: string;
  
  /**
   * Existing rooms
   */
  rooms: Room[];
  
  /**
   * Callback für Room-Updates
   */
  onUpdateRooms: (rooms: Room[]) => Promise<void>;
  
  /**
   * Callback für neue Räume
   */
  onCreateRoom: (room: Omit<Room, 'id' | 'mediaCount'>) => Promise<Room>;
  
  /**
   * Callback für Room-Löschung
   */
  onDeleteRoom: (roomId: string) => Promise<void>;
}

/**
 * Room Types Labels
 */
const ROOM_TYPE_LABELS = {
  WOHNZIMMER: '🛋️ Wohnzimmer',
  SCHLAFZIMMER: '🛏️ Schlafzimmer',
  KUECHE: '👩‍🍳 Küche',
  BADEZIMMER: '🛀 Badezimmer',
  GAESTE_WC: '🚽 Gäste-WC',
  FLUR: '🚪 Flur/Diele',
  BALKON: '🌸 Balkon',
  TERRASSE: '🪴 Terrasse',
  GARTEN: '🌳 Garten',
  KELLER: '⬇️ Keller',
  DACHBODEN: '⬆️ Dachboden',
  GARAGE: '🚗 Garage',
  SONSTIGES: '📦 Sonstiges'
} as const;

/**
 * Sortable Room Item
 */
interface SortableRoomItemProps {
  room: Room;
  onEdit: (room: Room) => void;
  onDelete: (roomId: string) => void;
}

function SortableRoomItem({ room, onEdit, onDelete }: SortableRoomItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: room.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatArea = (area?: number) => {
    if (!area) return '';
    return `${area}m²`;
  };

  const getRoomIcon = (type: Room['type']) => {
    return ROOM_TYPE_LABELS[type].split(' ')[0];
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        bg-white border rounded-lg p-4 shadow-sm transition-all
        ${isDragging ? 'shadow-lg z-50' : 'hover:shadow-md'}
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-2 text-gray-400 hover:text-gray-600"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
            </svg>
          </div>

          {/* Room Info */}
          <div className="flex items-center space-x-3 flex-1">
            <div className="text-2xl">
              {getRoomIcon(room.type)}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-gray-900">{room.name}</h3>
                <LdsBadge variant="secondary">
                  {ROOM_TYPE_LABELS[room.type].split(' ').slice(1).join(' ')}
                </LdsBadge>
              </div>
              
              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                {room.area && (
                  <span>📐 {formatArea(room.area)}</span>
                )}
                <span>📸 {room.mediaCount} Bilder</span>
              </div>
              
              {room.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {room.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <LdsButton
            size="sm"
            variant="outline"
            onClick={() => onEdit(room)}
          >
            ✏️ Bearbeiten
          </LdsButton>
          
          <LdsButton
            size="sm"
            variant="outline"
            onClick={() => onDelete(room.id)}
            className="text-red-600 hover:text-red-700"
          >
            🗑️
          </LdsButton>
        </div>
      </div>
    </div>
  );
}

/**
 * Room Form Modal/Component
 */
interface RoomFormProps {
  room?: Room;
  onSave: (roomData: Omit<Room, 'id' | 'mediaCount'>) => void;
  onCancel: () => void;
}

function RoomForm({ room, onSave, onCancel }: RoomFormProps) {
  const [formData, setFormData] = useState({
    name: room?.name || '',
    type: room?.type || 'WOHNZIMMER' as Room['type'],
    area: room?.area || 0,
    description: room?.description || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      type: formData.type,
      area: formData.area || undefined,
      description: formData.description || undefined,
      order: room?.order || 0
    });
  };

  return (
    <LdsCard>
      <LdsCardHeader>
        <LdsCardTitle>
          {room ? 'Raum bearbeiten' : 'Neuer Raum'}
        </LdsCardTitle>
      </LdsCardHeader>
      <LdsCardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LdsInput
              label="Raumname"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="z.B. Hauptschlafzimmer"
              required
            />
            
            <LdsSelect
              label="Raumtyp"
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Room['type'] }))}
              options={Object.entries(ROOM_TYPE_LABELS).map(([value, label]) => ({
                value,
                label
              }))}
              required
            />
          </div>
          
          <LdsInput
            type="number"
            label="Fläche (m²)"
            value={formData.area || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, area: parseFloat(e.target.value) || 0 }))}
            placeholder="z.B. 25.5"
            step="0.1"
            min="0"
          />
          
          <LdsInput
            label="Beschreibung"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Optional: Zusätzliche Details zum Raum"
            multiline
            rows={3}
          />
          
          <div className="flex justify-end space-x-3">
            <LdsButton
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Abbrechen
            </LdsButton>
            <LdsButton
              type="submit"
              variant="primary"
            >
              {room ? 'Aktualisieren' : 'Hinzufügen'}
            </LdsButton>
          </div>
        </form>
      </LdsCardContent>
    </LdsCard>
  );
}

/**
 * RoomsManagement Component
 * 
 * Drag & Drop Räume-Verwaltung mit:
 * - Sortierbare Liste
 * - CRUD Operationen
 * - Visueller Editor
 * - Media-Integration
 */
export function RoomsManagement({
  propertyId,
  rooms: initialRooms,
  onUpdateRooms,
  onCreateRoom,
  onDeleteRoom
}: RoomsManagementProps) {
  const [rooms, setRooms] = useState(initialRooms);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [showNewRoomForm, setShowNewRoomForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /**
   * Drag End Handler
   */
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = rooms.findIndex(room => room.id === active.id);
      const newIndex = rooms.findIndex(room => room.id === over?.id);
      
      const newRooms = arrayMove(rooms, oldIndex, newIndex);
      
      // Update order property
      const updatedRooms = newRooms.map((room, index) => ({
        ...room,
        order: index
      }));
      
      setRooms(updatedRooms);
      
      try {
        await onUpdateRooms(updatedRooms);
      } catch (error) {
        console.error('Error updating room order:', error);
        // Revert on error
        setRooms(rooms);
      }
    }
  };

  /**
   * Create Room
   */
  const handleCreateRoom = async (roomData: Omit<Room, 'id' | 'mediaCount'>) => {
    setIsLoading(true);
    try {
      const newRoom = await onCreateRoom({
        ...roomData,
        order: rooms.length
      });
      
      setRooms(prev => [...prev, newRoom]);
      setShowNewRoomForm(false);
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Fehler beim Erstellen des Raums');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update Room
   */
  const handleUpdateRoom = async (roomData: Omit<Room, 'id' | 'mediaCount'>) => {
    if (!editingRoom) return;
    
    setIsLoading(true);
    try {
      const updatedRoom = { ...editingRoom, ...roomData };
      const updatedRooms = rooms.map(room => 
        room.id === editingRoom.id ? updatedRoom : room
      );
      
      setRooms(updatedRooms);
      await onUpdateRooms(updatedRooms);
      setEditingRoom(null);
    } catch (error) {
      console.error('Error updating room:', error);
      alert('Fehler beim Aktualisieren des Raums');
      // Revert
      setRooms(rooms);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete Room
   */
  const handleDeleteRoom = async (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;
    
    if (!confirm(`Raum "${room.name}" wirklich löschen? Alle Medien werden ebenfalls entfernt.`)) {
      return;
    }
    
    setIsLoading(true);
    try {
      await onDeleteRoom(roomId);
      setRooms(prev => prev.filter(r => r.id !== roomId));
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('Fehler beim Löschen des Raums');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Statistics
   */
  const totalArea = rooms.reduce((sum, room) => sum + (room.area || 0), 0);
  const totalMedia = rooms.reduce((sum, room) => sum + room.mediaCount, 0);

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Räume-Verwaltung</h2>
          <div className="flex items-center space-x-6 mt-2 text-sm text-gray-600">
            <span>📐 {totalArea}m² Gesamtfläche</span>
            <span>🏠 {rooms.length} Räume</span>
            <span>📸 {totalMedia} Medien</span>
          </div>
        </div>
        
        <LdsButton
          variant="primary"
          onClick={() => setShowNewRoomForm(true)}
          disabled={isLoading}
        >
          ➕ Raum hinzufügen
        </LdsButton>
      </div>

      {/* New Room Form */}
      {showNewRoomForm && (
        <RoomForm
          onSave={handleCreateRoom}
          onCancel={() => setShowNewRoomForm(false)}
        />
      )}

      {/* Edit Room Form */}
      {editingRoom && (
        <RoomForm
          room={editingRoom}
          onSave={handleUpdateRoom}
          onCancel={() => setEditingRoom(null)}
        />
      )}

      {/* Rooms List */}
      {rooms.length > 0 ? (
        <LdsCard>
          <LdsCardHeader>
            <LdsCardTitle>Räume (Drag & Drop zum Sortieren)</LdsCardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Ziehen Sie die Räume, um die Anzeigereihenfolge zu ändern.
            </p>
          </LdsCardHeader>
          <LdsCardContent>
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={rooms} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {rooms.map(room => (
                    <SortableRoomItem
                      key={room.id}
                      room={room}
                      onEdit={setEditingRoom}
                      onDelete={handleDeleteRoom}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </LdsCardContent>
        </LdsCard>
      ) : (
        <LdsCard>
          <LdsCardContent>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Noch keine Räume definiert
              </h3>
              <p className="text-gray-600 mb-4">
                Beginnen Sie mit der Erfassung der einzelnen Räume Ihrer Immobilie.
              </p>
              <LdsButton
                variant="primary"
                onClick={() => setShowNewRoomForm(true)}
              >
                Ersten Raum hinzufügen
              </LdsButton>
            </div>
          </LdsCardContent>
        </LdsCard>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
            <p>Räume werden aktualisiert...</p>
          </div>
        </div>
      )}
    </div>
  );
}
