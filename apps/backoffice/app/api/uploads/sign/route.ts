import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { createUploadUrl } from '@/lib/storage/presign';

const UploadRequestSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(3),
  md5: z.string().min(10)
});

const sanitizeFileName = (name: string) =>
  name.toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 120);

export async function POST(req: NextRequest) {
  const json = await req.json();
  const validation = UploadRequestSchema.safeParse(json);
  
  if (!validation.success) {
    return NextResponse.json(
      { errors: validation.error.format() },
      { status: 400 }
    );
  }
  
  const { fileName, contentType, md5 } = validation.data;
  
  // Create folder structure by date
  const date = new Date();
  const folder = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  
  // Generate unique key
  const key = `uploads/${folder}/${randomUUID()}-${sanitizeFileName(fileName)}`;
  
  try {
    const result = await createUploadUrl({ key, type: contentType, md5 });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to create upload URL:', error);
    return NextResponse.json(
      { error: 'Failed to create upload URL' },
      { status: 500 }
    );
  }
}
