import { Entity } from '@/services/api/types/Entity'
import { ProductCategory } from '@/services/api/types/ProductCategory'

export enum ProductStatus {
  Active = 'active',
  Inactive = 'inactive'
}

export interface Product extends Entity {
  name: string

  category: ProductCategory

  size: string

  status: ProductStatus

  pictureURI?: string
}
