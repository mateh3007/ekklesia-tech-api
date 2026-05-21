import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { IUserResponse, UserRepository } from 'src/domain/repositories/user.repository';

@Injectable()
export class GetUserByIdUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, churchId: string): Promise<IUserResponse> {
    const user = await this.userRepository.findById(id);

    if (user && user.churchId !== churchId) throw new ForbiddenException();
    if(!user) throw new NotFoundException('User not found');
    
    return user;
  }
}
