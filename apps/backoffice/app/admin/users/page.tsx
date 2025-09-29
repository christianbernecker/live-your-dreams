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
import { useCallback, useEffect, useState } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: SelectOption[];
}

// ============================================================================
// CUSTOM DROPDOWN COMPONENT
// ============================================================================

const CustomSelect: React.FC<CustomSelectProps> = ({ value, onChange, placeholder, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedOption = options.find(option => option.value === value);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isOpen && !target.closest('.lyd-custom-select-container')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);
  
  return (
    <div className="lyd-custom-select-container" style={{ position: 'relative', width: '100%' }}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="lyd-custom-select-trigger"
        style={{
          width: '100%',
          height: '40px',
          padding: '8px 32px 8px 12px',
          border: '1px solid var(--lyd-border, #d1d5db)',
          borderRadius: '6px',
          fontSize: '14px',
          backgroundColor: 'white',
          textAlign: 'left',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          outline: 'none'
        }}
      >
        <span style={{ 
          color: value ? 'var(--lyd-text, #374151)' : 'var(--lyd-text-secondary, #6b7280)' 
        }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 20 20" 
          fill="none" 
          style={{ 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }}
        >
          <path 
            stroke="var(--lyd-text-secondary, #6b7280)" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="1.5" 
            d="m6 8 4 4 4-4"
          />
        </svg>
      </button>
      
      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="lyd-custom-select-dropdown"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid var(--lyd-border, #d1d5db)',
            borderRadius: '6px',
            marginTop: '4px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            zIndex: 50,
            maxHeight: '200px',
            overflowY: 'auto'
          }}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="lyd-custom-select-option"
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '14px',
                textAlign: 'left',
                border: 'none',
                backgroundColor: value === option.value ? 'var(--lyd-primary-50, #eff6ff)' : 'white',
                color: value === option.value ? 'var(--lyd-primary, #3b82f6)' : 'var(--lyd-text, #374151)',
                cursor: 'pointer',
                display: 'block',
                outline: 'none'
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

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
  
  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
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

  const handleCreateUser = () => {
    setSelectedUser(null);
    setShowCreateModal(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      // Try API first
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // API success - refresh users list
        await fetchUsers();
        
        // Close modal
        setShowDeleteModal(false);
        setSelectedUser(null);
        
        console.log('User deleted successfully via API');
        return;
      }
      
      // API failed - DEMO MODE: Update local state
      console.log('API not available, using demo mode for delete');
      setUsers(prevUsers => prevUsers.filter(u => u.id !== selectedUser.id));
      
      // Close modal
      setShowDeleteModal(false);
      setSelectedUser(null);
      
      alert('Benutzer erfolgreich gelöscht (Demo-Modus)');
    } catch (error) {
      console.error('Error deleting user:', error);
      
      // FALLBACK: Demo-mode delete
      console.log('Fallback to demo mode delete');
      setUsers(prevUsers => prevUsers.filter(u => u.id !== selectedUser.id));
      
      // Close modal
      setShowDeleteModal(false);
      setSelectedUser(null);
      
      alert('Benutzer erfolgreich gelöscht (Demo-Modus)');
    }
  };

  const handleSubmitUser = async (userData: Partial<User>) => {
    try {
      const url = selectedUser ? `/api/users/${selectedUser.id}` : '/api/users';
      const method = selectedUser ? 'PATCH' : 'POST';
      
      // Try API first
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (response.ok) {
        // API success - refresh users list
        await fetchUsers();
        
        // Close modals
        setShowCreateModal(false);
        setShowEditModal(false);
        setSelectedUser(null);
        
        console.log(`User ${selectedUser ? 'updated' : 'created'} successfully via API`);
        return;
      }
      
      // API failed - DEMO MODE: Update local state
      console.log('API not available, using demo mode');
      
      if (selectedUser) {
        // UPDATE: Update existing user in local state
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === selectedUser.id 
              ? { ...user, ...userData, emailVerified: userData.isActive ?? user.emailVerified }
              : user
          )
        );
        alert('Benutzer erfolgreich bearbeitet (Demo-Modus)');
      } else {
        // CREATE: Add new user to local state
        const newUser: User = {
          id: String(Date.now()), // Simple ID generation for demo
          name: userData.name || '',
          email: userData.email || '',
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          isActive: userData.isActive ?? true,
          emailVerified: userData.isActive ?? true,
          roles: userData.roleIds ? 
            userData.roleIds.map(roleId => 
              roles.find(r => r.id === roleId) || { id: roleId, name: 'unknown', displayName: 'Unknown' }
            ) : 
            [{ id: '4', name: 'viewer', displayName: 'Betrachter' }]
        };
        
        setUsers(prevUsers => [newUser, ...prevUsers]);
        alert('Benutzer erfolgreich erstellt (Demo-Modus)');
      }
      
      // Close modals
      setShowCreateModal(false);
      setShowEditModal(false);
      setSelectedUser(null);
      
    } catch (error) {
      console.error(`Error ${selectedUser ? 'updating' : 'creating'} user:`, error);
      
      // FALLBACK: Demo-mode operation
      console.log(`Fallback to demo mode ${selectedUser ? 'update' : 'create'}`);
      
      if (selectedUser) {
        // UPDATE: Update existing user in local state
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === selectedUser.id 
              ? { ...user, ...userData, emailVerified: userData.isActive ?? user.emailVerified }
              : user
          )
        );
        alert('Benutzer erfolgreich bearbeitet (Demo-Modus)');
      } else {
        // CREATE: Add new user to local state
        const newUser: User = {
          id: String(Date.now()), // Simple ID generation for demo
          name: userData.name || '',
          email: userData.email || '',
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          isActive: userData.isActive ?? true,
          emailVerified: userData.isActive ?? true,
          roles: userData.roleIds ? 
            userData.roleIds.map(roleId => 
              roles.find(r => r.id === roleId) || { id: roleId, name: 'unknown', displayName: 'Unknown' }
            ) : 
            [{ id: '4', name: 'viewer', displayName: 'Betrachter' }]
        };
        
        setUsers(prevUsers => [newUser, ...prevUsers]);
        alert('Benutzer erfolgreich erstellt (Demo-Modus)');
      }
      
      // Close modals
      setShowCreateModal(false);
      setShowEditModal(false);
      setSelectedUser(null);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
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
            <Button 
              variant="primary" 
              onClick={handleCreateUser}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14m-7-7h14"/>
                </svg>
              }
            >
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
          {/* ROBUST FILTER LAYOUT - CSS GRID für garantierte Positionierung */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr auto',
            gap: '16px',
            alignItems: 'start',
            width: '100%',
            marginBottom: '0'
          }}>
            
            {/* Search Input - NATIVE HTML für garantierte Kontrolle */}
            <div style={{ 
              position: 'relative',
              minWidth: '0' // Grid overflow fix
            }}>
              <input
                type="text"
                placeholder="Benutzer suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="lyd-input-search-with-icon"
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '8px 40px 8px 12px',
                  border: '1px solid var(--lyd-border, #d1d5db)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  outline: 'none'
                }}
              />
              {/* Icon RECHTS - Absolute Position */}
              <div style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--lyd-text-secondary, #6b7280)',
                pointerEvents: 'none',
                zIndex: 10
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
            </div>
            
            {/* Role Filter - Custom Dropdown für Design System Styling */}
            <div style={{ minWidth: '0', position: 'relative' }}>
              <CustomSelect
                value={roleFilter}
                onChange={setRoleFilter}
                placeholder="Alle Rollen"
                options={[
                  { value: '', label: 'Alle Rollen' },
                  ...roles.map(role => ({
                    value: role.name,
                    label: role.displayName
                  }))
                ]}
              />
            </div>
            
            {/* Status Filter - Custom Dropdown für Design System Styling */}
            <div style={{ minWidth: '0', position: 'relative' }}>
              <CustomSelect
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="Alle Status"
                options={[
                  { value: '', label: 'Alle Status' },
                  { value: 'true', label: 'Aktiv' },
                  { value: 'false', label: 'Inaktiv' }
                ]}
              />
            </div>
            
            {/* Reset Button - TOP aligned mit Input-Höhe */}
            <button 
              type="button"
              className="lyd-button-reset-custom"
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
                height: '40px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                minWidth: '120px',
                marginTop: '0px',
                alignSelf: 'start'
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
          
          {/* CSS Styles für Custom Components */}
          <style jsx>{`
            .lyd-input-search-with-icon:focus {
              border-color: var(--lyd-primary, #3b82f6) !important;
              box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1) !important;
            }
            .lyd-button-reset-custom:hover {
              background-color: var(--lyd-primary-50, #eff6ff) !important;
            }
            .lyd-custom-select-trigger:focus {
              border-color: var(--lyd-primary, #3b82f6) !important;
              box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1) !important;
            }
            .lyd-custom-select-trigger:hover {
              border-color: var(--lyd-border-hover, #9ca3af) !important;
            }
            .lyd-custom-select-option:hover {
              background-color: var(--lyd-gray-50, #f9fafb) !important;
            }
            @media (max-width: 768px) {
            div[style*="gridTemplateColumns"] {
              display: flex !important;
              flex-direction: column !important;
              gap: var(--spacing-sm) !important;
            }
            }
          `}</style>
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
                        onClick={() => handleDeleteUser(user)}
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

      {/* ============================================================================ */}
      {/* MODALS */}
      {/* ============================================================================ */}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: 'var(--spacing-xl)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            maxWidth: '400px',
            width: '90%',
            margin: 'var(--spacing-lg)'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              margin: '0 0 var(--spacing-md) 0',
              color: 'var(--lyd-text, #374151)'
            }}>
              Benutzer löschen
            </h3>
            <p style={{
              color: 'var(--lyd-text-secondary, #6b7280)',
              margin: '0 0 var(--spacing-lg) 0',
              lineHeight: '1.5'
            }}>
              Sind Sie sicher, dass Sie <strong>{selectedUser.name}</strong> ({selectedUser.email}) löschen möchten? 
              Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div style={{
              display: 'flex',
              gap: 'var(--spacing-md)',
              justifyContent: 'flex-end'
            }}>
              <Button 
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedUser(null);
                }}
              >
                Abbrechen
              </Button>
              <Button 
                variant="destructive"
                onClick={confirmDeleteUser}
              >
                Löschen
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Simple User Form Modal (Create/Edit) */}
      {(showCreateModal || showEditModal) && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: 'var(--spacing-xl)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            maxWidth: '500px',
            width: '90%',
            margin: 'var(--spacing-lg)',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              margin: '0 0 var(--spacing-lg) 0',
              color: 'var(--lyd-text, #374151)'
            }}>
              {selectedUser ? 'Benutzer bearbeiten' : 'Neuen Benutzer erstellen'}
            </h3>
            
            <UserForm 
              user={selectedUser}
              roles={roles}
              onSubmit={handleSubmitUser}
              onCancel={() => {
                setShowCreateModal(false);
                setShowEditModal(false);
                setSelectedUser(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// USER FORM COMPONENT
// ============================================================================

interface UserFormProps {
  user: User | null;
  roles: Role[];
  onSubmit: (userData: Partial<User>) => Promise<void>;
  onCancel: () => void;
}

function UserForm({ user, roles, onSubmit, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    isActive: user?.isActive ?? true,
    roleIds: user?.roles.map(r => r.id) || []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Name und E-Mail sind erforderlich.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
        <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--lyd-text, #374151)' }}>
          Name *
        </label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="Vollständiger Name"
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
        <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--lyd-text, #374151)' }}>
          E-Mail *
        </label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          disabled={!!user}
          placeholder="benutzer@liveyourdreams.online"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--lyd-text, #374151)' }}>
            Vorname
          </label>
          <Input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder="Max"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--lyd-text, #374151)' }}>
            Nachname
          </label>
          <Input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder="Mustermann"
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
        <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--lyd-text, #374151)' }}>
          Status
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            style={{ cursor: 'pointer' }}
          />
          <span style={{ fontSize: '14px', color: 'var(--lyd-text, #374151)' }}>
            Benutzer ist aktiv
          </span>
        </label>
      </div>

      <div style={{
        display: 'flex',
        gap: 'var(--spacing-md)',
        justifyContent: 'flex-end',
        paddingTop: 'var(--spacing-md)',
        borderTop: '1px solid var(--lyd-border, #e5e7eb)'
      }}>
        <Button 
          variant="outline"
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Abbrechen
        </Button>
        <Button 
          variant="primary"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Speichere...' : (user ? 'Aktualisieren' : 'Erstellen')}
        </Button>
      </div>
    </form>
  );
}
