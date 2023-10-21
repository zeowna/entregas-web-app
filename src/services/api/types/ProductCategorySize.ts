import { Entity } from '@/services/api/types/Entity'

export interface ProductCategorySize extends Entity {
  name: string
  categoryId?: number
}
