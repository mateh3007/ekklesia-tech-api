import { BaseRepository } from '../base/base.repository';
import { IPasswordResetToken } from '../entities/password-reset-token.entity';

export type CreatePasswordResetTokenInput = Pick<IPasswordResetToken, 'userId' | 'token' | 'expiresAt'>;
export type UpdatePasswordResetTokenInput = Pick<IPasswordResetToken, 'usedAt'>;

export abstract class PasswordResetTokenRepository extends BaseRepository<
  IPasswordResetToken,
  CreatePasswordResetTokenInput,
  UpdatePasswordResetTokenInput
> {
  abstract findByToken(token: string): Promise<IPasswordResetToken | null>;
  abstract markAsUsed(id: string): Promise<void>;
}
