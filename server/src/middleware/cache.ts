import { Request, Response, NextFunction } from 'express';
import redis from 'redis';
import { env } from '../config/env';

const redisClient = redis.createClient({
  url: env.redisUrl || 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

redisClient.connect().catch(console.error);

export { redisClient };

// Cache middleware factory accepting a TTL (in seconds)
export const cacheMiddleware = (ttl: number) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const key = `__express__${req.originalUrl || req.url}`;

    try {
      const cachedData = await redisClient.get(key);
      if (cachedData) {
        console.log(`Cache hit for key: ${key}`);
        res.json(JSON.parse(cachedData));
        return;
      }
    } catch (error) {
      console.error('Error retrieving from Redis cache:', error);
    }

    // Override res.json to cache the response before sending it
    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      // Set cache asynchronously without awaiting it
      redisClient.setEx(key, ttl, JSON.stringify(body))
        .catch(err => console.error('Error setting Redis cache:', err));
      return originalJson(body);
    };

    next();
  };
};
