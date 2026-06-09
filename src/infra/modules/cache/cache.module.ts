import { Global, Logger, Module } from '@nestjs/common';
import { Redis } from 'ioredis';
import { CacheAdapter } from '../../../domain/adapter/cache.adapter';
import { RedisCacheAdapter } from '../../adapters/redis-cache.adapter';

const logger = new Logger('CacheModule');

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const redis = new Redis(
          process.env.REDIS_URL ?? 'redis://localhost:6379',
          {
            lazyConnect: true,
            maxRetriesPerRequest: 1,
            enableOfflineQueue: false,
            connectTimeout: 5000,
            retryStrategy: (times) => Math.min(times * 500, 30000),
          },
        );

        let errorLogged = false;

        redis.on('connect', () => {
          errorLogged = false;
          logger.log('Redis connected');
        });
        redis.on('error', (err) => {
          if (!errorLogged) {
            logger.warn(
              `Redis unavailable: ${err.message}. Retrying in background...`,
            );
            errorLogged = true;
          }
        });
        redis.on('close', () => logger.warn('Redis connection closed'));

        redis
          .connect()
          .catch((err: Error) =>
            logger.warn(`Redis initial connect failed: ${err.message}`),
          );

        return redis;
      },
    },
    {
      provide: CacheAdapter,
      useFactory: (redis: Redis) => new RedisCacheAdapter(redis),
      inject: ['REDIS_CLIENT'],
    },
  ],
  exports: [CacheAdapter],
})
export class CacheModule {}
