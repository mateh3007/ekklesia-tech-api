import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { AnnouncementRepository } from 'src/domain/repositories/announcement.repository';
import { CacheKeys } from 'src/infra/adapters/cache-key.util';

@Injectable()
export class DeleteAnnouncementUsecase {
  constructor(
    private readonly announcementRepository: AnnouncementRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(id: string, churchId: string): Promise<void> {
    const announcement = await this.announcementRepository.findById(id);
    if (!announcement) throw new NotFoundException('Announcement not found');
    if (announcement.churchId !== churchId)
      throw new ForbiddenException('Access denied to this announcement');
    await this.announcementRepository.softDelete(id);
    await this.cache.delete(CacheKeys.announcements(churchId));
  }
}
