import { Entity } from './Entity'

export enum UserTypes {
  Admin = 'admin',
  Partner = 'partner',
  Customer = 'customer'
}

export interface User extends Entity {
  type: UserTypes
}
