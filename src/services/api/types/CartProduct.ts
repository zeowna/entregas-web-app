import { Entity } from '@/services/api/types/Entity'
import { PartnerProduct } from '@/services/api/types/PartnerProduct'
import { User } from '@/services/api/types/User'

export interface CartProduct extends Entity {
  customer?: User
  partnerProduct: Partial<PartnerProduct>
  partnerProductId: number
  quantity: number
  value: number
  totalValue: number
}
