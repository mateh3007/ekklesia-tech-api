import { BaseRepository } from '../base/base.repository';
import { IChurch } from '../entities/church.entity';

export type CreateChurchInput = Omit<IChurch, 'id' | 'createdAt' | 'updatedAt'>;

export abstract class ChurchRepository extends BaseRepository<IChurch, CreateChurchInput> {
  abstract findByCnpj(cnpj: string): Promise<IChurch | null>;
}