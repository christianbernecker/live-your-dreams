import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import * as speakeasy from 'speakeasy';
import * as bcrypt from 'bcryptjs';

/**
 * 2FA Enable Endpoint
 * 
 * POST /api/auth/2fa/enable
 * 
 * Verifies TOTP code and enables 2FA for the user.
 * Also generates backup codes.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { token } = body;

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'TOTP token is required' },
        { status: 400 }
      );
    }

    // Validate token format (6 digits)
    if (!/^\d{6}$/.test(token)) {
      return NextResponse.json(
        { error: 'Invalid token format. Please enter 6 digits.' },
        { status: 400 }
      );
    }

    // Get user with secret
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { 
        id: true, 
        email: true, 
        name: true, 
        totpSecret: true,
        totpEnabled: true 
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.totpEnabled) {
      return NextResponse.json(
        { error: '2FA is already enabled' },
        { status: 400 }
      );
    }

    if (!user.totpSecret) {
      return NextResponse.json(
        { error: 'No 2FA secret found. Please run setup first.' },
        { status: 400 }
      );
    }

    // Verify the TOTP token
    const verified = speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: 'base32',
      token: token,
      window: 2, // Allow 2 time steps (60 seconds) tolerance
      step: 30 // 30-second time step
    });

    if (!verified) {
      return NextResponse.json(
        { error: 'Invalid authentication code. Please try again.' },
        { status: 400 }
      );
    }

    // Generate backup codes
    const backupCodes = generateBackupCodes();
    const hashedBackupCodes = await Promise.all(
      backupCodes.map(code => bcrypt.hash(code, 12))
    );

    // Enable 2FA and save backup codes
    await prisma.user.update({
      where: { id: user.id },
      data: {
        totpEnabled: true,
        totpBackupCodes: hashedBackupCodes
      }
    });

    return NextResponse.json({
      success: true,
      message: '2FA has been successfully enabled',
      backupCodes: backupCodes,
      warning: 'Save these backup codes in a secure location. They can be used to access your account if you lose your authenticator device.'
    });

  } catch (error) {
    console.error('2FA Enable Error:', error);
    return NextResponse.json(
      { error: 'Internal server error during 2FA enable' },
      { status: 500 }
    );
  }
}

/**
 * Generate 10 random backup codes
 */
function generateBackupCodes(): string[] {
  const codes: string[] = [];
  
  for (let i = 0; i < 10; i++) {
    // Generate 8-character alphanumeric code
    const code = generateSecureCode(8);
    codes.push(code);
  }
  
  return codes;
}

/**
 * Generate a cryptographically secure random code
 */
function generateSecureCode(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  // Use crypto.getRandomValues for secure randomness
  const randomBytes = new Uint8Array(length);
  crypto.getRandomValues(randomBytes);
  
  for (let i = 0; i < length; i++) {
    result += chars[randomBytes[i] % chars.length];
  }
  
  return result;
}
