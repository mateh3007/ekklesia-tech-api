export interface IPasswordResetToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  usedAt?: Date | null;
  createdAt: Date;
}
