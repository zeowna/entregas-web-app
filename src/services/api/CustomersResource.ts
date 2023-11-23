import { AbstractResource } from '@/services/api/AbstractResource';
import { CustomerUser } from '@/services/api/types';
import { CustomerOrdersResource } from "@/services/api/CustomerOrdersResource";
import { CustomerAddressesResource } from "@/services/api/customerAddressesResource";


export class CustomersResource extends AbstractResource<CustomerUser> {
  protected url = '/customers'

  orders = new CustomerOrdersResource(this.client)
  addresses = new CustomerAddressesResource(this.client);

  async create(entity: CustomerUser) {
    return super.post(this.url, entity)
  }

  async update(id: number, entity: CustomerUser) {
    return super.patch(`${this.url}/${id}`, entity)
  }
}
