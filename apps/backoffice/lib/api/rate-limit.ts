import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export const ratelimitIp = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, '1 m'),
  analytics: true
});

export const ratelimitAuth = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 m'),
  analytics: true
});
