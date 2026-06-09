import { Injectable } from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { IPrayerRequest } from 'src/domain/entities/prayer-request.entity';
import { PrayerRequestRepository } from 'src/domain/repositories/prayer-request.repository';
import { CacheKeys, CacheTTL } from 'src/infra/adapters/cache-key.util';

@Injectable()
export class GetAllPrayerRequestsUsecase {
  constructor(
    private readonly prayerRequestRepository: PrayerRequestRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(churchId: string): Promise<IPrayerRequest[]> {
    const cacheKey = CacheKeys.prayerRequests(churchId);
    const cached = await this.cache.get<IPrayerRequest[]>(cacheKey);
    if (cached) return cached;

    const data = await this.prayerRequestRepository.findAllByChurchId(churchId);
    await this.cache.set(cacheKey, data, CacheTTL.PRAYER_REQUESTS);
    return data;
  }
}
