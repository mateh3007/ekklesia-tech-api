import { IBaseEntity } from "../base/base.entity";

export interface IPrayerRequest extends IBaseEntity {
    churchId: string;
    authorId: string;
    name: string;
    request: string;
    deletedAt?: Date;
}