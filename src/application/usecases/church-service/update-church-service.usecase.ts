import { ForbiddenException, Injectable } from '@nestjs/common';
import { IChurchService } from 'src/domain/entities/church-service.entity';
import { ChurchServiceRepository, UpdateChurchServiceInput } from 'src/domain/repositories/church-service.repository';

@Injectable()
export class UpdateChurchServiceUsecase {
  constructor(private readonly churchServiceRepository: ChurchServiceRepository) {}

  async execute(id: string, input: UpdateChurchServiceInput, churchId: string): Promise<IChurchService> {
    const service = await this.churchServiceRepository.findById(id);
    if (service.churchId !== churchId) throw new ForbiddenException();
    return this.churchServiceRepository.update(id, input);
  }
}
