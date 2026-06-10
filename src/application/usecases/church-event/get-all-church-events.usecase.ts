import { Injectable } from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { IChurchEvent } from 'src/domain/entities/church-event.entity';
import { ChurchEventRepository } from 'src/domain/repositories/church-event.repository';
import { PaginatedResult } from 'src/domain/types/paginated-result.type';
import { CacheKeys, CacheTTL } from 'src/infra/adapters/cache-key.util';

@Injectable()
export class GetAllChurchEventsUsecase {
  constructor(
    private readonly churchEventRepository: ChurchEventRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(
    churchId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<IChurchEvent>> {
    const cacheKey = CacheKeys.churchEvents(churchId, page, limit);
    const cached = await this.cache.get<PaginatedResult<IChurchEvent>>(cacheKey);
    if (cached) return cached;

    const result = await this.churchEventRepository.findPaginated(churchId, page, limit);
    await this.cache.set(cacheKey, result, CacheTTL.CHURCH_EVENTS);
    return result;
  }
}
