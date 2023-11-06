import { AbstractResource } from '@/services/api/AbstractResource'
import { Address } from '@/services/api/types'

export class PartnerAddressesResource extends AbstractResource<Address> {
  protected url = '/partners'

  async create(partnerId: number, entity: Address) {
    return super.post(`${this.url}/${partnerId}/addresses`, entity)
  }

  async update(partnerId: number, addressId: number, entity: Address) {
    return super.patch(`${this.url}/${partnerId}/addresses/${addressId}`, entity)
  }
}
