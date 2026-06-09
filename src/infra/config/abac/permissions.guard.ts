import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { Role } from 'src/domain/enums/role.enum';
import { ChurchPermissionRepository } from 'src/domain/repositories/church-permission.repository';
import { CacheKeys, CacheTTL } from 'src/infra/adapters/cache-key.util';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { PERMISSIONS_KEY } from './permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly churchPermissionRepository: ChurchPermissionRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) return true;

    const { user } = context.switchToHttp().getRequest<{ user?: IJwtUser }>();
    if (!user) throw new ForbiddenException('Unauthorized');
    if (user.role === Role.SUPERADMIN) return true;

    const cacheKey = CacheKeys.churchPermissions(user.churchId);
    let permissions = await this.cache.get<string[]>(cacheKey);

    if (!permissions) {
      permissions =
        await this.churchPermissionRepository.findPermissionNamesByChurchId(
          user.churchId,
        );
      await this.cache.set(cacheKey, permissions, CacheTTL.PERMISSIONS);
    }

    for (const permissionName of requiredPermissions) {
      if (!permissions.includes(permissionName))
        throw new ForbiddenException(`Missing permission: ${permissionName}`);
    }

    return true;
  }
}
