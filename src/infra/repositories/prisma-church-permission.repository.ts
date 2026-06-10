import { Injectable } from '@nestjs/common';
import { IChurchPermission } from 'src/domain/entities/church-permission.entity';
import { ChurchPermissionRepository } from 'src/domain/repositories/church-permission.repository';
import { PrismaService } from 'src/infra/config/prisma/prisma.service';

@Injectable()
export class PrismaChurchPermissionRepository extends ChurchPermissionRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findByChurchId(churchId: string): Promise<IChurchPermission[]> {
    return this.prisma.churchPermission.findMany({
      where: { churchId },
    });
  }

  async findPermissionNamesByChurchId(churchId: string): Promise<string[]> {
    const records = await this.prisma.churchPermission.findMany({
      where: { churchId },
      include: { permission: { select: { name: true } } },
    });
    return records.map((r) => r.permission.name);
  }

  async hasPermission(
    churchId: string,
    permissionName: string,
  ): Promise<boolean> {
    const record = await this.prisma.churchPermission.findFirst({
      where: {
        churchId,
        permission: { name: permissionName },
      },
    });
    return !!record;
  }

  async assign(
    churchId: string,
    permissionId: string,
  ): Promise<IChurchPermission> {
    return this.prisma.churchPermission.create({
      data: { churchId, permissionId },
    });
  }
}
