import { CustomerUser } from './CustomerUser'
import { Entity } from './Entity'
import { CartProduct } from './CartProduct'
import { Partner } from './Partner'
import { Address } from './Address'

export enum OrderStatus {
  Created = 'created',
  CanceledByPartner = 'canceled_by_partner',
  CanceledByCustomer = 'canceled_by_customer',
  AcceptedByPartner = 'accepted_by_Partner',
  RefusedByPartner = 'refused_by_Partner',
  AwaitingExecution = 'awaiting_execution',
  InDelivery = 'in_delivery',
  Settled = 'settled'
}

export enum OrderPaymentMethods {
  DebitCardLocation = 'debit_card_location',
  CreditCardLocation = 'credit_card_location',
  CashLocation = 'cash_location',
  CardRemote = 'card_remote'
}

export interface Order extends Entity {
  partnerId: number
  customer?: CustomerUser
  partner?: Partner
  cart?: CartProduct[]
  address?: Address
  totalValue?: number
  status?: OrderStatus
  statusUpdatedAt?: Date
  paymentMethod: OrderPaymentMethods
  changeValue?: number
  externalServiceId?: string
}
