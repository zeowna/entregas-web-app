import { Entity } from '@/services/api/types/Entity'
import { Partner } from '@/services/api/types/Partner'
import { Product } from '@/services/api/types/Product'

export enum PartnerProductStatuses {
  Active = 'active',
  Inactive = 'inactive'
}

export interface PartnerProduct extends Entity {
  partner: Partner
  product: Partial<Product>
  value: number
  status: PartnerProductStatuses
  inStockQuantity?: number
}
