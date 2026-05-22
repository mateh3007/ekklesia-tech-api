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
    }) as Promise<IChurchPermission[]>;
  }

  async hasPermission(churchId: string, permissionName: string): Promise<boolean> {
    const record = await this.prisma.churchPermission.findFirst({
      where: {
        churchId,
        permission: { name: permissionName },
      },
    });
    return !!record;
  }
}
