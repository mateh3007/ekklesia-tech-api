import { Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { CacheAdapter } from '../../domain/adapter/cache.adapter';

export class RedisCacheAdapter extends CacheAdapter {
    private readonly logger = new Logger(RedisCacheAdapter.name);

    constructor(private readonly redis: Redis) {
        super();
    }

    async get<T>(key: string): Promise<T | null> {
        try {
            const data = await this.redis.get(key);
            if (!data) return null;
            this.logger.log(`[HIT] ${key}`);
            return JSON.parse(data) as T;
        } catch {
            return null;
        }
    }

    async set<T>(key: string, value: T, ttl = 300): Promise<void> {
        try {
            await this.redis.setex(key, ttl, JSON.stringify(value));
        } catch (err) {
            this.logger.warn(`Cache set failed for key "${key}": ${(err as Error).message}`);
        }
    }

    async delete(key: string): Promise<void> {
        try {
            await this.redis.del(key);
        } catch (err) {
            this.logger.warn(`Cache delete failed for key "${key}": ${(err as Error).message}`);
        }
    }

    async deleteByPattern(pattern: string): Promise<void> {
        try {
            let cursor = '0';
            do {
                const [next, keys] = await this.redis.scan(
                    cursor,
                    'MATCH',
                    pattern,
                    'COUNT',
                    100,
                );
                cursor = next;
                if (keys.length > 0) {
                    await this.redis.del(...keys);
                }
            } while (cursor !== '0');
        } catch (err) {
            this.logger.warn(`Cache deleteByPattern failed for "${pattern}": ${(err as Error).message}`);
        }
    }
}
