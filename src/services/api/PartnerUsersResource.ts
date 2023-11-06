import { AbstractResource } from '@/services/api/AbstractResource'
import { FindEntitiesPaging, FindEntitiesResponse, PartnerUser } from '@/services/api/types'

export class PartnerUsersResource extends AbstractResource<PartnerUser> {
  protected url = '/partners'

  async find(
    partnerId: number,
    { conditions = {}, skip = 0, limit = 15, sort = { updatedAt: -1 } }: FindEntitiesPaging = {}
  ) {
    return this.get<FindEntitiesResponse<PartnerUser>>(`${this.url}/${partnerId}/users`, {
      conditions: JSON.stringify(conditions),
      skip,
      limit,
      sort: JSON.stringify(sort)
    })
  }

  async findByPartnerIdAndId(partnerId: number, id: number) {
    return this.get(`${this.url}/${partnerId}/users/${id}`)
  }

  async create(partnerId: number, entity: PartnerUser) {
    return super.post(`${this.url}/${partnerId}/users`, entity)
  }

  async update(partnerId: number, id: number, entity: PartnerUser) {
    return super.patch(`${this.url}/${partnerId}/users/${id}`, entity)
  }

  async uploadProfilePicture(partnerId: number, id: number, file: File) {
    return this.postMultipart(`${this.url}/${partnerId}/users/${id}/pictures`, file)
  }
}
