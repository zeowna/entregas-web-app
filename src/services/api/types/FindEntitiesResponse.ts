import { Entity } from '@/services/api/types/Entity'

export interface FindEntitiesResponse<T extends Entity> {
  list: T[]

  count: number

  skip: number

  limit: number

  pages: number
}
