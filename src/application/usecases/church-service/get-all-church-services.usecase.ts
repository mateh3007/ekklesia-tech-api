import { Injectable } from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { IChurchService } from 'src/domain/entities/church-service.entity';
import { ChurchServiceRepository } from 'src/domain/repositories/church-service.repository';
import { CacheKeys, CacheTTL } from 'src/infra/adapters/cache-key.util';

@Injectable()
export class GetAllChurchServicesUsecase {
  constructor(
    private readonly churchServiceRepository: ChurchServiceRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(churchId: string): Promise<IChurchService[]> {
    const cacheKey = CacheKeys.churchServices(churchId);
    const cached = await this.cache.get<IChurchService[]>(cacheKey);
    if (cached) return cached;

    const services = await this.churchServiceRepository.findAll(churchId);
    await this.cache.set(cacheKey, services, CacheTTL.CHURCH_SERVICES);
    return services;
  }
}
