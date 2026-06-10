import { Injectable } from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { IChurchService } from 'src/domain/entities/church-service.entity';
import {
  ChurchServiceRepository,
  CreateChurchServiceInput,
} from 'src/domain/repositories/church-service.repository';
import { CacheKeys } from 'src/infra/adapters/cache-key.util';

@Injectable()
export class CreateChurchServiceUsecase {
  constructor(
    private readonly churchServiceRepository: ChurchServiceRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(input: CreateChurchServiceInput): Promise<IChurchService> {
    const service = await this.churchServiceRepository.create(input);
    await Promise.all([
      this.cache.deleteByPattern(
        CacheKeys.churchServicesPattern(input.churchId),
      ),
      this.cache.deleteByPattern(CacheKeys.agendaPattern(input.churchId)),
    ]);
    return service;
  }
}
