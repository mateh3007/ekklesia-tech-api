import { IBaseEntity } from "../base/base.entity";

export interface IAnnouncement extends IBaseEntity {
    churchId: string;
    authorId: string;
    title: string;
    content: string;
    date: Date;
    deletedAt?: Date;
}