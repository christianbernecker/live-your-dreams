import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

/**
 * 2FA Setup Endpoint
 * 
 * POST /api/auth/2fa/setup
 * 
 * Generates a new TOTP secret and QR code for 2FA setup.
 * Does NOT enable 2FA until verification is completed.
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

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true, name: true, totpEnabled: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.totpEnabled) {
      return NextResponse.json(
        { error: '2FA is already enabled. Please disable first to regenerate.' },
        { status: 400 }
      );
    }

    // Generate a new TOTP secret
    const secret = speakeasy.generateSecret({
      name: user.email,
      issuer: 'LYD Live Your Dreams',
      length: 32
    });

    if (!secret.base32) {
      return NextResponse.json(
        { error: 'Failed to generate secret' },
        { status: 500 }
      );
    }

    // Generate QR code
    const otpauthUrl = `otpauth://totp/LYD%20Live%20Your%20Dreams:${encodeURIComponent(user.email)}?secret=${secret.base32}&issuer=LYD%20Live%20Your%20Dreams&algorithm=SHA1&digits=6&period=30`;
    
    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 256
    });

    // Store the temporary secret (not yet enabled)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        totpSecret: secret.base32,
        totpEnabled: false // Keep disabled until verified
      }
    });

    // Return setup data
    return NextResponse.json({
      secret: secret.base32,
      qrCode: qrCodeDataUrl,
      manualEntryKey: secret.base32,
      setupUrl: otpauthUrl,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      instructions: {
        step1: 'Install an authenticator app like Google Authenticator, Authy, or 1Password',
        step2: 'Scan the QR code or manually enter the secret key',
        step3: 'Enter the 6-digit code from your app to verify setup'
      }
    });

  } catch (error) {
    console.error('2FA Setup Error:', error);
    return NextResponse.json(
      { error: 'Internal server error during 2FA setup' },
      { status: 500 }
    );
  }
}

/**
 * Get current 2FA status
 * 
 * GET /api/auth/2fa/setup
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
        id: true, 
        email: true, 
        name: true, 
        totpEnabled: true,
        totpSecret: true 
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      enabled: user.totpEnabled,
      hasSecret: !!user.totpSecret,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('2FA Status Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
