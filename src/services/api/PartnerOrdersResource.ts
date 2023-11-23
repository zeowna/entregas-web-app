import { AbstractResource } from '@/services/api/AbstractResource'
import { FindEntitiesPaging, FindEntitiesResponse, Order, OrderStatus } from '@/services/api/types'

export class PartnerOrdersResource extends AbstractResource<Order> {
  protected url = '/partners'

  async find(
    partnerId: number,
    { conditions = {}, skip = 0, limit = 15, sort = { updatedAt: -1 } }: FindEntitiesPaging = {}
  ) {
    return super.get<FindEntitiesResponse<Order>>(`${this.url}/${partnerId}/orders`, {
      conditions: JSON.stringify(conditions),
      skip,
      limit,
      sort: JSON.stringify(sort)
    })
  }

  async findById(partnerId: number, id: number) {
    return super.get(`${this.url}/${partnerId}/orders/${id}`)
  }

  async updateStatus(partnerId: number, id: number, status: OrderStatus) {
    return super.patch(`${this.url}/${partnerId}/orders/${id}`, { status })
  }
}
