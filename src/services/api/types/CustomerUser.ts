import type { Entity } from './Entity'
import type { Address } from './Address'

export interface CustomerUser extends Entity {
  name: string
  birthday: string | Date
  cpf: string
  email: string
  profilePictureURI?: string
  addresses?: Address[]
  password: string
}
