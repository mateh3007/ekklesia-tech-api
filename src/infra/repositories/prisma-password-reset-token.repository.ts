import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/config/prisma/prisma.service';
import {
  CreatePasswordResetTokenInput,
  PasswordResetTokenRepository,
  UpdatePasswordResetTokenInput,
} from 'src/domain/repositories/password-reset-token.repository';
import { IPasswordResetToken } from 'src/domain/entities/password-reset-token.entity';

@Injectable()
export class PrismaPasswordResetTokenRepository extends PasswordResetTokenRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: CreatePasswordResetTokenInput): Promise<IPasswordResetToken> {
    return this.prisma.passwordResetToken.create({ data }) as Promise<IPasswordResetToken>;
  }

  async findAll(): Promise<IPasswordResetToken[]> {
    return this.prisma.passwordResetToken.findMany() as Promise<IPasswordResetToken[]>;
  }

  async findById(id: string): Promise<IPasswordResetToken> {
    const token = await this.prisma.passwordResetToken.findUnique({ where: { id } });
    if (!token) throw new NotFoundException(`PasswordResetToken ${id} not found`);
    return token as IPasswordResetToken;
  }

  async update(id: string, data: UpdatePasswordResetTokenInput): Promise<IPasswordResetToken> {
    return this.prisma.passwordResetToken.update({ where: { id }, data }) as Promise<IPasswordResetToken>;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.passwordResetToken.delete({ where: { id } });
  }

  async findByToken(token: string): Promise<IPasswordResetToken | null> {
    return this.prisma.passwordResetToken.findUnique({ where: { token } }) as Promise<IPasswordResetToken | null>;
  }

  async markAsUsed(id: string): Promise<void> {
    await this.prisma.passwordResetToken.update({ where: { id }, data: { usedAt: new Date() } });
  }
}
