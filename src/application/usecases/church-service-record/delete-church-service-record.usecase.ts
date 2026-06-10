import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { ChurchServiceRecordRepository } from 'src/domain/repositories/church-service-record.repository';
import { CacheKeys } from 'src/infra/adapters/cache-key.util';

@Injectable()
export class DeleteChurchServiceRecordUsecase {
  constructor(
    private readonly churchServiceRecordRepository: ChurchServiceRecordRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(id: string, churchId: string): Promise<void> {
    const record = await this.churchServiceRecordRepository.findById(id);
    if (!record) throw new NotFoundException('Church service record not found');
    if (record.churchId !== churchId)
      throw new ForbiddenException('Access denied to this record');
    await this.churchServiceRecordRepository.softDelete(id);
    await this.cache.deleteByPattern(
      CacheKeys.churchServiceRecordsPattern(churchId),
    );
  }
}
