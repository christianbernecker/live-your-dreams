/**
 * User Management Page - FIXED VERSION
 * 
 * ✅ Toast notifications instead of alerts
 * ✅ Icons in modals  
 * ✅ Role selection functionality
 * ✅ Fixed delete functionality
 * ✅ Correct checkbox styling
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast, Toast } from '@/components/ui/Toast';

// ============================================================================
// TYPES
// ============================================================================

interface Role {
  id: string;
  name: string;
  displayName: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  emailVerified: boolean;
  roles: Role[];
}

interface UserFormData {
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  roleIds: string[];
}

// ============================================================================
// CUSTOM COMPONENTS
// ============================================================================

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: { value: string; label: string; }[];
}

const CustomSelect: React.FC<CustomSelectProps> = ({ value, onChange, placeholder, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedOption = options.find(option => option.value === value);
  
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

// User Form Component
interface UserFormProps {
  user?: User | null;
  roles: Role[];
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ user, roles, onSubmit, onCancel, isEdit = false }) => {
  const [formData, setFormData] = useState<UserFormData>({
    name: user?.name || '',
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    isActive: user?.isActive ?? true,
    roleIds: user?.roles.map(r => r.id) || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleRoleToggle = (roleId: string) => {
    setFormData(prev => ({
      ...prev,
      roleIds: prev.roleIds.includes(roleId)
        ? prev.roleIds.filter(id => id !== roleId)
        : [...prev.roleIds, roleId]
    }));
  };

  return (
    <div className="lyd-modal-overlay" style={{
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
      <div className="lyd-modal" style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          {/* MODAL ICON */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
            {isEdit ? 'Benutzer bearbeiten' : 'Neuen Benutzer erstellen'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Name */}
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
              Name *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              style={{ width: '100%' }}
            />
          </div>

          {/* Email */}
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
              E-Mail *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              style={{ width: '100%' }}
            />
          </div>

          {/* First Name & Last Name */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                Vorname
              </label>
              <Input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                Nachname
              </label>
              <Input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Roles */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Rollen
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {roles.map(role => (
                <label 
                  key={role.id} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '4px',
                    backgroundColor: formData.roleIds.includes(role.id) ? 'var(--lyd-primary-50, #eff6ff)' : 'transparent'
                  }}
                >
                  {/* FIXED CHECKBOX STYLING */}
                  <input
                    type="checkbox"
                    checked={formData.roleIds.includes(role.id)}
                    onChange={() => handleRoleToggle(role.id)}
                    style={{
                      width: '16px',
                      height: '16px',
                      accentColor: 'var(--lyd-primary, #3b82f6)'
                    }}
                  />
                  <span style={{ fontSize: '14px' }}>{role.displayName}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '4px',
              backgroundColor: formData.isActive ? 'var(--lyd-success-50, #ecfdf5)' : 'var(--lyd-gray-50, #f9fafb)'
            }}>
              {/* FIXED CHECKBOX STYLING */}
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                style={{
                  width: '16px',
                  height: '16px',
                  accentColor: 'var(--lyd-success, #10b981)'
                }}
              />
              <span style={{ fontWeight: '500' }}>Benutzer ist aktiv</span>
            </label>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <Button type="button" variant="outline" onClick={onCancel}>
              Abbrechen
            </Button>
            <Button type="submit" variant="primary">
              {isEdit ? 'Aktualisieren' : 'Speichern'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete Confirmation Component
interface DeleteConfirmProps {
  user: User;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirm: React.FC<DeleteConfirmProps> = ({ user, onConfirm, onCancel }) => {
  return (
    <div className="lyd-modal-overlay" style={{
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
      <div className="lyd-modal" style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        maxWidth: '400px',
        width: '90%'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          {/* MODAL DELETE ICON */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--lyd-error, #ef4444)">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
            Benutzer löschen
          </h2>
        </div>

        <p style={{ marginBottom: '24px', color: 'var(--lyd-text-secondary)' }}>
          Sind Sie sicher, dass Sie <strong>{user.name}</strong> ({user.email}) löschen möchten? 
          Diese Aktion kann nicht rückgängig gemacht werden.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button variant="outline" onClick={onCancel}>
            Abbrechen
          </Button>
          <Button 
            variant="secondary" 
            onClick={onConfirm}
            style={{
              backgroundColor: 'var(--lyd-error, #ef4444)',
              color: 'white',
              border: 'none'
            }}
          >
            Löschen
          </Button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Toast system
  const { toasts, showSuccess, showError, showWarning } = useToast();

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/users');
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        console.log('✅ Users loaded from API:', data.users?.length || 0);
      } else if (response.status === 401) {
        console.log('🔐 Authentication required - redirecting to login');
        window.location.href = '/api/auth/signin';
        return;
      } else if (response.status === 403) {
        console.log('⛔ Insufficient permissions for user management');
        showError('Zugriff verweigert', 'Sie haben keine Berechtigung für die Benutzerverwaltung.');
        setUsers([]);
      } else {
        console.error('❌ API Error:', response.status);
        showWarning('API nicht verfügbar', 'Demo-Daten wurden geladen.');
        
        // Demo fallback
        const demoUsers: User[] = [
          {
            id: 'demo-1',
            name: 'System Administrator',
            email: 'admin@liveyourdreams.online',
            isActive: true,
            emailVerified: true,
            roles: [{ id: '1', name: 'admin', displayName: 'Administrator' }]
          },
          {
            id: 'demo-2',
            name: 'Demo User',
            email: 'demo@liveyourdreams.online',
            isActive: true,
            emailVerified: true,
            roles: [{ id: '2', name: 'editor', displayName: 'Editor' }]
          }
        ];
        
        setUsers(demoUsers);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('❌ Network/API Error:', error);
      showError('Netzwerkfehler', 'Verbindung fehlgeschlagen.');
      setUsers([]);
      setLoading(false);
    }
  }, [showError, showWarning]);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await fetch('/api/roles');
      if (response.ok) {
        const data = await response.json();
        setRoles(data.roles || []);
        return;
      }
    } catch (error) {
      console.log('❌ Roles API not available, using fallback');
    }
    
    // Fallback roles
    const fallbackRoles: Role[] = [
      { id: '1', name: 'admin', displayName: 'Administrator' },
      { id: '2', name: 'editor', displayName: 'Editor' },
      { id: '3', name: 'author', displayName: 'Autor' },
      { id: '4', name: 'viewer', displayName: 'Betrachter' }
    ];
    setRoles(fallbackRoles);
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [fetchUsers, fetchRoles]);

  // ============================================================================
  // CRUD FUNCTIONS
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
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // CRITICAL: Update UI state immediately to remove user from list
        setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
        setShowDeleteModal(false);
        setSelectedUser(null);
        showSuccess('Benutzer gelöscht', `${selectedUser.name} wurde erfolgreich entfernt.`);
      } else if (response.status === 401) {
        window.location.href = '/api/auth/signin';
        return;
      } else if (response.status === 403) {
        showError('Zugriff verweigert', 'Sie haben keine Berechtigung zum Löschen von Benutzern.');
      } else {
        showError('Fehler beim Löschen', 'Der Benutzer konnte nicht gelöscht werden.');
      }
    } catch (error) {
      showError('Netzwerkfehler', 'Verbindung fehlgeschlagen.');
    }
  };

  const handleSubmitUser = async (userData: UserFormData) => {
    if (!userData.email || !userData.name) {
      showError('Validierungsfehler', 'E-Mail und Name sind erforderlich');
      return;
    }

    try {
      const isEdit = selectedUser && selectedUser.id;
      const url = isEdit ? `/api/users/${selectedUser.id}` : '/api/users';
      const method = isEdit ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const result = await response.json();
        
        if (isEdit) {
          // Update existing user in list
          setUsers(prev => prev.map(u => 
            u.id === selectedUser.id ? { ...u, ...userData } : u
          ));
          setShowEditModal(false);
          showSuccess('Benutzer aktualisiert', `${userData.name} wurde erfolgreich bearbeitet.`);
        } else {
          // Add new user to list
          setUsers(prev => [...prev, result.user]);
          setShowCreateModal(false);
          showSuccess('Benutzer erstellt', `${userData.name} wurde erfolgreich hinzugefügt.`);
        }
        
        setSelectedUser(null);
        
      } else if (response.status === 401) {
        window.location.href = '/api/auth/signin';
        return;
      } else if (response.status === 403) {
        showError('Zugriff verweigert', 'Sie haben keine Berechtigung für diese Aktion.');
      } else if (response.status === 409) {
        showError('Benutzer existiert bereits', 'Ein Benutzer mit dieser E-Mail-Adresse existiert bereits.');
      } else {
        showError('Fehler bei der Benutzeroperation', 'Bitte versuchen Sie es erneut.');
      }
    } catch (error) {
      showError('Netzwerkfehler', 'Prüfen Sie Ihre Internetverbindung.');
    }
  };

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
      (statusFilter === 'true' ? user.emailVerified : !user.emailVerified);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      {/* TOAST NOTIFICATIONS */}
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} />
      ))}

      {/* Page Header */}
      <div className="lyd-card">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>
            Benutzer-Verwaltung
          </h1>
          <Button
            variant="primary"
            onClick={handleCreateUser}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Neuer Benutzer
          </Button>
        </div>
        <p style={{ margin: 0, color: 'var(--lyd-text-secondary)' }}>
          Benutzer, Rollen und Berechtigungen verwalten
        </p>
      </div>

      {/* Filter Section */}
      <div className="lyd-card">
        <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>
          Suchen und Filtern
        </h2>
        <p style={{ margin: '0 0 16px 0', color: 'var(--lyd-text-secondary)', fontSize: '14px' }}>
          Durchsuchen Sie Benutzer nach Namen oder E-Mail und filtern Sie nach Rollen und Status.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr auto',
          gap: '16px',
          alignItems: 'start',
          width: '100%',
          marginBottom: '0'
        }}>
          {/* Search Input */}
          <div style={{ position: 'relative', minWidth: '0' }}>
            <input
              type="text"
              placeholder="Benutzer suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
            <div style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--lyd-text-secondary, #6b7280)',
              pointerEvents: 'none',
              zIndex: 10
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
          </div>
          
          {/* Role Filter */}
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
          
          {/* Status Filter */}
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
          
          {/* Reset Button */}
          <Button 
            type="button"
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setRoleFilter('');
              setStatusFilter('');
            }}
            style={{
              height: '40px',
              alignSelf: 'start'
            }}
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18"/>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                <path d="M8 6V4c0-1 1-2 2-2h4c0 1 1 2 1 2v2"/>
              </svg>
            }
          >
            Zurücksetzen
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="lyd-card">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            Lade Benutzer...
          </div>
        ) : (
          <table className="api-table striped">
            <thead>
              <tr>
                <th>Benutzer</th>
                <th>Rolle</th>
                <th>Status</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div>
                        <div style={{ fontWeight: '600' }}>{user.name}</div>
                        <div style={{ color: 'var(--lyd-text-secondary)', fontSize: '14px' }}>
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {user.roles.map((role) => (
                        <span key={role.id} className={`lyd-badge ${
                          role.name === 'admin' ? 'error' : 
                          role.name === 'editor' ? 'info' : 
                          role.name === 'author' ? 'warning' : 'success'
                        }`}>
                          {role.displayName}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className={`lyd-badge ${user.emailVerified ? 'success' : 'secondary'}`}>
                      {user.emailVerified ? 'AKTIV' : 'INAKTIV'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="lyd-button ghost icon-only"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          padding: '4px',
                          color: 'var(--lyd-text-secondary)'
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="lyd-button ghost icon-only"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          padding: '4px',
                          color: 'var(--lyd-error)'
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3,6 5,6 21,6"/>
                          <path d="m19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                          <line x1="10" y1="11" x2="10" y2="17"/>
                          <line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODALS */}
      {showCreateModal && (
        <UserForm
          roles={roles}
          onSubmit={handleSubmitUser}
          onCancel={() => setShowCreateModal(false)}
          isEdit={false}
        />
      )}

      {showEditModal && selectedUser && (
        <UserForm
          user={selectedUser}
          roles={roles}
          onSubmit={handleSubmitUser}
          onCancel={() => setShowEditModal(false)}
          isEdit={true}
        />
      )}

      {showDeleteModal && selectedUser && (
        <DeleteConfirm
          user={selectedUser}
          onConfirm={confirmDeleteUser}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}
