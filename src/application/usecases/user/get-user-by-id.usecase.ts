import { Injectable } from '@nestjs/common';
import { IUserResponse, UserRepository } from 'src/domain/repositories/user.repository';

@Injectable()
export class GetUserByIdUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<IUserResponse> {
    return this.userRepository.findById(id);
  }
}
