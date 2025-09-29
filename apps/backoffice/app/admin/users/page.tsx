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

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Toast, useToast } from '@/components/ui/Toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

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
  const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  const selectedOption = options.find(option => option.value === value);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isOpen && !target.closest('.lyd-custom-select-container') && !target.closest('.lyd-portal-dropdown')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Calculate dropdown position
  const getDropdownPosition = () => {
    if (!buttonRef) return { top: 0, left: 0, width: 200 };
    
    const rect = buttonRef.getBoundingClientRect();
    return {
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width
    };
  };
  
  return (
    <div className="lyd-custom-select-container" style={{ position: 'relative', width: '100%' }}>
      <button
        ref={setButtonRef}
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
      
      {isOpen && isMounted && createPortal(
        <div
          className="lyd-portal-dropdown"
          style={{
            position: 'fixed',
            top: getDropdownPosition().top,
            left: getDropdownPosition().left,
            width: getDropdownPosition().width,
            backgroundColor: 'white',
            border: '1px solid var(--lyd-border, #d1d5db)',
            borderRadius: '6px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
            zIndex: 999999, // PORTAL-BASED - GUARANTEED HIGHEST Z-INDEX
            maxHeight: '200px',
            overflowY: 'auto',
            minWidth: '150px'
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
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--lyd-gray-50, #f9fafb)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = value === option.value ? 'var(--lyd-primary-50, #eff6ff)' : 'white';
              }}
            >
              {option.label}
            </button>
          ))}
        </div>,
        document.body
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
    console.log('🔥 FORM SUBMIT TRIGGERED:', { formData, isEdit, userEmail: user?.email });
    e.preventDefault();
    console.log('🎯 CALLING onSubmit with:', formData);
    onSubmit(formData);
    console.log('✅ onSubmit CALLED');
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
    <div 
      className="lyd-modal-overlay" 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div 
        className="lyd-modal" 
        style={{
          backgroundColor: 'white',
          borderRadius: 'var(--radius-lg, 8px)',
          padding: '24px',
          maxWidth: '500px',
          width: 'calc(100% - 32px)',
          maxHeight: 'calc(100vh - 64px)',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--lyd-border, #e5e7eb)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
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

           {/* Roles - DESIGN SYSTEM CHECKBOXES */}
           <div>
             <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
               Rollen
             </label>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
               {roles.map(role => (
                 <label 
                   key={role.id} 
                   className={`lyd-checkbox-group ${formData.roleIds.includes(role.id) ? 'active' : ''}`}
                 >
                   <input
                     type="checkbox"
                     className="lyd-checkbox-input"
                     checked={formData.roleIds.includes(role.id)}
                     onChange={() => handleRoleToggle(role.id)}
                   />
                   <span className="lyd-checkbox">
                     <svg className="lyd-checkbox-checkmark" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                       <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                     </svg>
                   </span>
                   <div>
                     <div className="lyd-checkbox-label">{role.displayName}</div>
                     <div className="lyd-checkbox-description">
                       {role.name === 'admin' && 'Vollzugriff auf alle Funktionen'}
                       {role.name === 'editor' && 'Kann Inhalte bearbeiten und verwalten'}
                       {role.name === 'author' && 'Kann Inhalte erstellen und bearbeiten'}
                       {role.name === 'viewer' && 'Nur Lesezugriff auf Inhalte'}
                     </div>
                   </div>
                 </label>
               ))}
             </div>
           </div>

           {/* Status - DESIGN SYSTEM CHECKBOX */}
           <div>
             <label className={`lyd-checkbox-group success ${formData.isActive ? 'success' : ''}`}>
               <input
                 type="checkbox"
                 className="lyd-checkbox-input"
                 checked={formData.isActive}
                 onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
               />
               <span className="lyd-checkbox">
                 <svg className="lyd-checkbox-checkmark" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                   <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                 </svg>
               </span>
               <div>
                 <div className="lyd-checkbox-label">Benutzer ist aktiv</div>
                 <div className="lyd-checkbox-description">
                   Aktive Benutzer können sich einloggen und das System verwenden
                 </div>
               </div>
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
    <div 
      className="lyd-modal-overlay" 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div 
        className="lyd-modal" 
        style={{
          backgroundColor: 'white',
          borderRadius: 'var(--radius-lg, 8px)',
          padding: '24px',
          maxWidth: '400px',
          width: 'calc(100% - 32px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--lyd-border, #e5e7eb)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
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
      console.log('🔄 FETCHING ROLES from /api/roles...');
      const response = await fetch('/api/roles');
      console.log('📡 ROLES API Response:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ ROLES API Success:', data);
        console.log('🎯 ROLES LOADED FROM API:', data.roles?.map((r: any) => ({ id: r.id, name: r.name })));
        setRoles(data.roles || []);
        return;
      } else {
        console.log('❌ ROLES API failed:', response.status, response.statusText);
      }
    } catch (error) {
      console.log('❌ ROLES API error:', error);
    }
    
    // Fallback roles
    console.log('🔄 USING FALLBACK ROLES with demo IDs...');
    const fallbackRoles: Role[] = [
      { id: '1', name: 'admin', displayName: 'Administrator' },
      { id: '2', name: 'editor', displayName: 'Editor' },
      { id: '3', name: 'author', displayName: 'Autor' },
      { id: '4', name: 'viewer', displayName: 'Betrachter' }
    ];
    console.log('🎯 FALLBACK ROLES:', fallbackRoles.map((r: Role) => ({ id: r.id, name: r.name })));
    setRoles(fallbackRoles);
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [fetchUsers, fetchRoles]);

  // ============================================================================
  // CRUD FUNCTIONS (MEMOIZED TO PREVENT RE-RENDERS)
  // ============================================================================

  const handleCreateUser = useCallback(() => {
    setSelectedUser(null);
    setShowCreateModal(true);
  }, []);

  const handleEditUser = useCallback((user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  }, []);

  const handleDeleteUser = useCallback((user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setRoleFilter('');
    setStatusFilter('');
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleRoleFilterChange = useCallback((value: string) => {
    setRoleFilter(value);
  }, []);

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value);
  }, []);

  // Memoized role options to prevent re-renders
  const roleFilterOptions = useMemo(() => [
    { value: '', label: 'Alle Rollen' },
    ...roles.map(role => ({
      value: role.name,
      label: role.displayName
    }))
  ], [roles]);

  const statusFilterOptions = useMemo(() => [
    { value: '', label: 'Alle Status' },
    { value: 'true', label: 'Aktiv' },
    { value: 'false', label: 'Inaktiv' }
  ], []);

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      console.log('🗑️ DELETE Request:', { 
        userId: selectedUser.id, 
        name: selectedUser.name,
        currentUsersCount: users.length 
      });
      
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 DELETE Response:', response.status, response.statusText);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ DELETE Success Response:', result);
        
        // CRITICAL: Store user info before state update
        const deletedUserName = selectedUser.name;
        const deletedUserId = selectedUser.id;
        
        // VERIFY: Check what type of delete happened
        if (result.message?.includes('permanently deleted')) {
          console.log('🗑️ HARD DELETE CONFIRMED:', result.deletedUser);
        } else if (result.message?.includes('deactivated')) {
          console.log('⚠️ SOFT DELETE (Fallback):', result);
        }
        
          // CLOSE MODAL IMMEDIATELY for user feedback
          setShowDeleteModal(false);
          setSelectedUser(null);
          
          // SHOW SUCCESS TOAST WITH SPECIFIC MESSAGE
          const deleteType = result.message?.includes('permanently') ? 'permanent aus der Datenbank' : 'erfolgreich';
          console.log('🎉 Showing success toast for:', deletedUserName, 'Delete type:', deleteType);
          showSuccess('Benutzer gelöscht', `${deletedUserName} wurde ${deleteType} entfernt.`);
          
          // CRITICAL: Refresh all users from database to ensure UI sync
          console.log('🔄 Calling fetchUsers() after delete to refresh table data...');
          await fetchUsers();
        
      } else if (response.status === 401) {
        showError('Sitzung abgelaufen', 'Bitte melden Sie sich erneut an.');
        window.location.href = '/api/auth/signin';
        return;
      } else if (response.status === 403) {
        showError('Zugriff verweigert', 'Sie haben keine Berechtigung zum Löschen von Benutzern.');
      } else if (response.status === 404) {
        // User already deleted - refresh to get current state
        console.log('⚠️ User not found in DB, refreshing to get current state');
        setShowDeleteModal(false);
        setSelectedUser(null);
        showWarning('Benutzer nicht gefunden', 'Der Benutzer wurde bereits gelöscht.');
        
        // Refresh data to ensure consistency
        console.log('🔄 Calling fetchUsers() after 404 to refresh table data...');
        await fetchUsers();
      } else if (response.status >= 500) {
        const errorText = await response.text();
        console.error('❌ DELETE Server Error:', response.status, errorText);
        showError('Server-Fehler', `Datenbank-Fehler (${response.status}). Bitte versuchen Sie es später erneut.`);
        // DO NOT remove from UI on server errors - user might still exist
      } else {
        const errorText = await response.text();
        console.error('❌ DELETE Error:', response.status, errorText);
        showError('Fehler beim Löschen', `HTTP ${response.status}: ${errorText}`);
        // DO NOT remove from UI on unknown errors
      }
    } catch (error) {
      console.error('❌ DELETE Network Error:', error);
      showError('Netzwerkfehler', 'Verbindung zur Datenbank fehlgeschlagen.');
      // DO NOT remove from UI on network errors - user might still exist
    }
  };

  const handleSubmitUser = async (userData: UserFormData) => {
    console.log('🚀 SUBMIT USER TRIGGERED:', { userData, selectedUser, showEditModal, showCreateModal });
    
    if (!userData.email || !userData.name) {
      showError('Validierungsfehler', 'E-Mail und Name sind erforderlich');
      return;
    }

    try {
      const isEdit = selectedUser && selectedUser.id;
      const url = isEdit ? `/api/users/${selectedUser.id}` : '/api/users';
      const method = isEdit ? 'PATCH' : 'POST';

      console.log('🔄 CRUD Operation:', { method, url, userData, isEdit, selectedUserId: selectedUser?.id });

      // Prepare data for API
      console.log('🔍 ROLE DEBUGGING - Available roles in component:', roles.map((r: Role) => ({ id: r.id, name: r.name })));
      console.log('🔍 ROLE DEBUGGING - User selected roleIds:', userData.roleIds);
      console.log('🔍 ROLE DEBUGGING - Role name mapping:', userData.roleIds?.map((id: string) => {
        const role = roles.find((r: Role) => r.id === id);
        return { id, name: role?.name || 'NOT_FOUND' };
      }));
      
      const apiData = {
        name: userData.name,
        email: userData.email,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        isActive: userData.isActive,
        isVerified: userData.isActive, // API expects isVerified, not emailVerified
        roleIds: userData.roleIds || []
      };
      
      console.log('📤 SENDING TO API:', apiData);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiData)
      });

      console.log('📡 API Response:', response.status, response.statusText);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ API Success:', result);
        
        if (isEdit) {
          // ✅ ALWAYS REFRESH FROM DATABASE for consistency
          console.log('🔄 User updated successfully - refreshing all data from database...');
          
          // Close modal first for immediate user feedback
          setShowEditModal(false);
          setSelectedUser(null);
          
          // Show success message
          showSuccess('Benutzer aktualisiert', `${userData.name} wurde erfolgreich bearbeitet.`);
          
          // CRITICAL: Refresh all users from database to ensure UI sync
          console.log('🔄 Calling fetchUsers() to refresh table data...');
          await fetchUsers();
          
        } else {
          // ✅ ALWAYS REFRESH FROM DATABASE for consistency  
          console.log('👤 User created successfully - refreshing all data from database...');
          
          // Close modal first for immediate user feedback
          setShowCreateModal(false);
          setSelectedUser(null);
          
          // Show success message
          showSuccess('Benutzer erstellt', `${userData.name} wurde erfolgreich hinzugefügt.`);
          
          // CRITICAL: Refresh all users from database to ensure UI sync
          console.log('🔄 Calling fetchUsers() to refresh table data...');
          await fetchUsers();
        }
        
      } else {
        // Handle API errors with detailed logging
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, errorText);
        
        if (response.status === 401) {
          showError('Sitzung abgelaufen', 'Bitte melden Sie sich erneut an.');
          window.location.href = '/api/auth/signin';
          return;
        } else if (response.status === 403) {
          showError('Zugriff verweigert', 'Sie haben keine Berechtigung für diese Aktion.');
        } else if (response.status === 409) {
          showError('Benutzer existiert bereits', 'Ein Benutzer mit dieser E-Mail-Adresse existiert bereits.');
        } else if (response.status === 422) {
          showError('Validierungsfehler', 'Die eingegebenen Daten sind ungültig.');
        } else if (response.status >= 500) {
          showError('Server-Fehler', `API-Server nicht erreichbar (${response.status}). Bitte versuchen Sie es später erneut.`);
        } else {
          showError('Fehler bei der Benutzeroperation', `HTTP ${response.status}: ${errorText}`);
        }
      }
    } catch (error) {
      console.error('❌ Network Error:', error);
      showError('Netzwerkfehler', 'Prüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.');
    }
  };

  // ============================================================================
  // FILTERING (MEMOIZED TO PREVENT FLICKER)
  // ============================================================================

  const filteredUsers = useMemo(() => {
    if (loading) return [];
    
    return users.filter(user => {
      const matchesSearch = !searchTerm || 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = !roleFilter || 
        user.roles.some(role => role.name === roleFilter);
      
      const matchesStatus = !statusFilter || 
        (statusFilter === 'true' ? user.isActive : !user.isActive);
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter, loading]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      {/* TOAST NOTIFICATIONS - FIXED POSITIONING */}
      {toasts.length > 0 && (
        <div 
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxWidth: '400px',
            pointerEvents: 'none'
          }}
        >
          {toasts.map((toast, index) => (
            <Toast 
              key={toast.id} 
              {...toast} 
              style={{
                position: 'relative',
                top: `${index * 12}px`
              }}
            />
          ))}
        </div>
      )}

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
               onChange={handleSearchChange}
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
             onChange={handleRoleFilterChange}
            placeholder="Alle Rollen"
            options={roleFilterOptions}
          />
          
          {/* Status Filter */}
           <CustomSelect
             value={statusFilter}
             onChange={handleStatusFilterChange}
            placeholder="Alle Status"
            options={statusFilterOptions}
          />
          
          {/* Reset Button */}
           <Button 
             type="button"
             variant="outline"
             onClick={handleResetFilters}
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
          <LoadingSpinner 
            size="lg" 
            label="Benutzer laden..." 
            variant="gradient"
          />
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
                    <span className={`lyd-badge ${user.isActive ? 'success' : 'secondary'}`}>
                      {user.isActive ? 'AKTIV' : 'INAKTIV'}
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
