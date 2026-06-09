import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { IChurchService } from 'src/domain/entities/church-service.entity';
import {
  ChurchServiceRepository,
  UpdateChurchServiceInput,
} from 'src/domain/repositories/church-service.repository';
import { CacheKeys } from 'src/infra/adapters/cache-key.util';

@Injectable()
export class UpdateChurchServiceUsecase {
  constructor(
    private readonly churchServiceRepository: ChurchServiceRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(
    id: string,
    input: UpdateChurchServiceInput,
    churchId: string,
  ): Promise<IChurchService> {
    const service = await this.churchServiceRepository.findById(id);
    if (!service) throw new NotFoundException('Church service not found');
    if (service.churchId !== churchId) throw new ForbiddenException();

    const updated = await this.churchServiceRepository.update(id, input);
    await Promise.all([
      this.cache.delete(CacheKeys.churchServices(churchId)),
      this.cache.deleteByPattern(CacheKeys.agendaPattern(churchId)),
    ]);
    return updated;
  }
}
