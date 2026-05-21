import { Injectable } from '@nestjs/common';
import { IUserResponse, UserRepository } from 'src/domain/repositories/user.repository';

@Injectable()
export class GetAllUsersUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(churchId: string): Promise<IUserResponse[]> {
    return this.userRepository.findByChurchId(churchId);
  }
}
