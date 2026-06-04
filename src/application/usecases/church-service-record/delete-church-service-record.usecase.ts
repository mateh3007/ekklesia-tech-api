import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ChurchServiceRecordRepository } from 'src/domain/repositories/church-service-record.repository';

@Injectable()
export class DeleteChurchServiceRecordUsecase {
  constructor(
    private readonly churchServiceRecordRepository: ChurchServiceRecordRepository,
  ) {}

  async execute(id: string, churchId: string): Promise<void> {
    const record = await this.churchServiceRecordRepository.findById(id);
    if (!record) throw new NotFoundException('Church service record not found');
    if (record.churchId !== churchId)
      throw new ForbiddenException('Access denied to this record');
    await this.churchServiceRecordRepository.softDelete(id);
  }
}
