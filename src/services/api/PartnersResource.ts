import { AbstractResource } from '@/services/api/AbstractResource'
import { Partner } from '@/services/api/types/Partner'
import { PartnerProduct, PartnerUser } from '@/services/api/types'

class PartnerProductsResource extends AbstractResource<PartnerProduct> {
  protected url = '/partners/:id/products'
}

class PartnerUsersResource extends AbstractResource<PartnerUser> {
  protected url = '/partners/:partnerId/users'

  async findByPartnerId(partnerId: number) {
    return this.get(this.url.replace(':partnerId', `${partnerId}`))
  }

  async create(entity: PartnerUser) {
    return super.create(entity, this.url.replace(':partnerId', `${entity.partnerId}`))
  }
}

export class PartnersResource extends AbstractResource<Partner> {
  protected url = '/partners'

  readonly products = new PartnerProductsResource(this.client)
  readonly users = new PartnerUsersResource(this.client)

  async uploadPicture(id: number, file: File) {
    return this.postMultipart(`${this.url}/${id}/pictures`, file)
  }
}
