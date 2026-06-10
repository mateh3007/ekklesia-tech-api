import { Injectable } from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { IPrayerRequest } from 'src/domain/entities/prayer-request.entity';
import { PrayerRequestRepository } from 'src/domain/repositories/prayer-request.repository';
import { PaginatedResult } from 'src/domain/types/paginated-result.type';
import { CacheKeys, CacheTTL } from 'src/infra/adapters/cache-key.util';

@Injectable()
export class GetAllPrayerRequestsUsecase {
  constructor(
    private readonly prayerRequestRepository: PrayerRequestRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(
    churchId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<IPrayerRequest>> {
    const cacheKey = CacheKeys.prayerRequests(churchId, page, limit);
    const cached = await this.cache.get<PaginatedResult<IPrayerRequest>>(cacheKey);
    if (cached) return cached;

    const result = await this.prayerRequestRepository.findPaginated(churchId, page, limit);
    await this.cache.set(cacheKey, result, CacheTTL.PRAYER_REQUESTS);
    return result;
  }
}
