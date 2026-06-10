import { Injectable } from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { IChurchServiceRecord } from 'src/domain/entities/church-service-record.entity';
import { ChurchServiceRecordRepository } from 'src/domain/repositories/church-service-record.repository';
import { PaginatedResult } from 'src/domain/types/paginated-result.type';
import { CacheKeys, CacheTTL } from 'src/infra/adapters/cache-key.util';

@Injectable()
export class GetAllChurchServiceRecordsUsecase {
  constructor(
    private readonly churchServiceRecordRepository: ChurchServiceRecordRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(
    churchId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<IChurchServiceRecord>> {
    const cacheKey = CacheKeys.churchServiceRecords(churchId, page, limit);
    const cached =
      await this.cache.get<PaginatedResult<IChurchServiceRecord>>(cacheKey);
    if (cached) return cached;

    const result = await this.churchServiceRecordRepository.findPaginated(
      churchId,
      page,
      limit,
    );
    await this.cache.set(cacheKey, result, CacheTTL.CHURCH_SERVICE_RECORDS);
    return result;
  }
}
