import { ConflictException, GoneException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InviteStatus } from '@prisma/client';
import { Role } from 'src/domain/enums/role.enum';
import { ChurchInviteRepository } from 'src/domain/repositories/church-invite.repository';
import { UserRepository, IUserResponse } from 'src/domain/repositories/user.repository';

export interface IAcceptInviteInput {
  name: string;
  password: string;
  phone: string;
}

@Injectable()
export class AcceptInviteUsecase {
  constructor(
    private readonly churchInviteRepository: ChurchInviteRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(token: string, data: IAcceptInviteInput): Promise<IUserResponse> {
    const invite = await this.churchInviteRepository.findByToken(token);
    if (!invite) throw new NotFoundException('Invite not found');

    if (invite.expiresAt < new Date()) {
      await this.churchInviteRepository.updateStatus(invite.id, InviteStatus.EXPIRED);
      throw new GoneException('Invite has expired');
    }

    if (invite.status === InviteStatus.ACCEPTED) {
      throw new ConflictException('Invite already accepted');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.create({
      name: data.name,
      email: invite.email,
      password: hashedPassword,
      phone: data.phone,
      role: Role.SUPERVISOR,
      churchId: invite.churchId,
    });

    await this.churchInviteRepository.updateStatus(invite.id, InviteStatus.ACCEPTED);

    return user;
  }
}
