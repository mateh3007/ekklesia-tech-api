import { IBaseEntity } from '../base/base.entity';

export interface IChurchPermission extends IBaseEntity {
  churchId: string;
  permissionId: string;
}
