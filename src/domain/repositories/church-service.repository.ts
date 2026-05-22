import { IChurchService } from '../entities/church-service.entity';

export type CreateChurchServiceInput = Omit<IChurchService, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateChurchServiceInput = Partial<Omit<IChurchService, 'id' | 'churchId' | 'createdAt' | 'updatedAt'>>;

export abstract class ChurchServiceRepository {
  abstract create(data: CreateChurchServiceInput): Promise<IChurchService>;
  abstract findAll(churchId: string): Promise<IChurchService[]>;
  abstract findById(id: string): Promise<IChurchService>;
  abstract update(id: string, data: UpdateChurchServiceInput): Promise<IChurchService>;
  abstract delete(id: string): Promise<void>;
}
