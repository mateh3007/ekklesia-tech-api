import { Injectable } from '@nestjs/common';
import { IAnnouncement } from 'src/domain/entities/announcement.entity';
import { AnnouncementRepository } from 'src/domain/repositories/announcement.repository';

@Injectable()
export class GetAllAnnouncementsUsecase {
  constructor(private readonly announcementRepository: AnnouncementRepository) {}

  async execute(churchId: string): Promise<IAnnouncement[]> {
    return this.announcementRepository.findAllByChurchId(churchId);
  }
}
