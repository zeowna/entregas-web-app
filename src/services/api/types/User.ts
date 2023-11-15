import { Entity } from './Entity'

export enum UserTypes {
  Admin = 'admin',
  Partner = 'partner',
  Customer = 'customer'
}

export interface User extends Entity {
  name: string
  birthday: Date | string | null
  cpf: string
  email: string
  password?: string
  profilePictureURI?: string
  readonly type?: UserTypes | null
}
