import { AbstractResource } from '@/services/api/AbstractResource'
import { FindEntitiesPaging, FindEntitiesResponse, PartnerProduct } from '@/services/api/types'

export class PartnerProductsResource extends AbstractResource<PartnerProduct> {
  protected url = '/partners'

  async find(
    partnerId: number,
    { conditions = {}, skip = 0, limit = 15, sort = { updatedAt: -1 } }: FindEntitiesPaging = {}
  ) {
    return this.get<FindEntitiesResponse<PartnerProduct>>(`${this.url}/${partnerId}/products`, {
      conditions: JSON.stringify(conditions),
      skip,
      limit,
      sort: JSON.stringify(sort)
    })
  }

  async findByPartnerIdAndId(partnerId: number, id: number) {
    return this.get(`${this.url}/${partnerId}/products/${id}`)
  }

  async create(partnerId: number, entity: PartnerProduct) {
    return super.post(`${this.url}/${partnerId}/products`, entity)
  }

  async update(partnerId: number, id: number, entity: PartnerProduct) {
    return super.patch(`${this.url}/${partnerId}/products/${id}`, entity)
  }
}
