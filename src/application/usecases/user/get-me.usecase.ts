import { Injectable, NotFoundException } from '@nestjs/common';
import {
  IUserResponse,
  UserRepository,
} from 'src/domain/repositories/user.repository';

@Injectable()
export class GetMeUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<IUserResponse> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
