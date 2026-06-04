import { Injectable, NotFoundException } from '@nestjs/common';
import { IChurch } from 'src/domain/entities/church.entity';
import { ChurchRepository } from 'src/domain/repositories/church.repository';
import {
  IUserResponse,
  UserRepository,
} from 'src/domain/repositories/user.repository';

export interface IMyChurchResponse extends IChurch {
  users: IUserResponse[];
}

@Injectable()
export class GetMyChurchUsecase {
  constructor(
    private readonly churchRepository: ChurchRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(churchId: string): Promise<IMyChurchResponse> {
    const church = await this.churchRepository.findById(churchId);
    if (!church) throw new NotFoundException('Church not found');

    const users = await this.userRepository.findByChurchId(churchId);
    return { ...church, users };
  }
}
