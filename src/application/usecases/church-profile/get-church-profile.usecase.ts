import { Injectable, NotFoundException } from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { IChurchProfile } from 'src/domain/entities/church-profile.entity';
import { ChurchProfileRepository } from 'src/domain/repositories/church-profile.repository';
import { CacheKeys, CacheTTL } from 'src/infra/adapters/cache-key.util';

@Injectable()
export class GetChurchProfileUsecase {
  constructor(
    private readonly churchProfileRepository: ChurchProfileRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(churchId: string): Promise<IChurchProfile> {
    const cacheKey = CacheKeys.churchProfile(churchId);
    const cached = await this.cache.get<IChurchProfile>(cacheKey);
    if (cached) return cached;

    const profile = await this.churchProfileRepository.findByChurchId(churchId);
    if (!profile) throw new NotFoundException('Church profile not found');

    await this.cache.set(cacheKey, profile, CacheTTL.CHURCH_PROFILE);
    return profile;
  }
}
