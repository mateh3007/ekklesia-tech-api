import { Injectable } from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { IAnnouncement } from 'src/domain/entities/announcement.entity';
import {
  AnnouncementRepository,
  CreateAnnouncementInput,
} from 'src/domain/repositories/announcement.repository';
import { CacheKeys } from 'src/infra/adapters/cache-key.util';

@Injectable()
export class CreateAnnouncementUsecase {
  constructor(
    private readonly announcementRepository: AnnouncementRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(input: CreateAnnouncementInput): Promise<IAnnouncement> {
    const announcement = await this.announcementRepository.create(input);
    await this.cache.deleteByPattern(
      CacheKeys.announcementsPattern(input.churchId),
    );
    return announcement;
  }
}
