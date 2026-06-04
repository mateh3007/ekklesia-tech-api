import { Injectable } from '@nestjs/common';
import { IChurchServiceRecord } from 'src/domain/entities/church-service-record.entity';
import { ChurchServiceRecordRepository } from 'src/domain/repositories/church-service-record.repository';

@Injectable()
export class GetLatestChurchServiceRecordUsecase {
  constructor(
    private readonly churchServiceRecordRepository: ChurchServiceRecordRepository,
  ) {}

  async execute(churchId: string): Promise<IChurchServiceRecord | null> {
    const lastChurchServiceRecord =
      await this.churchServiceRecordRepository.findLatestByChurchId(churchId);
    if (!lastChurchServiceRecord) return null;
    return lastChurchServiceRecord;
  }
}
