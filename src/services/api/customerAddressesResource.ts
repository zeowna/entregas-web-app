import { AbstractResource } from "@/services/api/AbstractResource";
import { Address } from "@/services/api/types";

export class CustomerAddressesResource extends AbstractResource<Address> {
  protected url = '/customers'

  async create(customerId: number, entity: Address) {
    return super.post(`${this.url}/${customerId}/addresses`, entity)
  }

  async remove(customerId: number, id: number) {
    return super.delete(`${this.url}/${customerId}/addresses/${id}`)
  }
}
