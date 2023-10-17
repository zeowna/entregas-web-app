import { Entity } from '@/services/api/types/Entity'

export interface FindEntitiesResponse<T extends Entity> {
  readonly list: T[]

  readonly count: number

  readonly skip: number

  readonly limit: number

  readonly pages: number
}
