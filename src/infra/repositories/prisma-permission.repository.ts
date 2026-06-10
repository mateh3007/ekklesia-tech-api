import { Injectable, NotFoundException } from '@nestjs/common';
import { IPermission } from 'src/domain/entities/permission.entity';
import { PermissionRepository } from 'src/domain/repositories/permission.repository';
import { PrismaService } from 'src/infra/config/prisma/prisma.service';

@Injectable()
export class PrismaPermissionRepository extends PermissionRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findAll(): Promise<IPermission[]> {
    return this.prisma.permission.findMany();
  }

  async findById(id: string): Promise<IPermission> {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    });
    if (!permission) throw new NotFoundException(`Permission ${id} not found`);
    return permission;
  }

  async findByName(name: string): Promise<IPermission | null> {
    return this.prisma.permission.findUnique({
      where: { name },
    });
  }
}
