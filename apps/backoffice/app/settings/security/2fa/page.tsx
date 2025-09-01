'use client';

import React from 'react';
import { TwoFactorSetup } from '@/components/auth/TwoFactorSetup';
import Link from 'next/link';
import { 
  LdsCard, 
  LdsCardHeader, 
  LdsCardTitle, 
  LdsCardContent,
  LdsButton
} from '@liveyourdreams/design-system-react';

/**
 * 2FA Settings Page
 * 
 * Dedicated page for managing two-factor authentication settings.
 * Accessible from the main security settings.
 */
export default function TwoFactorAuthPage() {
  const handleSetupComplete = () => {
    // Optional: Show success notification or redirect
    console.log('2FA setup completed successfully');
  };

  const handleSetupCancel = () => {
    // Optional: Redirect back to security settings
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <Link 
                href="/settings/security"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-2 inline-block"
              >
                ← Back to Security Settings
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                Two-Factor Authentication
              </h1>
              <p className="text-gray-600 mt-1">
                Enhance your account security with an additional authentication layer
              </p>
            </div>
          </div>

          {/* Security Info */}
          <LdsCard>
            <LdsCardHeader>
              <LdsCardTitle>🔐 About Two-Factor Authentication</LdsCardTitle>
            </LdsCardHeader>
            <LdsCardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">How it Works</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Something you know (password)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Something you have (phone/authenticator app)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Time-based codes that change every 30 seconds</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Backup codes for emergency access</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Supported Apps</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <span className="w-8 h-8 bg-gray-100 rounded mr-3 flex items-center justify-center text-xs">📱</span>
                      <span>Google Authenticator (Free)</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-8 h-8 bg-gray-100 rounded mr-3 flex items-center justify-center text-xs">🔐</span>
                      <span>Authy (Multi-device sync)</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-8 h-8 bg-gray-100 rounded mr-3 flex items-center justify-center text-xs">🗝️</span>
                      <span>1Password (Premium)</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-8 h-8 bg-gray-100 rounded mr-3 flex items-center justify-center text-xs">🔒</span>
                      <span>Bitwarden (Open source)</span>
                    </div>
                  </div>
                </div>
              </div>
            </LdsCardContent>
          </LdsCard>

          {/* 2FA Setup Component */}
          <TwoFactorSetup
            onSetupComplete={handleSetupComplete}
            onSetupCancel={handleSetupCancel}
          />

          {/* Security Best Practices */}
          <LdsCard>
            <LdsCardHeader>
              <LdsCardTitle>🛡️ Security Best Practices</LdsCardTitle>
            </LdsCardHeader>
            <LdsCardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">🔑 Backup Codes</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Save backup codes in a secure password manager</li>
                    <li>• Print them and store in a safe place</li>
                    <li>• Each code can only be used once</li>
                    <li>• Generate new codes if you use several</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">📱 Device Security</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Keep your phone's OS updated</li>
                    <li>• Use a PIN/biometric lock on your device</li>
                    <li>• Consider multi-device authenticator apps</li>
                    <li>• Don't screenshot authentication codes</li>
                  </ul>
                </div>
              </div>
            </LdsCardContent>
          </LdsCard>

          {/* Emergency Access */}
          <LdsCard>
            <LdsCardHeader>
              <LdsCardTitle>🆘 Emergency Access</LdsCardTitle>
            </LdsCardHeader>
            <LdsCardContent>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="text-yellow-600 text-xl mr-3">⚠️</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-yellow-800 mb-2">
                      Lost Access to Your Device?
                    </h4>
                    <p className="text-yellow-700 text-sm mb-4">
                      If you lose access to your authenticator app, you can still log in using:
                    </p>
                    <ul className="text-yellow-700 text-sm space-y-1 mb-4">
                      <li>• Backup codes (if you saved them)</li>
                      <li>• Contact support with identity verification</li>
                      <li>• Account recovery through email (if configured)</li>
                    </ul>
                    <div className="flex space-x-2">
                      <LdsButton 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open('mailto:support@liveyourdreams.online?subject=2FA Account Recovery')}
                      >
                        📧 Contact Support
                      </LdsButton>
                      <LdsButton 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open('/help/2fa-recovery', '_blank')}
                      >
                        📖 Recovery Guide
                      </LdsButton>
                    </div>
                  </div>
                </div>
              </div>
            </LdsCardContent>
          </LdsCard>
        </div>
      </div>
    </div>
  );
}
