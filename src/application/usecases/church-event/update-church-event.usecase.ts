import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { IChurchEvent } from 'src/domain/entities/church-event.entity';
import {
  ChurchEventRepository,
  UpdateChurchEventInput,
} from 'src/domain/repositories/church-event.repository';
import { CacheKeys } from 'src/infra/adapters/cache-key.util';

@Injectable()
export class UpdateChurchEventUsecase {
  constructor(
    private readonly churchEventRepository: ChurchEventRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(
    id: string,
    input: UpdateChurchEventInput,
    churchId: string,
  ): Promise<IChurchEvent> {
    const event = await this.churchEventRepository.findById(id);
    if (!event) throw new NotFoundException('Church event not found');
    if (event.churchId !== churchId) throw new ForbiddenException();

    const updated = await this.churchEventRepository.update(id, input);
    await Promise.all([
      this.cache.delete(CacheKeys.churchEvents(churchId)),
      this.cache.deleteByPattern(CacheKeys.agendaPattern(churchId)),
    ]);
    return updated;
  }
}
