import { Customer } from './Customer'
import { Entity } from './Entity'
import { CartProduct } from './CartProduct'
import { Partner } from './Partner'
import { Address } from './Address'

export enum OrderStatuses {
  Created = 'created',
  Canceled = 'canceled',
  AwaitingExecution = 'awaiting_execution',
  InDelivery = 'in_delivery',
  Settled = 'Settled'
}

export interface Order extends Entity {
  customer?: Customer
  partner: Partner
  cart: CartProduct[]
  address: Address
  totalValue: number
  status: OrderStatuses
  statusUpdatedAt: Date
  externalServiceId?: string
}
