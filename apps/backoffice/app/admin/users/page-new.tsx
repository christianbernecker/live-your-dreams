/**
 * User Management Page - Clean Design System Implementation
 * 
 * Provides comprehensive user management with AUTHENTIC Design System Table
 * Based on: https://designsystem.liveyourdreams.online/components/table
 */

'use client';

import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
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
  const [currentPage, setCurrentPage] = useState(1);
  
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
            <Button variant="primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
              Neuer Benutzer
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="lyd-card">
        <div className="lyd-card-body">
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr auto',
              gap: 'var(--spacing-md, 16px)',
              alignItems: 'center',
              width: '100%'
            }}
          >
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Benutzer suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 32px 0 12px',
                  fontSize: '14px',
                  fontFamily: 'var(--font-family-primary, system-ui)',
                  border: '1px solid var(--lyd-border, #d1d5db)',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  color: 'var(--lyd-text, #374151)',
                  outline: 'none',
                  transition: 'all 0.15s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--lyd-primary, #3b82f6)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--lyd-border, #d1d5db)'}
              />
              <div style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--lyd-text-secondary, #6b7280)',
                pointerEvents: 'none'
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
            </div>
            
            {/* Role Filter */}
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
            
            {/* Status Filter */}
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
            
            {/* Reset Button */}
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('');
                setStatusFilter('');
              }}
              style={{
                height: '40px',
                padding: '0 16px',
                fontSize: '14px',
                fontFamily: 'var(--font-family-primary, system-ui)',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: 'transparent',
                color: 'var(--lyd-text-primary, #374151)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'var(--lyd-gray-50, #f9fafb)'}
              onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'transparent'}
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
        <table className="lyd-table">
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
                          <span key={role.id} className="table-badge">
                            {role.displayName}
                          </span>
                        ))
                      ) : (
                        <span className="table-badge">Keine Rolle</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`table-badge ${user.emailVerified ? 'success' : 'warning'}`}>
                      {user.emailVerified ? 'Aktiv' : 'Inaktiv'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="table-action"
                        onClick={() => handleEditUser(user)}
                        title="Benutzer bearbeiten"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="table-action"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Benutzer löschen"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

