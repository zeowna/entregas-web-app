import { AbstractResource } from '@/services/api/AbstractResource'
import { Partner } from '@/services/api/types/Partner'
import { Address, PartnerProduct, PartnerUser } from '@/services/api/types'

class PartnerProductsResource extends AbstractResource<PartnerProduct> {
  protected url = '/partners/:id/products'
}

class PartnerUsersResource extends AbstractResource<PartnerUser> {
  protected url = '/partners'

  async findByPartnerId(partnerId: number) {
    return this.get(`${this.url}/${partnerId}/users`)
  }

  async create(entity: PartnerUser) {
    return super.create(entity, this.url.replace(':partnerId', `${entity.partnerId}`))
  }
}

class PartnerAddressesResource extends AbstractResource<Address> {
  protected url = '/partners'

  async createPartnerUser(partnerId: number, entity: Address) {
    return super.post(`${this.url}/${partnerId}/addresses`, entity)
  }

  async updatePartnerUser(partnerId: number, addressId: number, entity: Address) {
    return super.patch(`${this.url}/${partnerId}/addresses/${addressId}`, entity)
  }
}

export class PartnersResource extends AbstractResource<Partner> {
  protected url = '/partners'

  readonly products = new PartnerProductsResource(this.client)
  readonly users = new PartnerUsersResource(this.client)
  readonly addresses = new PartnerAddressesResource(this.client)

  async uploadPicture(id: number, file: File) {
    return this.postMultipart(`${this.url}/${id}/pictures`, file)
  }
}
