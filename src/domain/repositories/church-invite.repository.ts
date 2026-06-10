import { InviteStatus } from '@prisma/client';
import { BaseRepository } from '../base/base.repository';
import type { IChurchInvite } from 'src/application/usecases/invite/create-invite.usecase';

export type CreateChurchInviteInput = Pick<
  IChurchInvite,
  'churchId' | 'invitedBy' | 'email' | 'token' | 'expiresAt'
>;

export abstract class ChurchInviteRepository extends BaseRepository<
  IChurchInvite,
  CreateChurchInviteInput,
  never
> {
  abstract findByToken(token: string): Promise<IChurchInvite | null>;
  abstract findPendingByEmailAndChurch(
    email: string,
    churchId: string,
  ): Promise<IChurchInvite | null>;
  abstract updateStatus(id: string, status: InviteStatus): Promise<void>;
}
