import { Entity } from '@/services/api/types/Entity'
import { Address } from '@/services/api/types/Address'

export enum PartnerStatuses {
  Active = 'active',
  Inactive = 'inactive'
}

export interface Partner extends Entity {
  name: string
  cnpj: string
  openingHours: string
  closingHours: string
  status: PartnerStatuses
  pictureURI?: string
  address: Address
}
