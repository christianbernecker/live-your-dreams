/**
 * Role Management Page
 * 
 * Provides role and permission management with matrix editor
 * STRICTLY uses Design System wrappers - NO native HTML elements!
 */

'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Checkbox, CheckboxGroup } from '@/components/ui/Checkbox';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Table, TableBody, TableCell, TableEmptyState, TableHeader, TableHeaderCell, TableLoadingState, TableRow } from '@/components/ui/Table';
import { useToast } from '@/components/ui/Toast';
import { ROLE_PRESETS } from '@/lib/rbac';
import { useEffect, useState } from 'react';

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

export default function RoleManagementPage() {
  const { showToast } = useToast();
  
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Record<string, Permission[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    color: '#6B7280',
    usePreset: ''
  });

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/roles?includePermissions=true');
      if (!response.ok) throw new Error('Failed to fetch roles');
      
      const data = await response.json();
      setRoles(data.roles || []);
    } catch (err) {
      setError('Fehler beim Laden der Rollen');
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await fetch('/api/permissions');
      if (!response.ok) throw new Error('Failed to fetch permissions');
      
      const data = await response.json();
      setPermissions(data.permissions || {});
    } catch (err) {
      console.error('Error fetching permissions:', err);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const handleCreateRole = async () => {
    try {
      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create role');
      }

      setShowCreateModal(false);
      setFormData({
        name: '',
        displayName: '',
        description: '',
        color: '#6B7280',
        usePreset: ''
      });
      
      await fetchRoles();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Erstellen der Rolle');
    }
  };

  const openPermissionModal = (role: Role) => {
    setSelectedRole(role);
    setSelectedPermissions(role.permissions?.map(p => p.id) || []);
    setShowPermissionModal(true);
  };

  const handleUpdatePermissions = async () => {
    if (!selectedRole) return;
    
    try {
      const response = await fetch(`/api/roles/${selectedRole.id}/permissions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissionIds: selectedPermissions })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update permissions');
      }

      setShowPermissionModal(false);
      setSelectedRole(null);
      await fetchRoles();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Aktualisieren der Berechtigungen');
    }
  };

  return (
    <div className="lyd-stack lg">
      {/* Page Header */}
      <div className="lyd-card">
        <div className="lyd-card-header">
          <div className="lyd-row between center">
            <div>
              <h1 className="lyd-heading-1">Rollen-Verwaltung</h1>
              <p className="lyd-text-secondary">
                Rollen und Berechtigungen konfigurieren
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowCreateModal(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 'var(--spacing-xs, 4px)' }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <circle cx="12" cy="16" r="1"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Neue Rolle
            </Button>
          </div>
        </div>
      </div>

      {/* Roles Table - Design System konform */}
      <div className="lyd-card">
        <Table variant="striped">
          <TableHeader>
            <TableRow>
              <TableHeaderCell width="30%">Rolle</TableHeaderCell>
              <TableHeaderCell width="20%">Benutzer</TableHeaderCell>
              <TableHeaderCell width="20%">Berechtigungen</TableHeaderCell>
              <TableHeaderCell width="15%">Status</TableHeaderCell>
              <TableHeaderCell width="15%">Aktionen</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableLoadingState rows={3} columns={5} />
            ) : roles.length === 0 ? (
              <TableEmptyState
                title="Keine Rollen vorhanden"
                description="Erstellen Sie die erste Rolle für Ihr System."
                action={
                  <Button
                    variant="primary"
                    onClick={() => setShowCreateModal(true)}
                  >
                    Erste Rolle anlegen
                  </Button>
                }
              />
            ) : (
              roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div className="lyd-row center gap-sm">
                      <Badge
                        variant="primary"
                        size="sm"
                        icon={
                          <div
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: role.color || 'var(--lyd-grey)'
                            }}
                          />
                        }
                      >
                        {role.displayName}
                      </Badge>
                      <div>
                        <div className="lyd-text-small text-secondary">{role.name}</div>
                        {role.description && (
                          <div className="lyd-text-xs text-secondary">
                            {role.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <span className="lyd-text-bold">{role.userCount}</span>
                    <span className="lyd-text-small text-secondary"> Benutzer</span>
                  </TableCell>
                  
                  <TableCell>
                    <span className="lyd-text-bold">{role.permissionCount}</span>
                    <span className="lyd-text-small text-secondary"> Berechtigungen</span>
                  </TableCell>
                  
                  <TableCell>
                    <span
                      className={`lyd-status ${role.isActive ? 'lyd-status-active' : 'lyd-status-inactive'}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-xs)',
                        fontSize: 'var(--font-size-sm)',
                        color: role.isActive ? 'var(--lyd-success)' : 'var(--lyd-error)'
                      }}
                    >
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: role.isActive ? 'var(--lyd-success)' : 'var(--lyd-error)'
                        }}
                      />
                      {role.isActive ? 'Aktiv' : 'Inaktiv'}
                    </span>
                  </TableCell>
                  
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => openPermissionModal(role)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 'var(--spacing-xs, 4px)' }}>
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                      </svg>
                      Berechtigungen
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Role Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Neue Rolle anlegen"
      >
        <div className="lyd-stack">
          <Input
            label="Rollen-Name (Key)"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '') }))}
            placeholder="admin, editor, viewer"
            helpText="Nur Kleinbuchstaben, Zahlen, Bindestriche und Unterstriche"
          />
          
          <Input
            label="Anzeige-Name"
            required
            value={formData.displayName}
            onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
            placeholder="Administrator, Editor, Betrachter"
          />
          
          <Input
            label="Beschreibung"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Beschreibung der Rolle..."
          />
          
          <div className="lyd-grid cols-2 gap-md">
            <Input
              label="Farbe"
              type="color"
              value={formData.color}
              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
            />
            
            <Select
              label="Vorlage verwenden"
              value={formData.usePreset}
              onChange={(e) => setFormData(prev => ({ ...prev, usePreset: e.target.value }))}
              options={[
                { value: '', label: 'Keine Vorlage' },
                ...Object.keys(ROLE_PRESETS).map(preset => ({
                  value: preset,
                  label: preset.charAt(0).toUpperCase() + preset.slice(1)
                }))
              ]}
              helpText="Startet mit vordefinierten Berechtigungen"
            />
          </div>

          <div className="lyd-row end gap-sm">
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
            >
              Abbrechen
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateRole}
              disabled={!formData.name || !formData.displayName}
            >
              Rolle anlegen
            </Button>
          </div>
        </div>
      </Modal>

      {/* Permission Matrix Modal */}
      <Modal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        title={`Berechtigungen: ${selectedRole?.displayName}`}
      >
        <div className="lyd-stack">
          <div className="lyd-text-secondary">
            Wählen Sie die Berechtigungen für diese Rolle aus.
          </div>
          
          {Object.entries(permissions).map(([module, modulePermissions]) => (
            <div key={module} className="lyd-card">
              <div className="lyd-card-header">
                <h3 className="lyd-heading-3">
                  {module.charAt(0).toUpperCase() + module.slice(1)}
                </h3>
              </div>
              <div className="lyd-card-body">
                <CheckboxGroup 
                  label={`${module.charAt(0).toUpperCase() + module.slice(1)} Berechtigungen`}
                >
                  <div className="lyd-grid cols-2 gap-sm">
                    {modulePermissions.map((permission) => (
                      <div
                        key={permission.id}
                        style={{
                          padding: 'var(--spacing-sm)',
                          border: '1px solid var(--lyd-border)',
                          borderRadius: 'var(--border-radius)',
                          backgroundColor: selectedPermissions.includes(permission.id) ? 'var(--lyd-accent)' : 'white'
                        }}
                      >
                        <Checkbox
                          label={permission.displayName}
                          helpText={permission.description}
                          checked={selectedPermissions.includes(permission.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPermissions(prev => [...prev, permission.id]);
                            } else {
                              setSelectedPermissions(prev => prev.filter(id => id !== permission.id));
                            }
                          }}
                        />
                        <div className="lyd-text-xs text-muted" style={{ marginTop: 'var(--spacing-xs)' }}>
                          {permission.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </CheckboxGroup>
              </div>
            </div>
          ))}

          <div className="lyd-row end gap-sm">
            <Button
              variant="outline"
              onClick={() => setShowPermissionModal(false)}
            >
              Abbrechen
            </Button>
            <Button
              variant="primary"
              onClick={handleUpdatePermissions}
            >
              Berechtigungen speichern
            </Button>
          </div>
        </div>
      </Modal>

      {/* Error Toast */}
      {error && (
        <div 
          className="lyd-alert lyd-alert-error"
          style={{
            position: 'fixed',
            top: 'var(--spacing-lg)',
            right: 'var(--spacing-lg)',
            zIndex: 1000,
            maxWidth: '400px'
          }}
        >
          <div>{error}</div>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
    </div>
  );
}
