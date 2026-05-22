import { IBaseEntity } from "../base/base.entity";

export interface IPermission extends IBaseEntity {
    name: string;
    description: string;
}