import { AbstractResource } from '@/services/api/AbstractResource';
import { Customer } from '@/services/api/types';

export class CustomersResource extends AbstractResource<Customer> {
  protected url = '/customers'
}
