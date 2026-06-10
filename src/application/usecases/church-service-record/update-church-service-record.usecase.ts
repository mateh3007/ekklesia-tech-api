import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { IChurchServiceRecord } from 'src/domain/entities/church-service-record.entity';
import {
  ChurchServiceRecordRepository,
  UpdateChurchServiceRecordInput,
} from 'src/domain/repositories/church-service-record.repository';
import { CacheKeys } from 'src/infra/adapters/cache-key.util';

@Injectable()
export class UpdateChurchServiceRecordUsecase {
  constructor(
    private readonly churchServiceRecordRepository: ChurchServiceRecordRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(
    id: string,
    data: UpdateChurchServiceRecordInput,
    churchId: string,
  ): Promise<IChurchServiceRecord> {
    const record = await this.churchServiceRecordRepository.findById(id);
    if (!record) throw new NotFoundException('Church service record not found');
    if (record.churchId !== churchId)
      throw new ForbiddenException('Access denied to this record');
    const updated = await this.churchServiceRecordRepository.update(id, data);
    await this.cache.deleteByPattern(
      CacheKeys.churchServiceRecordsPattern(churchId),
    );
    return updated;
  }
}
