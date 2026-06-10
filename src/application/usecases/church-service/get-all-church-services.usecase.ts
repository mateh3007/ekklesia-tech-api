import { Injectable } from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { IChurchService } from 'src/domain/entities/church-service.entity';
import { ChurchServiceRepository } from 'src/domain/repositories/church-service.repository';
import { PaginatedResult } from 'src/domain/types/paginated-result.type';
import { CacheKeys, CacheTTL } from 'src/infra/adapters/cache-key.util';

@Injectable()
export class GetAllChurchServicesUsecase {
  constructor(
    private readonly churchServiceRepository: ChurchServiceRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(
    churchId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<IChurchService>> {
    const cacheKey = CacheKeys.churchServices(churchId, page, limit);
    const cached =
      await this.cache.get<PaginatedResult<IChurchService>>(cacheKey);
    if (cached) return cached;

    const result = await this.churchServiceRepository.findPaginated(
      churchId,
      page,
      limit,
    );
    await this.cache.set(cacheKey, result, CacheTTL.CHURCH_SERVICES);
    return result;
  }
}
