import { Injectable } from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { IAnnouncement } from 'src/domain/entities/announcement.entity';
import { AnnouncementRepository } from 'src/domain/repositories/announcement.repository';
import { CacheKeys, CacheTTL } from 'src/infra/adapters/cache-key.util';

@Injectable()
export class GetAllAnnouncementsUsecase {
  constructor(
    private readonly announcementRepository: AnnouncementRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(churchId: string): Promise<IAnnouncement[]> {
    const cacheKey = CacheKeys.announcements(churchId);
    const cached = await this.cache.get<IAnnouncement[]>(cacheKey);
    if (cached) return cached;

    const data = await this.announcementRepository.findAllByChurchId(churchId);
    await this.cache.set(cacheKey, data, CacheTTL.ANNOUNCEMENTS);
    return data;
  }
}
