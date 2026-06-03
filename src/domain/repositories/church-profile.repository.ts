import { IChurchProfile } from '../entities/church-profile.entity';

export type CreateChurchProfileInput = Omit<IChurchProfile, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
export type UpdateChurchProfileInput = Partial<Omit<IChurchProfile, 'id' | 'churchId' | 'createdAt' | 'updatedAt' | 'deletedAt'>>;

export abstract class ChurchProfileRepository {
  abstract create(data: CreateChurchProfileInput): Promise<IChurchProfile>;
  abstract findByChurchId(churchId: string): Promise<IChurchProfile | null>;
  abstract findByChurchIdIncludingDeleted(churchId: string): Promise<IChurchProfile | null>;
  abstract update(churchId: string, data: UpdateChurchProfileInput): Promise<IChurchProfile>;
  abstract softDelete(churchId: string): Promise<void>;
}
