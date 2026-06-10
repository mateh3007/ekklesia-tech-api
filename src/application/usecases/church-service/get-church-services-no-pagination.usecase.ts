import { Injectable } from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { ChurchServiceRepository } from 'src/domain/repositories/church-service.repository';
import { IdName } from 'src/domain/types/id-name.type';
import { CacheKeys, CacheTTL } from 'src/infra/adapters/cache-key.util';

@Injectable()
export class GetChurchServicesNoPaginationUsecase {
  constructor(
    private readonly churchServiceRepository: ChurchServiceRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(churchId: string): Promise<IdName[]> {
    const cacheKey = CacheKeys.churchServicesNoPagination(churchId);
    const cached = await this.cache.get<IdName[]>(cacheKey);
    if (cached) return cached;

    const services = await this.churchServiceRepository.findAll(churchId);
    const result: IdName[] = services.map((s) => ({ id: s.id, name: s.title }));

    await this.cache.set(cacheKey, result, CacheTTL.CHURCH_SERVICES);
    return result;
  }
}
