import { auth } from '@/lib/nextauth';
import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

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

    // Validate file type (akzeptiere auch WebP von Client-Transformation)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' },
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
 * Deletes an image from Vercel Blob Storage
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

    // Delete from Vercel Blob (requires @vercel/blob del function)
    const { del } = await import('@vercel/blob');
    await del(url);

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Delete failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}