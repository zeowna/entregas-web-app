import { AbstractResource } from '@/services/api/AbstractResource'
import { AdminUser } from '@/services/api/types/AdminUser'
import { FindEntitiesPaging } from '@/services/api/types/FindEntitiesPaging'
import { FindEntitiesResponse } from '@/services/api/types/FindEntitiesResponse'

export class AdminUsersResource extends AbstractResource<AdminUser> {
  protected url = '/admin/users'

  async find({
    conditions = {},
    skip = 0,
    limit = 15,
    sort = { updatedAt: -1 }
  }: FindEntitiesPaging = {}) {
    return this.get<FindEntitiesResponse<AdminUser>>(this.url, {
      conditions: JSON.stringify(conditions),
      skip,
      limit,
      sort: JSON.stringify(sort)
    })
  }

  async findById(id: number) {
    return this.get(`${this.url}/${id}`)
  }

  async create(entity: AdminUser) {
    return super.post(this.url, entity)
  }

  async update(id: number, entity: AdminUser) {
    return super.patch(`${this.url}/${id}`, entity)
  }

  async uploadPicture(id: number, file: File) {
    return this.postMultipart(`${this.url}/${id}/pictures`, file)
  }
}
