import { IBaseEntity } from '../base/base.entity';

export interface IMember extends IBaseEntity {
  churchId: string;
  name: string;
  phone?: string;
  dateOfBirth: Date;
}
