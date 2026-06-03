import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/config/prisma/prisma.service';
import { CreateUserInput, IUserResponse, UpdateUserInput, UserRepository } from 'src/domain/repositories/user.repository';
import { IUser } from 'src/domain/entities/user.entity';

@Injectable()
export class PrismaUserRepository extends UserRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  private exclude(user: IUser): IUserResponse {
    const { password: _password, ...rest } = user as any;
    return rest;
  }

  async create(data: CreateUserInput): Promise<IUserResponse> {
    const user = await this.prisma.user.create({ data });
    return this.exclude(user as IUser);
  }

  async findAll(): Promise<IUserResponse[]> {
    const users = await this.prisma.user.findMany();
    return users.map((u) => this.exclude(u as IUser));
  }

  async findById(id: string): Promise<IUserResponse | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return this.exclude(user as IUser);
  }

  async update(id: string, data: UpdateUserInput): Promise<IUserResponse> {
    const user = await this.prisma.user.update({ where: { id }, data });
    return this.exclude(user as IUser);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.prisma.user.findUnique({ where: { email } }) as Promise<IUser | null>;
  }

  async findByChurchId(churchId: string): Promise<IUserResponse[]> {
    const users = await this.prisma.user.findMany({ where: { churchId } });
    return users.map((u) => this.exclude(u as IUser));
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword, passwordChangedAt: new Date() },
    });
  }
}
