import { Injectable } from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { IChurchEvent } from 'src/domain/entities/church-event.entity';
import {
  ChurchEventRepository,
  CreateChurchEventInput,
} from 'src/domain/repositories/church-event.repository';
import { CacheKeys } from 'src/infra/adapters/cache-key.util';

@Injectable()
export class CreateChurchEventUsecase {
  constructor(
    private readonly churchEventRepository: ChurchEventRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(input: CreateChurchEventInput): Promise<IChurchEvent> {
    const event = await this.churchEventRepository.create(input);
    await Promise.all([
      this.cache.deleteByPattern(CacheKeys.churchEventsPattern(input.churchId)),
      this.cache.deleteByPattern(CacheKeys.agendaPattern(input.churchId)),
    ]);
    return event;
  }
}
