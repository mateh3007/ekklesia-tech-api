import { PaginatedResult } from '../types/paginated-result.type';
import { IPrayerRequest } from '../entities/prayer-request.entity';

export type CreatePrayerRequestInput = Omit<
  IPrayerRequest,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
export type UpdatePrayerRequestInput = Partial<
  Pick<IPrayerRequest, 'name' | 'request'>
>;

export abstract class PrayerRequestRepository {
  abstract create(data: CreatePrayerRequestInput): Promise<IPrayerRequest>;
  abstract findAllByChurchId(churchId: string): Promise<IPrayerRequest[]>;
  abstract findPaginated(
    churchId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<IPrayerRequest>>;
  abstract findById(id: string): Promise<IPrayerRequest | null>;
  abstract update(
    id: string,
    data: UpdatePrayerRequestInput,
  ): Promise<IPrayerRequest>;
  abstract softDelete(id: string): Promise<void>;
}
