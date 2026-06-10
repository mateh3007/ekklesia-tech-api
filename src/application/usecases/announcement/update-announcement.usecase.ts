import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { IAnnouncement } from 'src/domain/entities/announcement.entity';
import {
  AnnouncementRepository,
  UpdateAnnouncementInput,
} from 'src/domain/repositories/announcement.repository';
import { CacheKeys } from 'src/infra/adapters/cache-key.util';

@Injectable()
export class UpdateAnnouncementUsecase {
  constructor(
    private readonly announcementRepository: AnnouncementRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(
    id: string,
    data: UpdateAnnouncementInput,
    churchId: string,
  ): Promise<IAnnouncement> {
    const announcement = await this.announcementRepository.findById(id);
    if (!announcement) throw new NotFoundException('Announcement not found');
    if (announcement.churchId !== churchId)
      throw new ForbiddenException('Access denied to this announcement');

    const updated = await this.announcementRepository.update(id, data);
    await this.cache.deleteByPattern(CacheKeys.announcementsPattern(churchId));
    return updated;
  }
}
