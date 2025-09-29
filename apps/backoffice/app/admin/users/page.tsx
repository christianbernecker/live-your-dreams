/**
 * User Management Page - Clean Design System Implementation
 * 
 * Provides comprehensive user management with AUTHENTIC Design System Table
 * Based on: https://designsystem.liveyourdreams.online/components/table
 */

'use client';

import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { InputLikeSelect } from '@/components/ui/InputLikeSelect';
import { useCallback, useEffect, useState } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  image?: string;
  isActive: boolean;
  emailVerified: boolean;
  roles: Array<{
    id: string;
    name: string;
    displayName: string;
  }>;
}

interface Role {
  id: string;
  name: string;
  displayName: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function UserManagementPage() {
  // State Management
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      
      // Demo Users für sofortige Anzeige
      const demoUsers: User[] = [
        {
          id: '1',
          name: 'System Administrator',
          email: 'admin@liveyourdreams.online',
          isActive: true,
          emailVerified: true,
          roles: [{ id: '1', name: 'admin', displayName: 'Administrator' }]
        },
        {
          id: '2',
          name: 'Content Editor',
          email: 'editor@liveyourdreams.online',
          isActive: true,
          emailVerified: true,
          roles: [{ id: '2', name: 'editor', displayName: 'Editor' }]
        },
        {
          id: '3',
          name: 'Content Author',
          email: 'author@liveyourdreams.online',
          isActive: true,
          emailVerified: false,
          roles: [{ id: '3', name: 'author', displayName: 'Autor' }]
        },
        {
          id: '4',
          name: 'Content Viewer',
          email: 'viewer@liveyourdreams.online',
          isActive: false,
          emailVerified: false,
          roles: [{ id: '4', name: 'viewer', displayName: 'Betrachter' }]
        }
      ];
      
      setUsers(demoUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  }, []);

  const fetchRoles = useCallback(async () => {
    const demoRoles: Role[] = [
      { id: '1', name: 'admin', displayName: 'Administrator' },
      { id: '2', name: 'editor', displayName: 'Editor' },
      { id: '3', name: 'author', displayName: 'Autor' },
      { id: '4', name: 'viewer', displayName: 'Betrachter' }
    ];
    setRoles(demoRoles);
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [fetchUsers, fetchRoles]);

  // ============================================================================
  // FILTERING
  // ============================================================================

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !roleFilter || 
      user.roles.some(role => role.name === roleFilter);
    
    const matchesStatus = !statusFilter || 
      (statusFilter === 'true' && user.emailVerified) ||
      (statusFilter === 'false' && !user.emailVerified);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const paginatedUsers = filteredUsers.slice(0, 20); // Erste 20 für Demo

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleEditUser = (user: User) => {
    console.log('Edit user:', user);
  };

  const handleDeleteUser = (userId: string) => {
    console.log('Delete user:', userId);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="lyd-stack lg">
      {/* Page Header */}
      <div className="lyd-card">
        <div className="lyd-card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>Benutzer-Verwaltung</h1>
              <p style={{ color: 'var(--lyd-text-secondary, #6b7280)', margin: '4px 0 0 0' }}>
                Benutzer, Rollen und Berechtigungen verwalten
              </p>
            </div>
            <Button variant="primary" icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14m-7-7h14"/>
              </svg>
            }>
              Neuer Benutzer
            </Button>
          </div>
        </div>
      </div>

      {/* Filters - Design System Compliant */}
      <div className="lyd-card">
        <div className="lyd-card-body">
          {/* Filter Description */}
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '500', margin: '0 0 4px 0', color: 'var(--lyd-text, #374151)' }}>
              Suchen und Filtern
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--lyd-text-secondary, #6b7280)', margin: 0 }}>
              Durchsuchen Sie Benutzer nach Namen oder E-Mail und filtern Sie nach Rollen und Status.
            </p>
          </div>
          {/* Filter Layout: CSS-First Approach - Utility Klassen aus master.css */}
          <div className="d-flex gap-md items-center" style={{ flexWrap: 'wrap' }}>
            
            {/* Search Input mit Icon - Design System Component */}
            <div style={{ position: 'relative', flex: '2 1 250px', minWidth: '200px' }}>
              <Input
                type="text"
                placeholder="Benutzer suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingRight: '36px' }}
              />
              <div style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--lyd-text-secondary, #6b7280)',
                pointerEvents: 'none'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
            </div>
            
            {/* Role Filter */}
            <div style={{ flex: '1 1 180px', minWidth: '150px' }}>
              <InputLikeSelect
                placeholder="Alle Rollen"
                value={roleFilter}
                onChange={(value) => setRoleFilter(value)}
                options={[
                  { value: '', label: 'Alle Rollen' },
                  ...roles.map(role => ({
                    value: role.name,
                    label: role.displayName
                  }))
                ]}
              />
            </div>
            
            {/* Status Filter */}
            <div style={{ flex: '1 1 180px', minWidth: '150px' }}>
              <InputLikeSelect
                placeholder="Alle Status"
                value={statusFilter}
                onChange={(value) => setStatusFilter(value)}
                options={[
                  { value: '', label: 'Alle Status' },
                  { value: 'true', label: 'Aktiv' },
                  { value: 'false', label: 'Inaktiv' }
                ]}
              />
            </div>
            
            {/* Reset Button - Design System Component */}
            <button 
              type="button"
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('');
                setStatusFilter('');
              }}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid var(--lyd-primary, #3b82f6)',
                color: 'var(--lyd-primary, #3b82f6)',
                borderRadius: '6px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--lyd-primary-50, #eff6ff)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18"/>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                <path d="M8 6V4c0-1 1-2 2-2h4c0 1 1 2 1 2v2"/>
              </svg>
              Zurücksetzen
            </button>
            
          </div>
        </div>
      </div>

      {/* Users Table - AUTHENTIC DESIGN SYSTEM TABLE */}
      <div className="lyd-table-container">
        <table className="api-table striped">
          <thead>
            <tr>
              <th>Benutzer</th>
              <th>Rollen</th>
              <th>Status</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{ color: 'var(--lyd-text-secondary, #6b7280)' }}>
                    Lade Benutzer...
                  </div>
                </td>
              </tr>
            ) : paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{ color: 'var(--lyd-text-secondary, #6b7280)' }}>
                    Keine Benutzer gefunden
                  </div>
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Avatar
                        size="sm"
                        fallback={user.name?.charAt(0) || user.email.charAt(0)}
                        status={user.emailVerified ? 'online' : 'offline'}
                      />
                      <div>
                        <div style={{ fontWeight: '500', color: 'var(--lyd-text, #374151)' }}>
                          {user.name || 'Unbekannt'}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--lyd-text-secondary, #6b7280)' }}>
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {user.roles && user.roles.length > 0 ? (
                        user.roles.map((role) => (
                          <span key={role.id} className={`luxury-badge ${
                            role.name === 'admin' ? 'error' :
                            role.name === 'editor' ? 'info' :
                            role.name === 'author' ? 'warning' :
                            'success'
                          }`}>
                            {role.displayName}
                          </span>
                        ))
                      ) : (
                        <span className="luxury-badge">Keine Rolle</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`lyd-badge ${user.emailVerified ? 'success' : 'secondary'}`}>
                      {user.emailVerified ? 'AKTIV' : 'INAKTIV'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-start' }}>
                      <button
                        type="button"
                        onClick={() => handleEditUser(user)}
                        title="Bearbeiten"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          color: 'var(--lyd-text-secondary, #6b7280)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Löschen"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          color: 'var(--lyd-error, #ef4444)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3,6 5,6 21,6"/>
                          <path d="m19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
