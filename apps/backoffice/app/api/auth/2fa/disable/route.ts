import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';

/**
 * 2FA Disable Endpoint
 * 
 * POST /api/auth/2fa/disable
 * 
 * Disables 2FA for the user after password confirmation.
 * Removes TOTP secret and backup codes.
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
    const { password, confirmDisable = false } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Current password is required to disable 2FA' },
        { status: 400 }
      );
    }

    if (!confirmDisable) {
      return NextResponse.json(
        { error: 'Please confirm that you want to disable 2FA' },
        { status: 400 }
      );
    }

    // Get user with password hash
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { 
        id: true, 
        email: true, 
        password: true,
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

    if (!user.totpEnabled) {
      return NextResponse.json(
        { error: '2FA is not currently enabled' },
        { status: 400 }
      );
    }

    if (!user.password) {
      return NextResponse.json(
        { error: 'Password verification not available for this account' },
        { status: 400 }
      );
    }

    // Verify current password
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Incorrect password. Please try again.' },
        { status: 400 }
      );
    }

    // Disable 2FA and remove all related data
    await prisma.user.update({
      where: { id: user.id },
      data: {
        totpEnabled: false,
        totpSecret: null,
        totpBackupCodes: null
      }
    });

    return NextResponse.json({
      success: true,
      message: '2FA has been successfully disabled',
      warning: 'Your account is now less secure. Consider re-enabling 2FA for better protection.'
    });

  } catch (error) {
    console.error('2FA Disable Error:', error);
    return NextResponse.json(
      { error: 'Internal server error during 2FA disable' },
      { status: 500 }
    );
  }
}
