import { IBaseEntity } from '../base/base.entity';

export interface IChurch extends IBaseEntity {
  corporateName: string;
  cnpj: string;
  email: string;
  phone: string;
}
