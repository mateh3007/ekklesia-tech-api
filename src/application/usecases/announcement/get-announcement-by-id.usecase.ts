import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IAnnouncement } from 'src/domain/entities/announcement.entity';
import { AnnouncementRepository } from 'src/domain/repositories/announcement.repository';

@Injectable()
export class GetAnnouncementByIdUsecase {
  constructor(
    private readonly announcementRepository: AnnouncementRepository,
  ) {}

  async execute(id: string, churchId: string): Promise<IAnnouncement> {
    const announcement = await this.announcementRepository.findById(id);
    if (!announcement) throw new NotFoundException('Announcement not found');
    if (announcement.churchId !== churchId)
      throw new ForbiddenException('Access denied to this announcement');
    return announcement;
  }
}
