import { IChurchEvent } from '../entities/church-event.entity';

export type CreateChurchEventInput = Omit<
  IChurchEvent,
  'id' | 'createdAt' | 'updatedAt'
>;
export type UpdateChurchEventInput = Partial<
  Omit<IChurchEvent, 'id' | 'churchId' | 'createdAt' | 'updatedAt'>
>;

export abstract class ChurchEventRepository {
  abstract create(data: CreateChurchEventInput): Promise<IChurchEvent>;
  abstract findAll(churchId: string): Promise<IChurchEvent[]>;
  abstract findById(id: string): Promise<IChurchEvent | null>;
  abstract update(
    id: string,
    data: UpdateChurchEventInput,
  ): Promise<IChurchEvent>;
  abstract delete(id: string): Promise<void>;
}
