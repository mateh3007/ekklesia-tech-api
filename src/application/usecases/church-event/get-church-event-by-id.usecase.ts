import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IChurchEvent } from 'src/domain/entities/church-event.entity';
import { ChurchEventRepository } from 'src/domain/repositories/church-event.repository';

@Injectable()
export class GetChurchEventByIdUsecase {
  constructor(private readonly churchEventRepository: ChurchEventRepository) {}

  async execute(id: string, churchId: string): Promise<IChurchEvent> {
    const event = await this.churchEventRepository.findById(id);
    if (!event) throw new NotFoundException('Church event not found');
    if (event.churchId !== churchId) throw new ForbiddenException();
    return event;
  }
}
