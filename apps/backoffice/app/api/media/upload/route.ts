import { auth } from '@/lib/nextauth';
import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import sharp from 'sharp';

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

    // Validate file type - accept common image formats
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB original)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size: 5MB' },
        { status: 400 }
      );
    }

    // SERVER-SIDE WebP TRANSFORMATION (transparent für User)
    // Client kann optional pre-transform, Server garantiert WebP-Output
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let webpBuffer: Buffer;
    let wasTransformed = false;

    if (file.type === 'image/webp') {
      // Bereits WebP - direkt verwenden
      webpBuffer = buffer;
    } else {
      // Transformiere zu WebP (Sharp - serverseitig)
      console.log(`🔄 Transforming ${file.type} to WebP...`);
      webpBuffer = await sharp(buffer)
        .webp({ quality: 85, effort: 4 })
        .toBuffer();
      wasTransformed = true;
      console.log(`✅ Transformed: ${(buffer.length / 1024 / 1024).toFixed(2)}MB → ${(webpBuffer.length / 1024 / 1024).toFixed(2)}MB WebP`);
    }

    // Generate unique filename with .webp extension
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '').replace(/[^a-z0-9.-]/gi, '-').toLowerCase();
    const filename = `blog/${timestamp}-${sanitizedName}.webp`;

    // Check if BLOB_READ_WRITE_TOKEN exists
    const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;

    if (hasBlobToken) {
      // Production: Upload to Vercel Blob
      const blob = await put(filename, webpBuffer, {
        access: 'public',
        addRandomSuffix: true,
        contentType: 'image/webp',
      });

      return NextResponse.json({
        success: true,
        url: blob.url,
        pathname: blob.pathname,
        size: webpBuffer.length,
        originalSize: file.size,
        type: 'image/webp',
        originalType: file.type,
        wasTransformed,
        storage: 'vercel-blob'
      });
    } else {
      // Development Fallback: Save to local filesystem
      console.warn('⚠️  BLOB_READ_WRITE_TOKEN not found. Using local filesystem fallback.');
      console.warn('📝 See BLOB_SETUP.md for production setup instructions.');

      // Erstelle uploads Verzeichnis
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'blog');
      await mkdir(uploadsDir, { recursive: true });

      // Speichere WebP-Datei lokal
      const localPath = join(uploadsDir, `${timestamp}-${sanitizedName}.webp`);
      await writeFile(localPath, webpBuffer);

      // Erstelle Public URL
      const publicUrl = `/uploads/blog/${timestamp}-${sanitizedName}.webp`;

      return NextResponse.json({
        success: true,
        url: publicUrl,
        pathname: `${timestamp}-${sanitizedName}.webp`,
        size: webpBuffer.length,
        originalSize: file.size,
        type: 'image/webp',
        originalType: file.type,
        wasTransformed,
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