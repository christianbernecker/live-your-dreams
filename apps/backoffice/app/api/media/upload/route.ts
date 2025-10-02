import { auth } from '@/lib/nextauth';
import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/media/upload
 * Uploads an image to Vercel Blob Storage (or local filesystem in development)
 *
 * Body: FormData with 'file' field
 * Returns: { url: string, pathname: string }
 */
export async function POST(request: NextRequest) {
  try {
    // Authentication Check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get file from FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // CRITICAL: Enforce WebP-only storage (Codex Finding #1)
    // Reject non-WebP uploads - Client MUST transform to WebP before upload
    if (file.type !== 'image/webp') {
      console.error('❌ Non-WebP upload rejected:', file.type, file.name);
      return NextResponse.json(
        {
          error: 'Only WebP images allowed. Client must transform to WebP before upload.',
          received: file.type
        },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB original, aber WebP komprimiert sollte kleiner sein)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size: 5MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-z0-9.-]/gi, '-').toLowerCase();
    const filename = `blog/${timestamp}-${sanitizedName}`;

    // Check if BLOB_READ_WRITE_TOKEN exists
    const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;

    if (hasBlobToken) {
      // Production: Upload to Vercel Blob
      const blob = await put(filename, file, {
        access: 'public',
        addRandomSuffix: true,
      });

      return NextResponse.json({
        success: true,
        url: blob.url,
        pathname: blob.pathname,
        size: file.size,
        type: file.type,
        storage: 'vercel-blob'
      });
    } else {
      // Development Fallback: Save to local filesystem
      console.warn('⚠️  BLOB_READ_WRITE_TOKEN not found. Using local filesystem fallback.');
      console.warn('📝 See BLOB_SETUP.md for production setup instructions.');

      // Erstelle uploads Verzeichnis
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'blog');
      await mkdir(uploadsDir, { recursive: true });

      // Speichere Datei lokal
      const localFilename = `${timestamp}-${sanitizedName}`;
      const localPath = join(uploadsDir, localFilename);

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(localPath, buffer);

      // Erstelle Public URL
      const publicUrl = `/uploads/blog/${localFilename}`;

      return NextResponse.json({
        success: true,
        url: publicUrl,
        pathname: localFilename,
        size: file.size,
        type: file.type,
        storage: 'local-filesystem',
        warning: 'Using local filesystem. Configure BLOB_READ_WRITE_TOKEN for production.'
      });
    }

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/media/upload?url=...
 * Deletes an image from Vercel Blob Storage or local filesystem (Codex Finding #2)
 */
export async function DELETE(request: NextRequest) {
  try {
    // Authentication Check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'No URL provided' },
        { status: 400 }
      );
    }

    // Detect storage type: Local filesystem (starts with /) vs Vercel Blob (https://)
    const isLocalFile = url.startsWith('/uploads/');

    if (isLocalFile) {
      // Delete from local filesystem
      const localPath = join(process.cwd(), 'public', url);

      if (!existsSync(localPath)) {
        return NextResponse.json(
          { error: 'File not found', path: url },
          { status: 404 }
        );
      }

      await unlink(localPath);
      console.log('🗑️  Deleted local file:', url);

      return NextResponse.json({
        success: true,
        message: 'File deleted from local filesystem',
        storage: 'local-filesystem'
      });
    } else {
      // Delete from Vercel Blob
      const { del } = await import('@vercel/blob');
      await del(url);
      console.log('🗑️  Deleted blob file:', url);

      return NextResponse.json({
        success: true,
        message: 'File deleted from Vercel Blob',
        storage: 'vercel-blob'
      });
    }

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Delete failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}