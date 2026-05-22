import { IChurchPermission } from '../entities/church-permission.entity';

export abstract class ChurchPermissionRepository {
  abstract findByChurchId(churchId: string): Promise<IChurchPermission[]>;
  abstract hasPermission(churchId: string, permissionName: string): Promise<boolean>;
}
