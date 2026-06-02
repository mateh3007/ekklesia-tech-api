import { Injectable } from '@nestjs/common';
import { IChurchServiceRecord } from 'src/domain/entities/church-service-record.entity';
import { ChurchServiceRecordRepository, CreateChurchServiceRecordInput } from 'src/domain/repositories/church-service-record.repository';

@Injectable()
export class CreateChurchServiceRecordUsecase {
  constructor(private readonly churchServiceRecordRepository: ChurchServiceRecordRepository) {}

  async execute(input: CreateChurchServiceRecordInput): Promise<IChurchServiceRecord> {
    return this.churchServiceRecordRepository.create(input);
  }
}
