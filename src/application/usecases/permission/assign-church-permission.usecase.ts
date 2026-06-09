import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { IChurchPermission } from 'src/domain/entities/church-permission.entity';
import { ChurchPermissionRepository } from 'src/domain/repositories/church-permission.repository';
import { PermissionRepository } from 'src/domain/repositories/permission.repository';
import { ChurchRepository } from 'src/domain/repositories/church.repository';
import { CacheKeys } from 'src/infra/adapters/cache-key.util';

@Injectable()
export class AssignChurchPermissionUsecase {
  constructor(
    private readonly churchPermissionRepository: ChurchPermissionRepository,
    private readonly permissionRepository: PermissionRepository,
    private readonly churchRepository: ChurchRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(
    churchId: string,
    permissionId: string,
  ): Promise<IChurchPermission> {
    const church = await this.churchRepository.findById(churchId);
    if (!church) throw new NotFoundException('Church not found');

    const permission = await this.permissionRepository.findById(permissionId);
    if (!permission) throw new NotFoundException('Permission not found');

    const alreadyAssigned =
      await this.churchPermissionRepository.findByChurchId(churchId);
    const duplicate = alreadyAssigned.some(
      (cp) => cp.permissionId === permissionId,
    );
    if (duplicate)
      throw new ConflictException('Permission already assigned to this church');

    const result = await this.churchPermissionRepository.assign(
      churchId,
      permissionId,
    );
    await this.cache.delete(CacheKeys.churchPermissions(churchId));
    return result;
  }
}
