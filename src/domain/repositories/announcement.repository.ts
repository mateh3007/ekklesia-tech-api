import { PaginatedResult } from '../types/paginated-result.type';
import { IAnnouncement } from '../entities/announcement.entity';

export type CreateAnnouncementInput = Omit<
  IAnnouncement,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
export type UpdateAnnouncementInput = Partial<
  Pick<IAnnouncement, 'title' | 'content' | 'date'>
>;

export abstract class AnnouncementRepository {
  abstract create(data: CreateAnnouncementInput): Promise<IAnnouncement>;
  abstract findAllByChurchId(churchId: string): Promise<IAnnouncement[]>;
  abstract findPaginated(
    churchId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<IAnnouncement>>;
  abstract findById(id: string): Promise<IAnnouncement | null>;
  abstract update(
    id: string,
    data: UpdateAnnouncementInput,
  ): Promise<IAnnouncement>;
  abstract softDelete(id: string): Promise<void>;
}
