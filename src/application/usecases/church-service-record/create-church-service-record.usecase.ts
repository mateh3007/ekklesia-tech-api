import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { IChurchServiceRecord } from 'src/domain/entities/church-service-record.entity';
import {
  ChurchServiceRecordRepository,
  CreateChurchServiceRecordInput,
} from 'src/domain/repositories/church-service-record.repository';
import { ChurchServiceRepository } from 'src/domain/repositories/church-service.repository';
import { CacheKeys } from 'src/infra/adapters/cache-key.util';

@Injectable()
export class CreateChurchServiceRecordUsecase {
  constructor(
    private readonly churchServiceRecordRepository: ChurchServiceRecordRepository,
    private readonly churchServiceRepository: ChurchServiceRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(
    input: CreateChurchServiceRecordInput,
  ): Promise<IChurchServiceRecord> {
    const service = await this.churchServiceRepository.findById(
      input.serviceId,
    );
    if (!service) throw new NotFoundException('Church service not found');
    if (service.churchId !== input.churchId)
      throw new ForbiddenException('Service does not belong to this church');

    const existing = await this.churchServiceRecordRepository.findByServiceId(
      input.serviceId,
    );
    if (existing)
      throw new ConflictException('A record already exists for this service');

    const record = await this.churchServiceRecordRepository.create(input);
    await this.cache.deleteByPattern(
      CacheKeys.churchServiceRecordsPattern(input.churchId),
    );
    return record;
  }
}
