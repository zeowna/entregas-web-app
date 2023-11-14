import { AbstractResource } from '@/services/api/AbstractResource'
import { Order } from '@/services/api/types'

export class OrdersResource extends AbstractResource<Order> {
  protected url = '/orders'
}
