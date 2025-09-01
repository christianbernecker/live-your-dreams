'use client';

import React, { useState, useEffect } from 'react';
import { 
  LdsCard, 
  LdsCardHeader, 
  LdsCardTitle, 
  LdsCardContent,
  LdsButton,
  LdsInput,
  LdsBadge,
  LdsDialog
} from '@liveyourdreams/design-system-react';

interface TwoFactorSetupProps {
  onSetupComplete?: () => void;
  onSetupCancel?: () => void;
}

interface SetupResponse {
  secret: string;
  qrCode: string;
  manualEntryKey: string;
  instructions: {
    step1: string;
    step2: string;
    step3: string;
  };
}

interface StatusResponse {
  enabled: boolean;
  hasSecret: boolean;
}

interface BackupCodesResponse {
  count: number;
  status: 'none' | 'low' | 'good';
  hasBackupCodes: boolean;
}

/**
 * Two-Factor Authentication Setup Component
 * 
 * Provides complete 2FA management:
 * - QR code generation and display
 * - TOTP verification
 * - Backup codes management
 * - Enable/disable functionality
 */
export function TwoFactorSetup({ onSetupComplete, onSetupCancel }: TwoFactorSetupProps) {
  // State management
  const [currentStep, setCurrentStep] = useState<'status' | 'setup' | 'verify' | 'backup' | 'manage'>('status');
  const [setupData, setSetupData] = useState<SetupResponse | null>(null);
  const [totpEnabled, setTotpEnabled] = useState(false);
  const [backupCodesInfo, setBackupCodesInfo] = useState<BackupCodesResponse | null>(null);
  const [verificationToken, setVerificationToken] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Disable dialog state
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');

  // Load initial status
  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/auth/2fa/setup');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load 2FA status');
      }

      setTotpEnabled(data.enabled);
      
      if (data.enabled) {
        setCurrentStep('manage');
        await loadBackupCodesInfo();
      } else {
        setCurrentStep('status');
      }

    } catch (err) {
      console.error('Status Load Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load 2FA status');
    } finally {
      setLoading(false);
    }
  };

  const loadBackupCodesInfo = async () => {
    try {
      const response = await fetch('/api/auth/2fa/backup-codes');
      if (response.ok) {
        const data = await response.json();
        setBackupCodesInfo(data);
      }
    } catch (err) {
      console.warn('Failed to load backup codes info:', err);
    }
  };

  const startSetup = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/auth/2fa/setup', { method: 'POST' });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start 2FA setup');
      }

      setSetupData(data);
      setCurrentStep('setup');

    } catch (err) {
      console.error('Setup Start Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to start 2FA setup');
    } finally {
      setLoading(false);
    }
  };

  const verifyAndEnable = async () => {
    if (!verificationToken.trim()) {
      setError('Please enter the 6-digit code from your authenticator app');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/auth/2fa/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: verificationToken.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify code');
      }

      setBackupCodes(data.backupCodes || []);
      setTotpEnabled(true);
      setCurrentStep('backup');
      onSetupComplete?.();

    } catch (err) {
      console.error('Verification Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  const regenerateBackupCodes = async () => {
    if (!verificationToken.trim()) {
      setError('Please enter your current authenticator code');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/auth/2fa/backup-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: verificationToken.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate backup codes');
      }

      setBackupCodes(data.backupCodes || []);
      setVerificationToken('');
      await loadBackupCodesInfo();

    } catch (err) {
      console.error('Backup Codes Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate backup codes');
    } finally {
      setLoading(false);
    }
  };

  const disable2FA = async () => {
    if (!disablePassword.trim()) {
      setError('Please enter your password');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          password: disablePassword.trim(),
          confirmDisable: true
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to disable 2FA');
      }

      setTotpEnabled(false);
      setShowDisableDialog(false);
      setDisablePassword('');
      setCurrentStep('status');

    } catch (err) {
      console.error('Disable 2FA Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to disable 2FA');
    } finally {
      setLoading(false);
    }
  };

  const downloadBackupCodes = () => {
    const content = `Live Your Dreams - 2FA Backup Codes\n\n${backupCodes.join('\n')}\n\nGenerated: ${new Date().toLocaleString('de-DE')}\n\nIMPORTANT:\n- Each code can only be used once\n- Store these codes in a secure location\n- Do not share these codes with anyone`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lyd-2fa-backup-codes-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Status/Initial view
  if (currentStep === 'status') {
    return (
      <LdsCard>
        <LdsCardHeader>
          <LdsCardTitle>🔐 Two-Factor Authentication (2FA)</LdsCardTitle>
        </LdsCardHeader>
        <LdsCardContent>
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                {error}
              </div>
            )}

            <div className="text-center py-8">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Secure Your Account
              </h3>
              <p className="text-gray-600 mb-6">
                Add an extra layer of security to your account with two-factor authentication.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl mb-2">📱</div>
                  <h4 className="font-medium">Install App</h4>
                  <p className="text-gray-600">Use Google Authenticator or similar</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl mb-2">📸</div>
                  <h4 className="font-medium">Scan QR Code</h4>
                  <p className="text-gray-600">Quick setup with your camera</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl mb-2">🔐</div>
                  <h4 className="font-medium">Enhanced Security</h4>
                  <p className="text-gray-600">Protect against unauthorized access</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <LdsButton 
                onClick={startSetup}
                disabled={loading}
                className="px-8 py-3"
              >
                {loading ? 'Loading...' : '🚀 Enable 2FA'}
              </LdsButton>
              {onSetupCancel && (
                <LdsButton 
                  variant="outline" 
                  onClick={onSetupCancel}
                  disabled={loading}
                >
                  Cancel
                </LdsButton>
              )}
            </div>
          </div>
        </LdsCardContent>
      </LdsCard>
    );
  }

  // Setup view with QR code
  if (currentStep === 'setup' && setupData) {
    return (
      <LdsCard>
        <LdsCardHeader>
          <LdsCardTitle>📱 Set Up Authenticator App</LdsCardTitle>
        </LdsCardHeader>
        <LdsCardContent>
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Scan QR Code</h3>
                <div className="bg-white p-4 rounded-lg border inline-block">
                  <img 
                    src={setupData.qrCode} 
                    alt="2FA QR Code" 
                    className="w-64 h-64"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Scan this with your authenticator app
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Manual Entry</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Secret Key:
                    </label>
                    <div className="bg-gray-100 p-3 rounded border font-mono text-sm break-all">
                      {setupData.manualEntryKey}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-2">
                    <p><strong>Account:</strong> {setupData.instructions.step1}</p>
                    <p><strong>Issuer:</strong> LYD Live Your Dreams</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="font-semibold mb-4">Next Steps:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>{setupData.instructions.step1}</li>
                <li>{setupData.instructions.step2}</li>
                <li>{setupData.instructions.step3}</li>
              </ol>
            </div>

            <div className="flex justify-center">
              <LdsButton onClick={() => setCurrentStep('verify')}>
                I've Added the Account → Next
              </LdsButton>
            </div>
          </div>
        </LdsCardContent>
      </LdsCard>
    );
  }

  // Verification step
  if (currentStep === 'verify') {
    return (
      <LdsCard>
        <LdsCardHeader>
          <LdsCardTitle>🔐 Verify Setup</LdsCardTitle>
        </LdsCardHeader>
        <LdsCardContent>
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                {error}
              </div>
            )}

            <div className="text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-lg font-semibold mb-2">
                Enter Verification Code
              </h3>
              <p className="text-gray-600 mb-6">
                Open your authenticator app and enter the 6-digit code for Live Your Dreams.
              </p>

              <div className="max-w-xs mx-auto">
                <LdsInput
                  type="text"
                  placeholder="000000"
                  value={verificationToken}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setVerificationToken(value);
                  }}
                  className="text-center text-2xl font-mono tracking-widest"
                  maxLength={6}
                  autoComplete="off"
                  inputMode="numeric"
                />
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                Enter the 6-digit code from your app
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              <LdsButton 
                variant="outline" 
                onClick={() => setCurrentStep('setup')}
                disabled={loading}
              >
                ← Back
              </LdsButton>
              <LdsButton 
                onClick={verifyAndEnable}
                disabled={loading || verificationToken.length !== 6}
              >
                {loading ? 'Verifying...' : 'Verify & Enable 2FA'}
              </LdsButton>
            </div>
          </div>
        </LdsCardContent>
      </LdsCard>
    );
  }

  // Backup codes display
  if (currentStep === 'backup' && backupCodes.length > 0) {
    return (
      <LdsCard>
        <LdsCardHeader>
          <LdsCardTitle>🔑 Save Your Backup Codes</LdsCardTitle>
        </LdsCardHeader>
        <LdsCardContent>
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <div className="text-yellow-600 text-xl mr-3">⚠️</div>
                <div>
                  <h4 className="font-semibold text-yellow-800">Important!</h4>
                  <p className="text-yellow-700 text-sm">
                    Save these backup codes in a secure location. You can use them to access your account if you lose your authenticator device.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Your Backup Codes:</h3>
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="bg-white p-2 rounded text-center">
                      {code}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <LdsButton 
                variant="outline" 
                onClick={downloadBackupCodes}
              >
                📥 Download Codes
              </LdsButton>
              <LdsButton onClick={() => setCurrentStep('manage')}>
                I've Saved These → Finish
              </LdsButton>
            </div>
          </div>
        </LdsCardContent>
      </LdsCard>
    );
  }

  // Management view (when 2FA is enabled)
  if (currentStep === 'manage' && totpEnabled) {
    return (
      <>
        <LdsCard>
          <LdsCardHeader>
            <LdsCardTitle>
              <div className="flex items-center justify-between">
                <span>🔐 Two-Factor Authentication</span>
                <LdsBadge variant="success">Enabled</LdsBadge>
              </div>
            </LdsCardTitle>
          </LdsCardHeader>
          <LdsCardContent>
            <div className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                  {error}
                </div>
              )}

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex">
                  <div className="text-green-600 text-xl mr-3">✅</div>
                  <div>
                    <h4 className="font-semibold text-green-800">2FA is Active</h4>
                    <p className="text-green-700 text-sm">
                      Your account is protected with two-factor authentication.
                    </p>
                  </div>
                </div>
              </div>

              {/* Backup Codes Status */}
              {backupCodesInfo && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">🔑 Backup Codes</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        {backupCodesInfo.count} backup codes available
                      </p>
                      {backupCodesInfo.status === 'low' && (
                        <p className="text-sm text-yellow-600">
                          ⚠️ Running low - consider regenerating
                        </p>
                      )}
                    </div>
                    <LdsBadge 
                      variant={
                        backupCodesInfo.status === 'good' ? 'success' :
                        backupCodesInfo.status === 'low' ? 'warning' : 'destructive'
                      }
                    >
                      {backupCodesInfo.status.toUpperCase()}
                    </LdsBadge>
                  </div>
                </div>
              )}

              {/* Regenerate Backup Codes */}
              <div className="border-t pt-6">
                <h4 className="font-semibold mb-4">Generate New Backup Codes</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Enter your current authenticator code to generate new backup codes.
                </p>
                <div className="flex space-x-4">
                  <div className="flex-1 max-w-xs">
                    <LdsInput
                      type="text"
                      placeholder="000000"
                      value={verificationToken}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setVerificationToken(value);
                      }}
                      className="text-center font-mono"
                      maxLength={6}
                      autoComplete="off"
                      inputMode="numeric"
                    />
                  </div>
                  <LdsButton 
                    variant="outline"
                    onClick={regenerateBackupCodes}
                    disabled={loading || verificationToken.length !== 6}
                  >
                    {loading ? 'Generating...' : 'Generate New Codes'}
                  </LdsButton>
                </div>
              </div>

              {/* Show new backup codes if generated */}
              {backupCodes.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">🆕 New Backup Codes Generated</h4>
                  <div className="bg-gray-100 p-3 rounded mb-4">
                    <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                      {backupCodes.map((code, index) => (
                        <div key={index} className="bg-white p-2 rounded text-center">
                          {code}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <LdsButton 
                      variant="outline" 
                      size="sm"
                      onClick={downloadBackupCodes}
                    >
                      📥 Download
                    </LdsButton>
                    <LdsButton 
                      variant="outline" 
                      size="sm"
                      onClick={() => setBackupCodes([])}
                    >
                      Hide Codes
                    </LdsButton>
                  </div>
                </div>
              )}

              {/* Disable 2FA */}
              <div className="border-t pt-6">
                <LdsButton 
                  variant="destructive"
                  onClick={() => setShowDisableDialog(true)}
                  disabled={loading}
                >
                  🚫 Disable 2FA
                </LdsButton>
              </div>
            </div>
          </LdsCardContent>
        </LdsCard>

        {/* Disable 2FA Dialog */}
        <LdsDialog
          open={showDisableDialog}
          onClose={() => setShowDisableDialog(false)}
          title="Disable Two-Factor Authentication"
        >
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="text-red-600 text-xl mr-3">⚠️</div>
                <div>
                  <h4 className="font-semibold text-red-800">Security Warning</h4>
                  <p className="text-red-700 text-sm">
                    Disabling 2FA will make your account less secure. Anyone with your password will be able to access your account.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter your current password to confirm:
              </label>
              <LdsInput
                type="password"
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                placeholder="Current password"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <LdsButton 
                variant="outline" 
                onClick={() => {
                  setShowDisableDialog(false);
                  setDisablePassword('');
                  setError('');
                }}
                disabled={loading}
              >
                Cancel
              </LdsButton>
              <LdsButton 
                variant="destructive"
                onClick={disable2FA}
                disabled={loading || !disablePassword.trim()}
              >
                {loading ? 'Disabling...' : 'Disable 2FA'}
              </LdsButton>
            </div>
          </div>
        </LdsDialog>
      </>
    );
  }

  return null;
}
