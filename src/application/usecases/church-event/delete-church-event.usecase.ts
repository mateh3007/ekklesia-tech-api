import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { ChurchEventRepository } from 'src/domain/repositories/church-event.repository';
import { CacheKeys } from 'src/infra/adapters/cache-key.util';

@Injectable()
export class DeleteChurchEventUsecase {
  constructor(
    private readonly churchEventRepository: ChurchEventRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(id: string, churchId: string): Promise<void> {
    const event = await this.churchEventRepository.findById(id);
    if (!event) throw new NotFoundException('Church event not found');
    if (event.churchId !== churchId) throw new ForbiddenException();
    await this.churchEventRepository.delete(id);
    await Promise.all([
      this.cache.deleteByPattern(CacheKeys.churchEventsPattern(churchId)),
      this.cache.deleteByPattern(CacheKeys.agendaPattern(churchId)),
    ]);
  }
}
