import { Injectable } from '@nestjs/common';
import { IAnnouncement } from 'src/domain/entities/announcement.entity';
import { AnnouncementRepository, CreateAnnouncementInput } from 'src/domain/repositories/announcement.repository';

@Injectable()
export class CreateAnnouncementUsecase {
  constructor(private readonly announcementRepository: AnnouncementRepository) {}

  async execute(input: CreateAnnouncementInput): Promise<IAnnouncement> {
    return this.announcementRepository.create(input);
  }
}
