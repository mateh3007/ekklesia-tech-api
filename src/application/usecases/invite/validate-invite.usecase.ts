import { ConflictException, GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { InviteStatus } from '@prisma/client';
import { ChurchInviteRepository } from 'src/domain/repositories/church-invite.repository';
import { ChurchRepository } from 'src/domain/repositories/church.repository';
import { UserRepository } from 'src/domain/repositories/user.repository';

export interface IInviteInfo {
  email: string;
  churchName: string;
  inviterName: string;
}

@Injectable()
export class ValidateInviteUsecase {
  constructor(
    private readonly churchInviteRepository: ChurchInviteRepository,
    private readonly churchRepository: ChurchRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(token: string): Promise<IInviteInfo> {
    const invite = await this.churchInviteRepository.findByToken(token);
    if (!invite) throw new NotFoundException('Invite not found');

    if (invite.expiresAt < new Date()) {
      await this.churchInviteRepository.updateStatus(invite.id, InviteStatus.EXPIRED);
      throw new GoneException('Invite has expired');
    }

    if (invite.status === InviteStatus.ACCEPTED) {
      throw new ConflictException('Invite already accepted');
    }

    const [church, inviter] = await Promise.all([
      this.churchRepository.findById(invite.churchId),
      this.userRepository.findById(invite.invitedBy),
    ]);

    return { email: invite.email, churchName: church!.corporateName, inviterName: inviter!.name };
  }
}
