import { IBaseEntity } from "../base/base.entity"

export interface IChurchEvent extends IBaseEntity{
    churchId: string
    title: string
    description: string
    date: Date
}