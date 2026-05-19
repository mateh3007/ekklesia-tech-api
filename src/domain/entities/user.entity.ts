import { IBaseEntity } from "../base/base.entity"
import { Role } from "../enums/role.enum"

export interface IUser extends IBaseEntity {
    name: string
    email: string
    password: string
    phone: string
    role: Role
    churchId: string
}