import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import * as speakeasy from 'speakeasy';
import * as bcrypt from 'bcryptjs';

/**
 * 2FA Verification Endpoint
 * 
 * POST /api/auth/2fa/verify
 * 
 * Verifies TOTP codes or backup codes.
 * Used during login and for testing 2FA setup.
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
    const { token, isBackupCode = false } = body;

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Authentication token is required' },
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
        { error: '2FA is not enabled for this account' },
        { status: 400 }
      );
    }

    let verified = false;
    let usedBackupCode = false;

    if (isBackupCode) {
      // Verify backup code
      verified = await verifyBackupCode(user, token);
      usedBackupCode = verified;
    } else {
      // Verify TOTP token
      verified = await verifyTotpToken(user, token);
    }

    if (!verified) {
      return NextResponse.json(
        { error: 'Invalid authentication code. Please try again.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true,
      usedBackupCode,
      message: usedBackupCode 
        ? 'Backup code verified successfully' 
        : 'Authentication code verified successfully'
    });

  } catch (error) {
    console.error('2FA Verify Error:', error);
    return NextResponse.json(
      { error: 'Internal server error during 2FA verification' },
      { status: 500 }
    );
  }
}

/**
 * Verify TOTP token
 */
async function verifyTotpToken(user: any, token: string): Promise<boolean> {
  if (!user.totpSecret) {
    return false;
  }

  // Validate token format (6 digits)
  if (!/^\d{6}$/.test(token)) {
    return false;
  }

  return speakeasy.totp.verify({
    secret: user.totpSecret,
    encoding: 'base32',
    token: token,
    window: 2, // Allow 2 time steps (60 seconds) tolerance
    step: 30 // 30-second time step
  });
}

/**
 * Verify and consume backup code
 */
async function verifyBackupCode(user: any, code: string): Promise<boolean> {
  if (!user.totpBackupCodes || !Array.isArray(user.totpBackupCodes)) {
    return false;
  }

  const normalizedCode = code.toUpperCase().replace(/\s/g, '');
  
  // Find matching backup code
  const backupCodes = user.totpBackupCodes as string[];
  let matchedIndex = -1;
  
  for (let i = 0; i < backupCodes.length; i++) {
    const isMatch = await bcrypt.compare(normalizedCode, backupCodes[i]);
    if (isMatch) {
      matchedIndex = i;
      break;
    }
  }

  if (matchedIndex === -1) {
    return false;
  }

  // Remove the used backup code
  const remainingCodes = backupCodes.filter((_, index) => index !== matchedIndex);
  
  await prisma.user.update({
    where: { id: user.id },
    data: {
      totpBackupCodes: remainingCodes
    }
  });

  return true;
}

/**
 * Test endpoint for 2FA verification (without consuming backup codes)
 * 
 * POST /api/auth/2fa/verify?test=true
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

    const backupCodesCount = user.totpBackupCodes 
      ? (user.totpBackupCodes as string[]).length 
      : 0;

    return NextResponse.json({
      totpEnabled: user.totpEnabled,
      backupCodesRemaining: backupCodesCount
    });

  } catch (error) {
    console.error('2FA Status Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
