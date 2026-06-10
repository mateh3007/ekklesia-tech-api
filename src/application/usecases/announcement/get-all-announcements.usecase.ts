import { Injectable } from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { IAnnouncement } from 'src/domain/entities/announcement.entity';
import { AnnouncementRepository } from 'src/domain/repositories/announcement.repository';
import { PaginatedResult } from 'src/domain/types/paginated-result.type';
import { CacheKeys, CacheTTL } from 'src/infra/adapters/cache-key.util';

@Injectable()
export class GetAllAnnouncementsUsecase {
  constructor(
    private readonly announcementRepository: AnnouncementRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(
    churchId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<IAnnouncement>> {
    const cacheKey = CacheKeys.announcements(churchId, page, limit);
    const cached = await this.cache.get<PaginatedResult<IAnnouncement>>(cacheKey);
    if (cached) return cached;

    const result = await this.announcementRepository.findPaginated(churchId, page, limit);
    await this.cache.set(cacheKey, result, CacheTTL.ANNOUNCEMENTS);
    return result;
  }
}
