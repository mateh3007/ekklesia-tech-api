import { IBaseEntity } from "../base/base.entity";

export interface IChurchServiceRecord extends IBaseEntity {
    churchId: string;
    serviceId?: string;
    preacher: string;
    topic: string;
    bibleVerse?: string;
    notes?: string;
    date: Date;
    deletedAt?: Date;
}