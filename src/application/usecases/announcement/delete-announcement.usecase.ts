import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AnnouncementRepository } from 'src/domain/repositories/announcement.repository';

@Injectable()
export class DeleteAnnouncementUsecase {
  constructor(private readonly announcementRepository: AnnouncementRepository) {}

  async execute(id: string, churchId: string): Promise<void> {
    const announcement = await this.announcementRepository.findById(id);
    if (!announcement) throw new NotFoundException('Announcement not found');
    if (announcement.churchId !== churchId) throw new ForbiddenException('Access denied to this announcement');
    await this.announcementRepository.softDelete(id);
  }
}
