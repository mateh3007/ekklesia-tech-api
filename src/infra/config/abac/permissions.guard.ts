import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ChurchPermissionRepository } from 'src/domain/repositories/church-permission.repository';
import { PERMISSIONS_KEY } from './permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly churchPermissionRepository: ChurchPermissionRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();

    for (const permissionName of requiredPermissions) {
      const has = await this.churchPermissionRepository.hasPermission(user?.churchId, permissionName);
      if (!has) throw new ForbiddenException(`Missing permission: ${permissionName}`);
    }

    return true;
  }
}
