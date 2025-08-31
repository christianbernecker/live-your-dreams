import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const endpoint = process.env.S3_ENDPOINT;
const region = process.env.S3_REGION || 'eu-central-1';

const client = new S3Client({
  region,
  endpoint,
  forcePathStyle: Boolean(endpoint),
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || ''
  }
});

export async function createUploadUrl({ 
  key, 
  type, 
  md5 
}: { 
  key: string; 
  type: string; 
  md5: string; 
}) {
  const Bucket = process.env.S3_BUCKET!;
  const command = new PutObjectCommand({
    Bucket,
    Key: key,
    ContentType: type,
    ContentMD5: md5,
    ACL: 'private'
  });
  
  const url = await getSignedUrl(client, command, { expiresIn: 60 });
  return { url, key };
}
