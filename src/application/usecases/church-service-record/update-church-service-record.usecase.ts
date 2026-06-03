import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { IChurchServiceRecord } from 'src/domain/entities/church-service-record.entity';
import { ChurchServiceRecordRepository, UpdateChurchServiceRecordInput } from 'src/domain/repositories/church-service-record.repository';

@Injectable()
export class UpdateChurchServiceRecordUsecase {
  constructor(private readonly churchServiceRecordRepository: ChurchServiceRecordRepository) {}

  async execute(id: string, data: UpdateChurchServiceRecordInput, churchId: string): Promise<IChurchServiceRecord> {
    const record = await this.churchServiceRecordRepository.findById(id);
    if (!record) throw new NotFoundException('Church service record not found');
    if (record.churchId !== churchId) throw new ForbiddenException('Access denied to this record');
    return this.churchServiceRecordRepository.update(id, data);
  }
}
