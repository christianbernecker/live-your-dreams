/**
 * Role Management Page - IDENTICAL TO USER MANAGEMENT PATTERN
 * 
 * DATABASE SYNC LEARNINGS APPLIED:
 * - Field-Mapping Consistency Rule
 * - Database-First Refresh Strategy  
 * - API Response Compatibility Pattern
 * - Performance Optimization (memoization)
 * - Custom Components for styling control
 */

'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

/*
FIELD MAPPING DOCUMENTATION - ROLES:
Frontend → Backend → Database
isActive → isActive → is_active  
name → name → name
displayName → displayName → display_name
userCount → userCount → COUNT(user_roles)
description → description → description
permissionCount → permissionCount → COUNT(role_permissions)
*/

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Role {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  color?: string;
  isActive: boolean;
  userCount: number;
  permissionCount: number;
  permissions?: Permission[];
}

interface Permission {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  module: string;
  action: string;
}

interface RoleFormData {
  name: string;
  displayName: string;
  description: string;
  color: string;
  isActive: boolean;
  permissionIds: string[];
  usePreset: string;
}

// ============================================================================
// CUSTOM COMPONENTS (Design System Control)
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
            zIndex: 999999,
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

// ============================================================================
// MODAL COMPONENTS
// ============================================================================

interface RoleFormProps {
  role: Role | null;
  permissions: Permission[];
  onSubmit: (data: RoleFormData) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const RoleForm: React.FC<RoleFormProps> = ({ role, permissions, onSubmit, onCancel, isEdit = false }) => {
  const [formData, setFormData] = useState<RoleFormData>({
    name: role?.name || '',
    displayName: role?.displayName || '',
    description: role?.description || '',
    color: role?.color || '#6B7280',
    isActive: role?.isActive ?? true,
    permissionIds: role?.permissions?.map(p => p.id) || [],
    usePreset: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔥 ROLE FORM SUBMIT:', { formData, isEdit, roleName: role?.name });
    onSubmit(formData);
  };

  const handlePermissionToggle = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(permissionId)
        ? prev.permissionIds.filter(id => id !== permissionId)
        : [...prev.permissionIds, permissionId]
    }));
  };

  return (
    <div className="lyd-modal-overlay" onClick={onCancel}>
      <div className="lyd-modal" style={{ width: '600px', maxWidth: '90vw' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '12px', color: 'var(--lyd-primary)' }}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <circle cx="12" cy="16" r="1"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
            {isEdit ? 'Rolle bearbeiten' : 'Neue Rolle anlegen'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Rollen-Name (Key) *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                name: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '') 
              }))}
              placeholder="admin, editor, viewer"
              required
              disabled={isEdit}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Anzeige-Name *
            </label>
            <Input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
              placeholder="Administrator, Editor, Betrachter"
              required
              style={{ width: '100%' }}
            />
          </div>

          {/* Status Checkbox */}
          <div style={{ marginBottom: '20px' }}>
            <label className={`lyd-checkbox-group success ${formData.isActive ? 'active' : ''}`}>
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
                <div className="lyd-checkbox-label">Rolle ist aktiv</div>
                <div className="lyd-checkbox-description">
                  Aktive Rollen können Benutzern zugewiesen werden
                </div>
              </div>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button type="button" variant="outline" onClick={onCancel}>
              Abbrechen
            </Button>
            <Button type="submit" variant="primary">
              {isEdit ? 'Aktualisieren' : 'Rolle anlegen'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface DeleteConfirmProps {
  role: Role;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirm: React.FC<DeleteConfirmProps> = ({ role, onConfirm, onCancel }) => {
  return (
    <div className="lyd-modal-overlay" onClick={onCancel}>
      <div className="lyd-modal" style={{ width: '400px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '12px', color: 'var(--lyd-error)' }}>
            <path d="M3 6h18"/>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
            <path d="M8 6V4c0-1 1-2 2-2h4c0 1 1 2 1 2v2"/>
            <line x1="10" y1="11" x2="10" y2="17"/>
            <line x1="14" y1="11" x2="14" y2="17"/>
          </svg>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
            Rolle löschen bestätigen
          </h2>
        </div>
        
        <div style={{ marginBottom: '20px', lineHeight: '1.5' }}>
          <p>Sind Sie sicher, dass Sie die Rolle <strong>{role.displayName}</strong> löschen möchten?</p>
          <p style={{ color: 'var(--lyd-text-secondary)', fontSize: '14px' }}>
            Diese Aktion kann nicht rückgängig gemacht werden.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Button type="button" variant="outline" onClick={onCancel}>
            Abbrechen
          </Button>
          <Button type="button" variant="primary" onClick={onConfirm} style={{ backgroundColor: 'var(--lyd-error)' }}>
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

export default function AdminRolesPage() {
  const { showSuccess, showError, showWarning } = useToast();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // ============================================================================
  // DATA FETCHING (Database-First Pattern)
  // ============================================================================

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching roles from API...');
      
      const response = await fetch('/api/roles?includePermissions=true');
      
      if (response.ok) {
        const data = await response.json();
        setRoles(data.roles || []);
        console.log('✅ Roles loaded from API:', data.roles?.length || 0);
      } else if (response.status === 401) {
        console.log('🔐 Authentication required - redirecting to login');
        window.location.href = '/api/auth/signin';
        return;
      } else if (response.status === 403) {
        console.log('⛔ Insufficient permissions for role management');
        showError('Zugriff verweigert', 'Sie haben keine Berechtigung für die Rollenverwaltung.');
        setRoles([]);
      } else {
        console.error('❌ API Error:', response.status);
        showError('Fehler beim Laden', 'Rollen konnten nicht geladen werden.');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('❌ Network/API Error:', error);
      showError('Netzwerkfehler', 'Verbindung zur Datenbank fehlgeschlagen.');
      setLoading(false);
    }
  }, [showError]);

  const fetchPermissions = useCallback(async () => {
    try {
      const response = await fetch('/api/permissions');
      if (response.ok) {
        const data = await response.json();
        // Flatten permissions structure if needed
        const allPermissions = Object.values(data.permissions || {}).flat() as Permission[];
        setPermissions(allPermissions);
        console.log('✅ Permissions loaded:', allPermissions.length);
      }
    } catch (error) {
      console.error('❌ Error fetching permissions:', error);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, [fetchRoles, fetchPermissions]);

  // ============================================================================
  // EVENT HANDLERS (Memoized for Performance)
  // ============================================================================

  const handleCreateRole = useCallback(() => {
    setSelectedRole(null);
    setShowCreateModal(true);
  }, []);

  const handleEditRole = useCallback((role: Role) => {
    console.log('🔧 EDIT Role triggered:', role.displayName);
    setSelectedRole(role);
    setShowEditModal(true);
  }, []);

  const handleDeleteRole = useCallback((role: Role) => {
    console.log('🗑️ DELETE Role triggered:', role.displayName);
    setSelectedRole(role);
    setShowDeleteModal(true);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value);
  }, []);

  const handleModuleFilterChange = useCallback((value: string) => {
    setModuleFilter(value);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('');
    setModuleFilter('');
  }, []);

  // ============================================================================
  // CRUD OPERATIONS (Database-First Refresh)
  // ============================================================================

  const handleSubmitRole = async (roleData: RoleFormData) => {
    console.log('🚀 SUBMIT ROLE TRIGGERED:', { roleData, selectedRole });
    
    if (!roleData.name || !roleData.displayName) {
      showError('Validierungsfehler', 'Name und Anzeige-Name sind erforderlich');
      return;
    }

    try {
      const isEdit = selectedRole && selectedRole.id;
      const url = isEdit ? `/api/roles/${selectedRole.id}` : '/api/roles';
      const method = isEdit ? 'PATCH' : 'POST';

      const apiData = {
        name: roleData.name,
        displayName: roleData.displayName,
        description: roleData.description,
        color: roleData.color,
        isActive: roleData.isActive,
        permissionIds: roleData.permissionIds || [],
        usePreset: roleData.usePreset
      };
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData)
      });

      if (response.ok) {
        if (isEdit) {
          setShowEditModal(false);
          showSuccess('Rolle aktualisiert', `${roleData.displayName} wurde erfolgreich bearbeitet.`);
        } else {
          setShowCreateModal(false);
          showSuccess('Rolle erstellt', `${roleData.displayName} wurde erfolgreich hinzugefügt.`);
        }
        
        setSelectedRole(null);
        await fetchRoles(); // Database-First Refresh
        
      } else {
        const errorText = await response.text();
        if (response.status === 401) {
          showError('Sitzung abgelaufen', 'Bitte melden Sie sich erneut an.');
          window.location.href = '/api/auth/signin';
        } else if (response.status === 409) {
          showError('Rolle existiert bereits', 'Eine Rolle mit diesem Namen existiert bereits.');
        } else {
          showError('Fehler bei der Rollenoperation', `HTTP ${response.status}: ${errorText}`);
        }
      }
    } catch (error) {
      console.error('❌ Network Error:', error);
      showError('Netzwerkfehler', 'Prüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.');
    }
  };

  const confirmDeleteRole = async () => {
    if (!selectedRole) return;

    try {
      const response = await fetch(`/api/roles/${selectedRole.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        setShowDeleteModal(false);
        setSelectedRole(null);
        showSuccess('Rolle gelöscht', `${selectedRole.displayName} wurde erfolgreich entfernt.`);
        await fetchRoles(); // Database-First Refresh
      } else {
        const errorText = await response.text();
        if (response.status === 404) {
          setShowDeleteModal(false);
          setSelectedRole(null);
          showWarning('Rolle nicht gefunden', 'Die Rolle wurde bereits gelöscht.');
          await fetchRoles();
        } else {
          showError('Fehler beim Löschen', `HTTP ${response.status}: ${errorText}`);
        }
      }
    } catch (error) {
      console.error('❌ DELETE Network Error:', error);
      showError('Netzwerkfehler', 'Verbindung zur Datenbank fehlgeschlagen.');
    }
  };

  // ============================================================================
  // MEMOIZED FILTERS & OPTIONS (Performance Optimization)
  // ============================================================================

  const statusFilterOptions = useMemo(() => [
    { value: '', label: 'Alle Status' },
    { value: 'true', label: 'Aktiv' },
    { value: 'false', label: 'Inaktiv' }
  ], []);

  const moduleFilterOptions = useMemo(() => {
    const modules = Array.from(new Set(permissions.map(p => p.module)));
    return [
      { value: '', label: 'Alle Module' },
      ...modules.map(module => ({ 
        value: module, 
        label: module.charAt(0).toUpperCase() + module.slice(1)
      }))
    ];
  }, [permissions]);

  const filteredRoles = useMemo(() => {
    if (loading) return [];
    
    return roles.filter((role) => {
      const matchesSearch = !searchTerm || 
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.displayName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || 
        (statusFilter === 'true' ? role.isActive : !role.isActive);
      
      const matchesModule = !moduleFilter || 
        (role.permissions && role.permissions.some(p => p.module === moduleFilter));
      
      return matchesSearch && matchesStatus && matchesModule;
    });
  }, [roles, searchTerm, statusFilter, moduleFilter, loading]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      {/* Page Header */}
      <div className="lyd-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600', marginBottom: '4px' }}>
              Rollen-Verwaltung
            </h1>
            <p style={{ margin: 0, color: 'var(--lyd-text-secondary)', fontSize: '14px' }}>
              Rollen und Berechtigungen konfigurieren
            </p>
          </div>
          
          <Button 
            type="button"
            variant="primary"
            onClick={handleCreateRole}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <circle cx="12" cy="16" r="1"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            }
          >
            Neue Rolle
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="lyd-card">
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
            Suchen und Filtern
          </h2>
          <p style={{ margin: 0, color: 'var(--lyd-text-secondary)', fontSize: '14px' }}>
            Durchsuchen Sie Rollen nach Namen und filtern Sie nach Status und Modulen.
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr auto',
          gap: '16px',
          alignItems: 'start',
          width: '100%',
          marginBottom: '0'
        }}>
          
          {/* Search Input */}
          <div style={{ 
            position: 'relative',
            minWidth: '0'
          }}>
            <input
              type="text"
              placeholder="Rollen suchen..."
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
          
          {/* Status Filter */}
          <div style={{ minWidth: '0', position: 'relative' }}>
            <CustomSelect
              value={statusFilter}
              onChange={handleStatusFilterChange}
              placeholder="Alle Status"
              options={statusFilterOptions}
            />
          </div>
          
          {/* Module Filter */}
          <div style={{ minWidth: '0', position: 'relative' }}>
            <CustomSelect
              value={moduleFilter}
              onChange={handleModuleFilterChange}
              placeholder="Alle Module"
              options={moduleFilterOptions}
            />
          </div>
          
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
          <div style={{ padding: '40px', textAlign: 'center' }}>
            Lade Rollen...
          </div>
        ) : (
          <table className="api-table striped">
            <thead>
              <tr>
                <th>Rolle</th>
                <th>Benutzer</th>
                <th>Berechtigungen</th>
                <th>Status</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.map((role) => (
                <tr key={role.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: role.color || 'var(--lyd-gray-400)'
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: '600' }}>{role.displayName}</div>
                        <div style={{ color: 'var(--lyd-text-secondary)', fontSize: '14px' }}>
                          {role.name}
                        </div>
                        {role.description && (
                          <div style={{ color: 'var(--lyd-text-secondary)', fontSize: '12px' }}>
                            {role.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontWeight: '600' }}>{role.userCount}</span>
                      <span style={{ color: 'var(--lyd-text-secondary)', fontSize: '14px' }}>
                        Benutzer
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontWeight: '600' }}>{role.permissionCount}</span>
                      <span style={{ color: 'var(--lyd-text-secondary)', fontSize: '14px' }}>
                        Berechtigungen
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`lyd-badge ${role.isActive ? 'success' : 'secondary'}`}>
                      {role.isActive ? 'AKTIV' : 'INAKTIV'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
                      <button
                        onClick={() => handleEditRole(role)}
                        className="lyd-button ghost icon-only"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '32px',
                          height: '32px',
                          border: 'none',
                          background: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          color: 'var(--lyd-text-secondary)'
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteRole(role)}
                        className="lyd-button ghost icon-only"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '32px',
                          height: '32px',
                          border: 'none',
                          background: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          color: 'var(--lyd-error)'
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18"/>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                          <path d="M8 6V4c0-1 1-2 2-2h4c0 1 1 2 1 2v2"/>
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

      {/* Modals */}
      {showCreateModal && (
        <RoleForm
          role={null}
          permissions={permissions}
          onSubmit={handleSubmitRole}
          onCancel={() => setShowCreateModal(false)}
          isEdit={false}
        />
      )}

      {showEditModal && selectedRole && (
        <RoleForm
          role={selectedRole}
          permissions={permissions}
          onSubmit={handleSubmitRole}
          onCancel={() => setShowEditModal(false)}
          isEdit={true}
        />
      )}

      {showDeleteModal && selectedRole && (
        <DeleteConfirm
          role={selectedRole}
          onConfirm={confirmDeleteRole}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}
