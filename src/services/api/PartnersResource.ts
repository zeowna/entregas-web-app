import { AbstractResource } from '@/services/api/AbstractResource'
import { Partner } from '@/services/api/types/Partner'
import { Address, FindEntitiesPaging, PartnerProduct, PartnerUser } from '@/services/api/types'

class PartnerProductsResource extends AbstractResource<PartnerProduct> {
  protected url = '/partners/:id/products'
}

class PartnerUsersResource extends AbstractResource<PartnerUser> {
  protected url = '/partners'

  async find(params: FindEntitiesPaging = {}) {
    const { partnerId } = params.conditions

    params.conditions.partnerId = undefined

    return super.find(params, `${this.url}/${partnerId}/users`)
  }

  async findByPartnerIdAndId(partnerId: number, id: number) {
    return this.get(`${this.url}/${partnerId}/users/${id}`)
  }

  async create(entity: PartnerUser) {
    return super.create(entity, `${this.url}/${entity.partnerId}/users`)
  }

  async update(id: number, entity: PartnerUser) {
    return super.update(id, entity, `${this.url}/${entity.partnerId}/users/${id}`)
  }

  async uploadPicture(partnerId: number, id: number, file: File) {
    return this.postMultipart(`${this.url}/${partnerId}/users/${id}/pictures`, file)
  }
}

class PartnerAddressesResource extends AbstractResource<Address> {
  protected url = '/partners'

  async createAddress(partnerId: number, entity: Address) {
    return super.post(`${this.url}/${partnerId}/addresses`, entity)
  }

  async updateAddress(partnerId: number, addressId: number, entity: Address) {
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
