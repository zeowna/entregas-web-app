import { AbstractResource } from '@/services/api/AbstractResource'
import { Partner } from '@/services/api/types/Partner'
import { PartnerProductsResource } from '@/services/api/PartnerProductsResource'
import { PartnerUsersResource } from '@/services/api/PartnerUsersResource'
import { PartnerAddressesResource } from '@/services/api/PartnerAddressesResource'
import { FindEntitiesPaging, FindEntitiesResponse } from '@/services/api/types'

export class PartnersResource extends AbstractResource<Partner> {
  protected url = '/partners'

  readonly products = new PartnerProductsResource(this.client)
  readonly users = new PartnerUsersResource(this.client)
  readonly addresses = new PartnerAddressesResource(this.client)

  async find({
    conditions = {},
    skip = 0,
    limit = 15,
    sort = { updatedAt: -1 }
  }: FindEntitiesPaging = {}) {
    return this.get<FindEntitiesResponse<Partner>>(this.url, {
      conditions: JSON.stringify(conditions),
      skip,
      limit,
      sort: JSON.stringify(sort)
    })
  }

  async findById(id: number) {
    return super.get(`${this.url}/${id}`)
  }

  async create(entity: Partner) {
    return this.post(this.url, entity)
  }

  async update(id: number, entity: Partner) {
    return this.patch(`${this.url}/${id}`, entity)
  }

  async uploadPicture(id: number, file: File) {
    return this.postMultipart(`${this.url}/${id}/pictures`, file)
  }
}
