import { Ratelimit } from '@upstash/ratelimit';

// Mock Redis for development if not configured
const createRedis = () => {
  if (!process.env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_URL.includes('localhost')) {
    // Development mock - simple in-memory rate limiting
    console.log('🔧 Using mock Redis for rate limiting (development)');
    return {
      get: async () => null,
      set: async () => 'OK',
      incr: async () => 1,
      expire: async () => 1,
      setex: async () => 'OK',
      eval: async () => [0, Date.now()], // Mock sliding window response
    };
  }
  
  const { Redis } = require('@upstash/redis');
  return Redis.fromEnv();
};

const redis = createRedis();

export const ratelimitIp = new Ratelimit({
  redis: redis as any,
  limiter: Ratelimit.slidingWindow(30, '1 m'),
  analytics: false // Disable in development
});

export const ratelimitAuth = new Ratelimit({
  redis: redis as any,
  limiter: Ratelimit.slidingWindow(100, '10 m'),
  analytics: false
});
