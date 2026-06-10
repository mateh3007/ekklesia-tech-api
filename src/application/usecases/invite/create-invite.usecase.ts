import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { InviteStatus } from '@prisma/client';
import { EmailAdapter } from 'src/application/services/email.adapter';
import { Role } from 'src/domain/enums/role.enum';
import { ChurchRepository } from 'src/domain/repositories/church.repository';
import { ChurchInviteRepository } from 'src/domain/repositories/church-invite.repository';
import { UserRepository } from 'src/domain/repositories/user.repository';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';

export interface IChurchInvite {
  id: string;
  churchId: string;
  invitedBy: string;
  email: string;
  token: string;
  status: InviteStatus;
  expiresAt: Date;
  createdAt: Date;
}

@Injectable()
export class CreateInviteUsecase {
  constructor(
    private readonly churchInviteRepository: ChurchInviteRepository,
    private readonly userRepository: UserRepository,
    private readonly churchRepository: ChurchRepository,
    private readonly emailAdapter: EmailAdapter,
  ) {}

  async execute(
    churchId: string,
    email: string,
    requester: IJwtUser,
  ): Promise<IChurchInvite> {
    if (
      requester.role !== Role.SUPERADMIN &&
      (requester.role !== Role.ADMIN || requester.churchId !== churchId)
    ) {
      throw new ForbiddenException('Only church admins can send invites');
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('This email already has an account');
    }

    const pendingInvite =
      await this.churchInviteRepository.findPendingByEmailAndChurch(
        email,
        churchId,
      );
    if (pendingInvite) {
      throw new ConflictException(
        'There is already a pending invite for this email',
      );
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

    const invite = await this.churchInviteRepository.create({
      churchId,
      invitedBy: requester.id,
      email,
      token,
      expiresAt,
    });

    const [church, inviter] = await Promise.all([
      this.churchRepository.findById(churchId),
      this.userRepository.findById(requester.id),
    ]);

    await this.emailAdapter.sendInviteEmail(
      email,
      church!.corporateName,
      inviter!.name,
      token,
    );

    return invite;
  }
}
