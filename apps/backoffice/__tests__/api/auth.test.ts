import { POST } from '@/app/api/auth/[...nextauth]/route';
import { NextRequest } from 'next/server';

describe('Authentication', () => {
  it('should handle credentials provider', async () => {
    const formData = new FormData();
    formData.append('email', 'admin@liveyourdreams.online');
    formData.append('password', 'admin123');
    
    const request = new NextRequest('http://localhost:3000/api/auth/callback/credentials', {
      method: 'POST',
      body: formData
    });
    
    const response = await POST(request, { params: { nextauth: ['callback', 'credentials'] } });
    
    // Should not return 404 (endpoint exists)
    expect(response.status).not.toBe(404);
  });
});
