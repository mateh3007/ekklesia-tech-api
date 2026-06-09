import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { ChurchServiceRepository } from 'src/domain/repositories/church-service.repository';
import { CacheKeys } from 'src/infra/adapters/cache-key.util';

@Injectable()
export class DeleteChurchServiceUsecase {
  constructor(
    private readonly churchServiceRepository: ChurchServiceRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(id: string, churchId: string): Promise<void> {
    const service = await this.churchServiceRepository.findById(id);
    if (!service) throw new NotFoundException('Church service not found');
    if (service.churchId !== churchId) throw new ForbiddenException();
    await this.churchServiceRepository.delete(id);
    await Promise.all([
      this.cache.delete(CacheKeys.churchServices(churchId)),
      this.cache.deleteByPattern(CacheKeys.agendaPattern(churchId)),
    ]);
  }
}
