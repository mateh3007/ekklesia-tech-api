import {
  ConflictException,
  GoneException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InviteStatus } from '@prisma/client';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { ChurchInviteRepository } from 'src/domain/repositories/church-invite.repository';
import { ChurchRepository } from 'src/domain/repositories/church.repository';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { CacheKeys } from 'src/infra/adapters/cache-key.util';

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
    private readonly cache: CacheAdapter,
  ) {}

  async execute(token: string): Promise<IInviteInfo> {
    const cacheKey = CacheKeys.inviteToken(token);
    const cached = await this.cache.get<IInviteInfo>(cacheKey);
    if (cached) return cached;

    const invite = await this.churchInviteRepository.findByToken(token);
    if (!invite) throw new NotFoundException('Invite not found');

    if (invite.expiresAt < new Date()) {
      await this.churchInviteRepository.updateStatus(
        invite.id,
        InviteStatus.EXPIRED,
      );
      throw new GoneException('Invite has expired');
    }

    if (invite.status === InviteStatus.ACCEPTED) {
      throw new ConflictException('Invite already accepted');
    }

    const [church, inviter] = await Promise.all([
      this.churchRepository.findById(invite.churchId),
      this.userRepository.findById(invite.invitedBy),
    ]);

    const result: IInviteInfo = {
      email: invite.email,
      churchName: church!.corporateName,
      inviterName: inviter!.name,
    };

    const ttl = Math.max(
      0,
      Math.floor((new Date(invite.expiresAt).getTime() - Date.now()) / 1000),
    );
    if (ttl > 0) {
      await this.cache.set(cacheKey, result, ttl);
    }

    return result;
  }
}
