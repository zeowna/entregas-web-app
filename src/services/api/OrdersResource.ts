import { AbstractResource } from '@/services/api/AbstractResource';

export class OrdersResource extends AbstractResource<OrdersResource> {
  protected url = '/orders'
}
