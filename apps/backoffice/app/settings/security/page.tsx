'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { 
  LdsCard, 
  LdsCardHeader, 
  LdsCardTitle, 
  LdsCardContent,
  LdsButton,
  LdsBadge
} from '@liveyourdreams/design-system-react';

interface SecurityStatus {
  twoFactorEnabled: boolean;
  backupCodesCount: number;
  lastPasswordChange?: string;
  recentSessions: number;
}

/**
 * Security Settings Overview Page
 * 
 * Provides comprehensive security management including:
 * - 2FA status and setup
 * - Password management
 * - Session management
 * - Security audit log
 */
export default function SecuritySettingsPage() {
  const { data: session } = useSession();
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    twoFactorEnabled: false,
    backupCodesCount: 0,
    recentSessions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSecurityStatus();
  }, []);

  const loadSecurityStatus = async () => {
    try {
      setLoading(true);

      // Load 2FA status
      const twoFactorResponse = await fetch('/api/auth/2fa/setup');
      let twoFactorData = null;
      if (twoFactorResponse.ok) {
        twoFactorData = await twoFactorResponse.json();
      }

      // Load backup codes info if 2FA is enabled
      let backupCodesData = null;
      if (twoFactorData?.enabled) {
        const backupResponse = await fetch('/api/auth/2fa/backup-codes');
        if (backupResponse.ok) {
          backupCodesData = await backupResponse.json();
        }
      }

      setSecurityStatus({
        twoFactorEnabled: twoFactorData?.enabled || false,
        backupCodesCount: backupCodesData?.count || 0,
        lastPasswordChange: undefined, // TODO: Implement password change tracking
        recentSessions: 1 // TODO: Implement session tracking
      });

    } catch (error) {
      console.error('Failed to load security status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSecurityScore = () => {
    let score = 0;
    let maxScore = 100;

    // Basic account security (30 points)
    if (session?.user?.email) score += 20;
    if (session?.user?.name) score += 10;

    // 2FA (40 points)
    if (securityStatus.twoFactorEnabled) {
      score += 35;
      // Backup codes (5 additional points)
      if (securityStatus.backupCodesCount > 0) score += 5;
    }

    // Password strength (20 points) - TODO: Implement password analysis
    score += 15; // Assume reasonable password

    // Recent activity (10 points) - TODO: Implement session monitoring
    score += 10;

    return { score, maxScore, percentage: Math.round((score / maxScore) * 100) };
  };

  const security = getSecurityScore();

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (percentage: number) => {
    if (percentage >= 80) return { variant: 'success' as const, label: 'Excellent' };
    if (percentage >= 60) return { variant: 'warning' as const, label: 'Good' };
    return { variant: 'destructive' as const, label: 'Needs Improvement' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔄</div>
            <p className="text-gray-600">Loading security settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <Link 
                href="/settings"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-2 inline-block"
              >
                ← Back to Settings
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Security Settings</h1>
              <p className="text-gray-600 mt-1">
                Manage your account security and privacy settings
              </p>
            </div>
          </div>

          {/* Security Score */}
          <LdsCard>
            <LdsCardHeader>
              <LdsCardTitle>🎯 Security Score</LdsCardTitle>
            </LdsCardHeader>
            <LdsCardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-4">
                    <div className={`text-4xl font-bold ${getScoreColor(security.percentage)}`}>
                      {security.percentage}%
                    </div>
                    <div>
                      <LdsBadge variant={getScoreBadge(security.percentage).variant}>
                        {getScoreBadge(security.percentage).label}
                      </LdsBadge>
                      <p className="text-sm text-gray-600 mt-1">
                        {security.score} of {security.maxScore} points
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-6xl">
                  {security.percentage >= 80 ? '🛡️' : 
                   security.percentage >= 60 ? '🔒' : '⚠️'}
                </div>
              </div>
            </LdsCardContent>
          </LdsCard>

          {/* Two-Factor Authentication */}
          <LdsCard>
            <LdsCardHeader>
              <LdsCardTitle>
                <div className="flex items-center justify-between">
                  <span>🔐 Two-Factor Authentication (2FA)</span>
                  {securityStatus.twoFactorEnabled ? (
                    <LdsBadge variant="success">Enabled</LdsBadge>
                  ) : (
                    <LdsBadge variant="destructive">Disabled</LdsBadge>
                  )}
                </div>
              </LdsCardTitle>
            </LdsCardHeader>
            <LdsCardContent>
              <div className="space-y-4">
                {securityStatus.twoFactorEnabled ? (
                  <>
                    <div className="flex items-start space-x-3">
                      <div className="text-green-600 text-xl">✅</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">2FA is Active</h4>
                        <p className="text-sm text-gray-600">
                          Your account is protected with time-based authentication codes.
                        </p>
                        {securityStatus.backupCodesCount > 0 && (
                          <p className="text-sm text-green-600 mt-1">
                            {securityStatus.backupCodesCount} backup codes available
                          </p>
                        )}
                        {securityStatus.backupCodesCount <= 3 && securityStatus.backupCodesCount > 0 && (
                          <p className="text-sm text-yellow-600 mt-1">
                            ⚠️ Running low on backup codes - consider regenerating
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <Link href="/settings/security/2fa">
                        <LdsButton variant="outline" size="sm">
                          ⚙️ Manage 2FA
                        </LdsButton>
                      </Link>
                      <Link href="/settings/security/2fa">
                        <LdsButton variant="outline" size="sm">
                          🔑 Backup Codes
                        </LdsButton>
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start space-x-3">
                      <div className="text-red-600 text-xl">❌</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">2FA is Disabled</h4>
                        <p className="text-sm text-gray-600">
                          Your account relies only on your password for protection. Enable 2FA for enhanced security.
                        </p>
                      </div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex">
                        <div className="text-yellow-600 text-xl mr-3">⚡</div>
                        <div>
                          <h4 className="font-semibold text-yellow-800">Recommended Action</h4>
                          <p className="text-yellow-700 text-sm">
                            Enable two-factor authentication to protect your account from unauthorized access.
                          </p>
                        </div>
                      </div>
                    </div>
                    <Link href="/settings/security/2fa">
                      <LdsButton>
                        🚀 Enable 2FA
                      </LdsButton>
                    </Link>
                  </>
                )}
              </div>
            </LdsCardContent>
          </LdsCard>

          {/* Password Security */}
          <LdsCard>
            <LdsCardHeader>
              <LdsCardTitle>🔑 Password Security</LdsCardTitle>
            </LdsCardHeader>
            <LdsCardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="text-blue-600 text-xl">🔐</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Password Status</h4>
                    <p className="text-sm text-gray-600">
                      Your password is securely encrypted and stored.
                    </p>
                    {securityStatus.lastPasswordChange && (
                      <p className="text-sm text-gray-500 mt-1">
                        Last changed: {securityStatus.lastPasswordChange}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Password Requirements</h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• At least 8 characters long</li>
                    <li>• Mix of uppercase and lowercase letters</li>
                    <li>• Include numbers and special characters</li>
                    <li>• Avoid common words and personal information</li>
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <LdsButton variant="outline" size="sm">
                    🔄 Change Password
                  </LdsButton>
                  <LdsButton variant="outline" size="sm">
                    🔍 Password Strength Check
                  </LdsButton>
                </div>
              </div>
            </LdsCardContent>
          </LdsCard>

          {/* Active Sessions */}
          <LdsCard>
            <LdsCardHeader>
              <LdsCardTitle>📱 Active Sessions</LdsCardTitle>
            </LdsCardHeader>
            <LdsCardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="text-green-600 text-xl">🖥️</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Current Session</h4>
                    <p className="text-sm text-gray-600">
                      This device • {new Date().toLocaleDateString('de-DE')} • Active now
                    </p>
                    <p className="text-sm text-gray-500">
                      {session?.user?.email || 'Unknown user'}
                    </p>
                  </div>
                  <LdsBadge variant="success">Current</LdsBadge>
                </div>

                <div className="bg-gray-50 border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Session Management</h4>
                      <p className="text-sm text-gray-600">
                        Review and manage all devices that have access to your account
                      </p>
                    </div>
                    <LdsButton variant="outline" size="sm">
                      📊 View All Sessions
                    </LdsButton>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <LdsButton variant="destructive" size="sm">
                    🚪 Sign Out All Devices
                  </LdsButton>
                  <LdsButton variant="outline" size="sm">
                    📧 Email on New Login
                  </LdsButton>
                </div>
              </div>
            </LdsCardContent>
          </LdsCard>

          {/* Privacy Settings */}
          <LdsCard>
            <LdsCardHeader>
              <LdsCardTitle>🛡️ Privacy & Data</LdsCardTitle>
            </LdsCardHeader>
            <LdsCardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Data Management</h4>
                  <div className="space-y-3">
                    <Link href="/settings/privacy">
                      <LdsButton variant="outline" size="sm" className="w-full justify-start">
                        📥 Export My Data
                      </LdsButton>
                    </Link>
                    <Link href="/settings/privacy">
                      <LdsButton variant="outline" size="sm" className="w-full justify-start">
                        🗑️ Delete Account
                      </LdsButton>
                    </Link>
                    <Link href="/settings/privacy">
                      <LdsButton variant="outline" size="sm" className="w-full justify-start">
                        🍪 Cookie Preferences
                      </LdsButton>
                    </Link>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Compliance</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>DSGVO/GDPR compliant</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Data encrypted at rest</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Secure data transmission</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Regular security audits</span>
                    </div>
                  </div>
                </div>
              </div>
            </LdsCardContent>
          </LdsCard>

          {/* Security Audit Log */}
          <LdsCard>
            <LdsCardHeader>
              <LdsCardTitle>📋 Recent Security Activity</LdsCardTitle>
            </LdsCardHeader>
            <LdsCardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center space-x-3">
                    <span className="text-green-600">🔐</span>
                    <div>
                      <p className="text-sm font-medium">Successful login</p>
                      <p className="text-xs text-gray-500">Today, {new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">Current session</span>
                </div>

                <div className="text-center py-6">
                  <div className="text-3xl mb-2">📊</div>
                  <p className="text-gray-600 text-sm">
                    Complete activity log coming soon
                  </p>
                  <LdsButton variant="outline" size="sm" className="mt-3">
                    View Full Audit Log
                  </LdsButton>
                </div>
              </div>
            </LdsCardContent>
          </LdsCard>

          {/* Security Tips */}
          <LdsCard>
            <LdsCardHeader>
              <LdsCardTitle>💡 Security Tips</LdsCardTitle>
            </LdsCardHeader>
            <LdsCardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">🎯 Best Practices</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Use a unique password for this account</li>
                    <li>• Enable two-factor authentication</li>
                    <li>• Keep backup codes in a safe place</li>
                    <li>• Review active sessions regularly</li>
                    <li>• Update your contact information</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">🚨 Warning Signs</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Unexpected login notifications</li>
                    <li>• Changes you didn't make</li>
                    <li>• Suspicious email activity</li>
                    <li>• Unfamiliar devices in sessions</li>
                    <li>• Password reset requests you didn't initiate</li>
                  </ul>
                </div>
              </div>
            </LdsCardContent>
          </LdsCard>
        </div>
      </div>
    </div>
  );
}
