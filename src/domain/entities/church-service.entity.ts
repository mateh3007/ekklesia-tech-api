import { IBaseEntity } from '../base/base.entity';
import { Day } from '../enums/day.enu';

export interface IChurchService extends IBaseEntity {
  churchId: string;
  title: string;
  description: string;
  day: Day;
  startsAt: string;
  endsAt: string;
  isOnline: boolean;
  streamUrl?: string;
}
