import { IChurchServiceRecord } from '../entities/church-service-record.entity';

export type CreateChurchServiceRecordInput = Omit<IChurchServiceRecord, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
export type UpdateChurchServiceRecordInput = Partial<Pick<IChurchServiceRecord, 'serviceId' | 'preacher' | 'topic' | 'bibleVerse' | 'notes' | 'date'>>;

export abstract class ChurchServiceRecordRepository {
  abstract create(data: CreateChurchServiceRecordInput): Promise<IChurchServiceRecord>;
  abstract findAllByChurchId(churchId: string): Promise<IChurchServiceRecord[]>;
  abstract findById(id: string): Promise<IChurchServiceRecord | null>;
  abstract findLatestByChurchId(churchId: string): Promise<IChurchServiceRecord | null>;
  abstract update(id: string, data: UpdateChurchServiceRecordInput): Promise<IChurchServiceRecord>;
  abstract softDelete(id: string): Promise<void>;
}
