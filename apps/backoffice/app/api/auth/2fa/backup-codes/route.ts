import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import * as speakeasy from 'speakeasy';
import * as bcrypt from 'bcryptjs';

/**
 * 2FA Backup Codes Endpoint
 * 
 * POST /api/auth/2fa/backup-codes
 * 
 * Generates new backup codes, replacing existing ones.
 * Requires TOTP verification for security.
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
        { error: 'Authentication token is required to regenerate backup codes' },
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

    // Get user with 2FA data
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { 
        id: true, 
        email: true, 
        totpSecret: true,
        totpEnabled: true,
        totpBackupCodes: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.totpEnabled) {
      return NextResponse.json(
        { error: '2FA must be enabled to generate backup codes' },
        { status: 400 }
      );
    }

    if (!user.totpSecret) {
      return NextResponse.json(
        { error: 'No 2FA secret found' },
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

    // Generate new backup codes
    const newBackupCodes = generateBackupCodes();
    const hashedBackupCodes = await Promise.all(
      newBackupCodes.map(code => bcrypt.hash(code, 12))
    );

    // Save new backup codes
    await prisma.user.update({
      where: { id: user.id },
      data: {
        totpBackupCodes: hashedBackupCodes
      }
    });

    const oldCodesCount = user.totpBackupCodes 
      ? (user.totpBackupCodes as string[]).length 
      : 0;

    return NextResponse.json({
      success: true,
      backupCodes: newBackupCodes,
      message: 'New backup codes generated successfully',
      warning: 'Save these backup codes in a secure location. Your old backup codes are no longer valid.',
      stats: {
        newCodes: newBackupCodes.length,
        oldCodes: oldCodesCount,
        replaced: oldCodesCount > 0
      }
    });

  } catch (error) {
    console.error('Backup Codes Generation Error:', error);
    return NextResponse.json(
      { error: 'Internal server error during backup codes generation' },
      { status: 500 }
    );
  }
}

/**
 * Get backup codes status
 * 
 * GET /api/auth/2fa/backup-codes
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { 
        totpEnabled: true,
        totpBackupCodes: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.totpEnabled) {
      return NextResponse.json(
        { error: '2FA is not enabled' },
        { status: 400 }
      );
    }

    const backupCodesCount = user.totpBackupCodes 
      ? (user.totpBackupCodes as string[]).length 
      : 0;

    return NextResponse.json({
      count: backupCodesCount,
      hasBackupCodes: backupCodesCount > 0,
      status: backupCodesCount === 0 ? 'none' : 
              backupCodesCount <= 3 ? 'low' : 'good'
    });

  } catch (error) {
    console.error('Backup Codes Status Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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
