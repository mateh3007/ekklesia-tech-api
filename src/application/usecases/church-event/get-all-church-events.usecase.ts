import { Injectable } from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { IChurchEvent } from 'src/domain/entities/church-event.entity';
import { ChurchEventRepository } from 'src/domain/repositories/church-event.repository';
import { CacheKeys, CacheTTL } from 'src/infra/adapters/cache-key.util';

@Injectable()
export class GetAllChurchEventsUsecase {
  constructor(
    private readonly churchEventRepository: ChurchEventRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(churchId: string): Promise<IChurchEvent[]> {
    const cacheKey = CacheKeys.churchEvents(churchId);
    const cached = await this.cache.get<IChurchEvent[]>(cacheKey);
    if (cached) return cached;

    const events = await this.churchEventRepository.findAll(churchId);
    await this.cache.set(cacheKey, events, CacheTTL.CHURCH_EVENTS);
    return events;
  }
}
