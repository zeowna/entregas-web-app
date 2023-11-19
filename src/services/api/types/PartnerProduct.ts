import { Entity } from '@/services/api/types/Entity'
import { Partner } from '@/services/api/types/Partner'
import { Product } from '@/services/api/types/Product'

export enum PartnerProductStatus {
  Active = 'active',
  Inactive = 'inactive'
}

export interface PartnerProduct extends Entity {
  name?: string
  partner?: Partner
  product?: Partial<Product>
  productId?: number
  value: number
  inStockQuantity: number
  status: PartnerProductStatus
}
