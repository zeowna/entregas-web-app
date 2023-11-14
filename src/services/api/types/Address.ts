import { Entity } from '@/services/api/types/Entity'

export interface Address extends Entity {
  cep: string
  street: string
  neighbourhood: string
  number: number | null
  complement?: string
  city: string
  state: string
  lat?: number
  lng?: number
}
