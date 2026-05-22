import { IPermission } from '../entities/permission.entity';

export abstract class PermissionRepository {
  abstract findAll(): Promise<IPermission[]>;
  abstract findById(id: string): Promise<IPermission>;
  abstract findByName(name: string): Promise<IPermission | null>;
}
