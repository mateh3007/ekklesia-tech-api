import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IAnnouncement } from 'src/domain/entities/announcement.entity';
import {
  AnnouncementRepository,
  UpdateAnnouncementInput,
} from 'src/domain/repositories/announcement.repository';

@Injectable()
export class UpdateAnnouncementUsecase {
  constructor(
    private readonly announcementRepository: AnnouncementRepository,
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
    return this.announcementRepository.update(id, data);
  }
}
