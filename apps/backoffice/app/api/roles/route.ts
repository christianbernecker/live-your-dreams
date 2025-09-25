import { auth } from '@/lib/nextauth'
import { NextRequest, NextResponse } from 'next/server'

// Mock data for roles - in production this would come from database
const mockRoles = [
  {
    id: 'role-1',
    name: 'admin',
    displayName: 'Administrator',
    description: 'Vollzugriff auf alle Funktionen',
    color: '#dc2626',
    createdAt: new Date().toISOString(),
    userCount: 1,
    permissions: [
      { id: '1', name: 'users.create', displayName: 'Benutzer erstellen', description: 'Neue Benutzer anlegen', category: 'Benutzerverwaltung' },
      { id: '2', name: 'users.read', displayName: 'Benutzer anzeigen', description: 'Benutzer einsehen', category: 'Benutzerverwaltung' },
      { id: '3', name: 'users.update', displayName: 'Benutzer bearbeiten', description: 'Benutzer-Daten ändern', category: 'Benutzerverwaltung' },
      { id: '4', name: 'users.delete', displayName: 'Benutzer löschen', description: 'Benutzer entfernen', category: 'Benutzerverwaltung' },
      { id: '5', name: 'posts.create', displayName: 'Inhalte erstellen', description: 'Neue Artikel/Posts erstellen', category: 'Inhaltsverwaltung' },
      { id: '6', name: 'posts.read', displayName: 'Inhalte anzeigen', description: 'Artikel/Posts lesen', category: 'Inhaltsverwaltung' },
      { id: '7', name: 'posts.update', displayName: 'Inhalte bearbeiten', description: 'Artikel/Posts ändern', category: 'Inhaltsverwaltung' },
      { id: '8', name: 'posts.delete', displayName: 'Inhalte löschen', description: 'Artikel/Posts entfernen', category: 'Inhaltsverwaltung' },
      { id: '9', name: 'posts.publish', displayName: 'Inhalte veröffentlichen', description: 'Artikel/Posts publizieren', category: 'Inhaltsverwaltung' },
      { id: '10', name: 'media.upload', displayName: 'Medien hochladen', description: 'Bilder/Dateien hochladen', category: 'Medienverwaltung' },
      { id: '11', name: 'media.read', displayName: 'Medien anzeigen', description: 'Medien-Bibliothek einsehen', category: 'Medienverwaltung' },
      { id: '12', name: 'media.update', displayName: 'Medien bearbeiten', description: 'Medien-Metadaten ändern', category: 'Medienverwaltung' },
      { id: '13', name: 'media.delete', displayName: 'Medien löschen', description: 'Medien entfernen', category: 'Medienverwaltung' },
      { id: '14', name: 'settings.read', displayName: 'Einstellungen anzeigen', description: 'System-Einstellungen einsehen', category: 'System' },
      { id: '15', name: 'settings.update', displayName: 'Einstellungen ändern', description: 'System-Einstellungen bearbeiten', category: 'System' },
      { id: '16', name: 'roles.manage', displayName: 'Rollen verwalten', description: 'Rollen und Berechtigungen verwalten', category: 'System' }
    ]
  },
  {
    id: 'role-2',
    name: 'editor',
    displayName: 'Editor',
    description: 'Kann Inhalte erstellen und bearbeiten',
    color: '#2563eb',
    createdAt: new Date().toISOString(),
    userCount: 0,
    permissions: [
      { id: '2', name: 'users.read', displayName: 'Benutzer anzeigen', description: 'Benutzer einsehen', category: 'Benutzerverwaltung' },
      { id: '5', name: 'posts.create', displayName: 'Inhalte erstellen', description: 'Neue Artikel/Posts erstellen', category: 'Inhaltsverwaltung' },
      { id: '6', name: 'posts.read', displayName: 'Inhalte anzeigen', description: 'Artikel/Posts lesen', category: 'Inhaltsverwaltung' },
      { id: '7', name: 'posts.update', displayName: 'Inhalte bearbeiten', description: 'Artikel/Posts ändern', category: 'Inhaltsverwaltung' },
      { id: '8', name: 'posts.delete', displayName: 'Inhalte löschen', description: 'Artikel/Posts entfernen', category: 'Inhaltsverwaltung' },
      { id: '9', name: 'posts.publish', displayName: 'Inhalte veröffentlichen', description: 'Artikel/Posts publizieren', category: 'Inhaltsverwaltung' },
      { id: '10', name: 'media.upload', displayName: 'Medien hochladen', description: 'Bilder/Dateien hochladen', category: 'Medienverwaltung' },
      { id: '11', name: 'media.read', displayName: 'Medien anzeigen', description: 'Medien-Bibliothek einsehen', category: 'Medienverwaltung' },
      { id: '12', name: 'media.update', displayName: 'Medien bearbeiten', description: 'Medien-Metadaten ändern', category: 'Medienverwaltung' },
      { id: '13', name: 'media.delete', displayName: 'Medien löschen', description: 'Medien entfernen', category: 'Medienverwaltung' },
      { id: '14', name: 'settings.read', displayName: 'Einstellungen anzeigen', description: 'System-Einstellungen einsehen', category: 'System' }
    ]
  },
  {
    id: 'role-3',
    name: 'viewer',
    displayName: 'Betrachter',
    description: 'Nur Lesezugriff',
    color: '#16a34a',
    createdAt: new Date().toISOString(),
    userCount: 0,
    permissions: [
      { id: '2', name: 'users.read', displayName: 'Benutzer anzeigen', description: 'Benutzer einsehen', category: 'Benutzerverwaltung' },
      { id: '6', name: 'posts.read', displayName: 'Inhalte anzeigen', description: 'Artikel/Posts lesen', category: 'Inhaltsverwaltung' },
      { id: '11', name: 'media.read', displayName: 'Medien anzeigen', description: 'Medien-Bibliothek einsehen', category: 'Medienverwaltung' },
      { id: '14', name: 'settings.read', displayName: 'Einstellungen anzeigen', description: 'System-Einstellungen einsehen', category: 'System' }
    ]
  }
]

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!session.user.permissions.includes('roles.manage')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // In production, this would fetch from database
    return NextResponse.json(mockRoles)
  } catch (error) {
    console.error('Error fetching roles:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!session.user.permissions.includes('roles.manage')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { name, displayName, description, color, permissions } = body

    if (!name || !displayName || !description || !color || !permissions) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // In production, this would create in database
    const newRole = {
      id: `role-${Date.now()}`,
      name,
      displayName,
      description,
      color,
      permissions,
      createdAt: new Date().toISOString(),
      userCount: 0
    }

    return NextResponse.json(newRole, { status: 201 })
  } catch (error) {
    console.error('Error creating role:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
