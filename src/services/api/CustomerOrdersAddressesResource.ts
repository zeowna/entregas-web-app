import { AbstractResource } from "@/services/api/AbstractResource";
import { Address } from "@/services/api/types";

export class CustomerOrdersAddressesResource extends AbstractResource<Address> {
  protected url = '/customers'

  async create(customerId: number, orderId: number, entity: Address) {
    return super.post(`${this.url}/${customerId}/orders/${orderId}/addresses`, entity)
  }
}
