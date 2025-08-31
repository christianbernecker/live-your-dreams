export async function GET() {
  const ok = { db: true, redis: true, s3: true };
  return new Response(JSON.stringify(ok), {
    headers: { 'content-type': 'application/json' }
  });
}
