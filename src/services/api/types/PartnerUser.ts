import { User, UserTypes } from '@/services/api/types/User'
import { Partner } from '@/services/api/types/Partner'

export interface PartnerUser extends User {
  partner?: Partner
  partnerId?: number | null
  readonly type?: UserTypes.Partner | null
}
