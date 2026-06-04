import { IBaseEntity } from '../base/base.entity';
import { PixKeyType } from '../enums/pix-key-type.enum';

export interface IChurchProfile extends IBaseEntity {
  churchId: string;
  name: string;
  description?: string;
  logoUrl?: string;
  foundedAt?: Date;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  phone?: string;
  contactEmail?: string;
  whatsapp?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  pixKey?: string;
  pixKeyType?: PixKeyType;
  deletedAt?: Date;
}
