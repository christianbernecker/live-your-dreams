import { GET } from '@/app/api/health/route';
import { NextRequest } from 'next/server';

describe('/api/health', () => {
  it('should return 200 with health status', async () => {
    const request = new NextRequest('http://localhost:3000/api/health');
    const response = await GET(request);
    
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toEqual({
      status: 'healthy',
      timestamp: expect.any(String),
      services: {
        database: 'connected',
        redis: 'connected'
      }
    });
  });

  it('should have correct response headers', async () => {
    const request = new NextRequest('http://localhost:3000/api/health');
    const response = await GET(request);
    
    expect(response.headers.get('content-type')).toContain('application/json');
  });
});
