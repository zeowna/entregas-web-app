import { User } from '@/services/api/types/User'
import { Entity } from '@/services/api/types/Entity'

export interface AuthResponse extends Entity {
  authorization_token: string
  user: User
}
